package org.aktin.dwh.admin.updater;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Objects;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

/**
 * Triggers and monitors DWH updates through the socket services of the AKTIN 'updateagent' Debian package.
 *
 * <p>The updateagent listens on two ports, one for reading the installed and candidate version via 'apt-cache policy' and one for 'apt-get install &lt;this dwh&gt;'.
 * Inside a Docker container it is reached via {@code host.docker.internal} on ports 1004/1005, otherwise via {@code localhost}
 * on ports 1002/1003. Without the updateagent, all update operations fail.</p>
 *
 * <p>Docker deployments must meet all of the following, otherwise the GUI silently reports the agent as not installed:</p>
 * <ul>
 *     <li>{@code /.dockerenv} is only created by Docker Engine, other runtimes (e.g. Podman) are detected as non-Docker.</li>
 *     <li>On Linux, {@code host.docker.internal} only resolves with
 *     {@code extra_hosts: ["host.docker.internal:host-gateway"]} in the compose file.</li>
 *     <li>{@link PreferenceKey#updateDataPath} must be bind mounted from the host into the container.</li>
 * </ul>
 */
@Singleton
public class UpdateManager {

    private static final Logger LOGGER = Logger.getLogger(UpdateManager.class.getName());

    // reset once the agent rewrites the result file
    private boolean isUpdateInProgress = false;

    // lastUpdateTime of the result file before the running update was triggered
    private String lastUpdateTimeBeforeUpdate;

    private static final boolean DOCKER = Files.exists(Paths.get("/.dockerenv"));

    private static final String HOST = DOCKER ? "host.docker.internal" : "localhost";

    private static final int APT_UPDATE_PORT = DOCKER ? 1004 : 1002;

    private static final int DWH_UPDATE_PORT = DOCKER ? 1005 : 1003;

    // 'date' output of the updateagent, e.g. "Wed Nov 11 02:04:04 PM UTC 2026"
    private static final DateTimeFormatter AGENT_TIME_FORMAT = DateTimeFormatter.ofPattern("EEE MMM d hh:mm:ss a zzz yyyy", Locale.US);

    @Inject
    Preferences preferences;

    /**
     * Triggers an initial update status refresh.
     */
    @PostConstruct
    void initialize() {
        LOGGER.log(Level.INFO, "Initializing updater for " + HOST + " and triggering update status refresh...");
        refreshUpdateStatus();
    }

    /**
     * Checks if the update agent is installed via the existence of the update directory.
     * Only while the directory is missing, the agent is touched once, as it creates the directory on its first connect.
     * @return {@code true} if the update directory exists
     */
    public boolean isUpdateAgentInstalled() {
        // check if a update path exist. Update agent always creates the path under "/var/lib/aktin/update"
        Path updatePath = Paths.get(preferences.get(PreferenceKey.updateDataPath));
        boolean updatePathExists = Files.exists(updatePath);
        LOGGER.log(Level.FINE, "Update path validation returned: "+updatePathExists);

        if (!updatePathExists) {
            boolean socketReached = touch(HOST, APT_UPDATE_PORT);   // let updateagent create the update directory
            LOGGER.log(Level.FINE, "Update agent connection on port "+APT_UPDATE_PORT+" returned: "+socketReached);
            updatePathExists = Files.exists(updatePath);
            LOGGER.log(Level.FINE, "Update path validation returned: "+updatePathExists);
        }

        return updatePathExists;
    }

    /**
     * Retrieves the current update status, composed of version information and
     * the result of the last update attempt. Version information from a check
     * that does not postdate the last update is ignored as outdated.
     *
     * @return an {@link UpdateStatus} object, or {@code null} if no status
     *         information is available yet
     */
    public UpdateStatus getUpdateStatus() {
        UpdateStatus status = new UpdateStatus();
        boolean hasData = false;

        try {
            Path resultPath = getResultPath();
            Path infoPath = getInfoPath();
            if (Files.exists(resultPath)) {
                Properties resultProps = readPropertiesFileFromPath(resultPath);
                status.setSuccess(Boolean.parseBoolean(resultProps.getProperty(UpdateServiceFileKey.SUCCESS.toString())));
                status.setLastUpdateTime(resultProps.getProperty(UpdateServiceFileKey.LAST_UPDATE.toString()));
                hasData = true;
            }
            if (Files.exists(infoPath)) {
                Properties infoProps = readPropertiesFileFromPath(infoPath);
                String lastCheckTime = infoProps.getProperty(UpdateServiceFileKey.LAST_CHECK.toString());
                if (isCheckedAfterUpdate(lastCheckTime, status.getLastUpdateTime())) {
                    status.setInstalledVersion(infoProps.getProperty(UpdateServiceFileKey.INSTALLED.toString()));
                    status.setCandidateVersion(infoProps.getProperty(UpdateServiceFileKey.CANDIDATE.toString()));
                    status.setLastCheckTime(lastCheckTime);
                    hasData = true;
                } else {
                    LOGGER.log(Level.FINE, "Ignoring info file, its version check predates the last update");
                }
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Error reading update status files", e);
        }
        return hasData ? status : null;
    }

    /**
     * Checks if the version check happened after the last update, otherwise its versions are outdated.
     * @param lastCheckTime version check time of the info file
     * @param lastUpdateTime update time of the result file, {@code null} if no update happened yet
     * @return {@code true} if the info file can be used
     */
    private boolean isCheckedAfterUpdate(String lastCheckTime, String lastUpdateTime) {
        if (lastUpdateTime == null) {
            return true;
        }
        return lastCheckTime != null && parseAgentTime(lastCheckTime).isAfter(parseAgentTime(lastUpdateTime));
    }

    /**
     * Parses a timestamp written by the updateagent, collapsing the space padding of single digit days.
     */
    private ZonedDateTime parseAgentTime(String time) {
        return ZonedDateTime.parse(time.trim().replaceAll("\\s+", " "), AGENT_TIME_FORMAT);
    }

    private Properties readPropertiesFileFromPath(Path path) throws IOException {
        Properties properties = new Properties();
        try (Reader input = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
            properties.load(input);
        }
        return properties;
    }

    private Path getResultPath() {
        return Paths.get(preferences.get(PreferenceKey.updateDataPath), "result");
    }

    private Path getInfoPath() {
        return Paths.get(preferences.get(PreferenceKey.updateDataPath), "info");
    }

    /**
     * Retrieves the textual content of the update operation log.
     *
     * @return the log as a {@link String}, or {@code null} if no log exists
     */
    public String getUpdateLog() {
        try {
            Path path = Paths.get(preferences.get(PreferenceKey.updateDataPath), "log");
            return Files.exists(path) ? String.join("\n", Files.readAllLines(path)) : null;
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Could not read update service log", e);
            return null;
        }
    }

    /**
     * This method connects to the AKTIN update agent socket responsible for writing the installed
     * data warehouse version and the latest available candidate version into a data directory.
     * @return - {@code true}: request was sent
     *         - {@code false}: request could not be sent, update agent is not installed
     */
    public boolean refreshUpdateStatus() {
        LOGGER.log(Level.INFO, "Started apt-cache policy service");
        return touch(HOST, APT_UPDATE_PORT);
    }

    /**
     * This method connects to the AKTIN update agent socket responsible for executing
     * the update process for a data warehouse.
     * @return - true:  update request was sent (does not mean update is finished or was successful)
     *         - false: update request could not be sent, update agent is not installed or an update is already in progress
     */
    public synchronized boolean executeDwhUpdate() {
        if (!isUpdateAgentInstalled() || isUpdateInProgress()) {
            return false;
        }
        lastUpdateTimeBeforeUpdate = getLastUpdateTime();
        LOGGER.log(Level.INFO, "Started dwh-update service");
        isUpdateInProgress = touch(HOST, DWH_UPDATE_PORT);
        return isUpdateInProgress;
    }

    /**
     * Opens and immediately closes a TCP connection to signal the target, without sending content.
     * @param host target's network address
     * @param port target's port to connect to
     * @return - {@code true} if the connection was established,
     *         - {@code false} if the host is unknown, the connection was refused or timed out
     */
    public boolean touch(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 5000);
            LOGGER.log(Level.INFO, "Socket operation completed on {0}:{1}", new Object[]{host, port});
            return true;
        } catch (IOException e) {
            LOGGER.log(Level.FINE, "Could not connect to " + host + ":" + port + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Returns whether an update operation is currently running. The update counts as finished once the
     * lastUpdateTime of the result file changed, as the agent rewrites it on success and on failure.
     *
     * @return {@code true} if an update is in progress
     */
    public synchronized boolean isUpdateInProgress() {
        if (isUpdateInProgress && !Objects.equals(getLastUpdateTime(), lastUpdateTimeBeforeUpdate)) {
            isUpdateInProgress = false;
        }
        return isUpdateInProgress;
    }

    private String getLastUpdateTime() {
        UpdateStatus status = getUpdateStatus();
        return status != null ? status.getLastUpdateTime() : null;
    }

}
