package org.aktin.dwh.admin.updater;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Inject;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

/**
 * Shared update manager implementation for environment-specific update agents.
 *
 * <p>Concrete implementations only need to pass the target host and ports
 * for the socket-based update agent communication to the constructor and
 * provide the environment detection used by {@link UpdaterManager}.</p>
 */
public abstract class AbstractUpdater implements Updater {

    private static final Logger LOGGER = Logger.getLogger(AbstractUpdater.class.getName());

    private final AtomicBoolean isUpdateInProgress = new AtomicBoolean(false);

    private final String host;

    private final int aptUpdatePort;

    private final int dwhUpdatePort;

    @Inject
    Preferences preferences;

    /**
     * @param host          update agent's network address
     * @param aptUpdatePort port of the apt-list-reload service
     * @param dwhUpdatePort port of the dwh-update service
     */
    protected AbstractUpdater(String host, int aptUpdatePort, int dwhUpdatePort) {
        this.host = host;
        this.aptUpdatePort = aptUpdatePort;
        this.dwhUpdatePort = dwhUpdatePort;
    }

    /**
     * Triggers an initial APT package list reload.
     */
    @Override
    public void initialize() {
        LOGGER.log(Level.INFO, "Initializing " + getClass().getSimpleName() + " and triggering APT package list reload...");
        refreshUpdateStatus();
    }

    /**
     * Check if update agent is installed by attempting a connection to the socket and validating if a
     * update directory has been created/exists.
     * @return
     */
    @Override
    public boolean isUpdateAgentInstalled() {
        boolean isInstalled = false;

        // connect to socket, remember success status
        boolean socketReached = touch(host, aptUpdatePort);
        LOGGER.log(Level.INFO, "Update agent connection on port "+aptUpdatePort+" returned: "+socketReached);

        // check if a update path exist. Update agent always creates the path under "/var/lib/aktin/update", so
        // todo: PreferenceKey.updateDataPath should not be allowed to have another value.
        Path updatePath = Paths.get(preferences.get(PreferenceKey.updateDataPath));
        boolean updatePathExists = Files.exists(updatePath);
        LOGGER.log(Level.INFO, "Update path validation returned: "+updatePathExists);

        if (socketReached && updatePathExists) {
            isInstalled = true;
        }
        return isInstalled;
    }

    @Override
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
                status.setInstalledVersion(infoProps.getProperty(UpdateServiceFileKey.INSTALLED.toString()));
                status.setCandidateVersion(infoProps.getProperty(UpdateServiceFileKey.CANDIDATE.toString()));
                status.setLastCheckTime(infoProps.getProperty(UpdateServiceFileKey.LAST_CHECK.toString()));
                hasData = true;
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Error reading update status files", e);
        }
        return hasData ? status : null;
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

    @Override
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
    @Override
    public boolean refreshUpdateStatus() {
        if (!isUpdateAgentInstalled()) {
            return false;
        }
        LOGGER.log(Level.INFO, "Started apt-reload service");
        return touch(host, aptUpdatePort);
    }

    /**
     * This method connects to the AKTIN update agent socket responsible for executing
     * the update process for a data warehouse.
     * @return - true:  update request was sent (does not mean update is finished or was successful)
     *         - false: update request could not be sent, update agent is not installed
     */
    @Override
    public boolean executeDwhUpdate() {
        if (!isUpdateAgentInstalled() || isUpdateInProgress()) {
            return false;
        }
        LOGGER.log(Level.INFO, "Started dwh-update service");
        boolean success = touch(host, dwhUpdatePort);
        this.isUpdateInProgress.set(success);
        return success;
    }

    /**
     * Opens and immediately closes a TCP connection to signal the target, without sending content.
     * @param host target's network address
     * @param port target's port to connect to
     * @return - {@code true} if the connection was established,
     *         - {@code false} if the host is unknown, the connection was refused or timed out
     */
    public static boolean touch(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 5000);
            LOGGER.log(Level.INFO, "Socket operation completed on {0}:{1}", new Object[]{host, port});
            return true;
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "I/O error during socket operation on " + host + ":" + port, e);
            return false;
        }
    }

    @Override
    public boolean isUpdateInProgress() {
        return this.isUpdateInProgress.get();
    }

}
