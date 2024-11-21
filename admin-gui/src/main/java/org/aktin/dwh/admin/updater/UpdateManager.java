package org.aktin.dwh.admin.updater;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.Reader;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Inject;
import javax.inject.Singleton;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

/**
 * Manages DWH (Data Warehouse) update operations and status tracking.
 * This singleton class handles update agent verification, status checks,
 * and execution of update operations through socket communication.
 *
 * Update operations are performed asynchronously and their status is tracked
 * through property files in a configured update directory.
 *
 * <p><b>Implementation Note:</b>
 * This manager relies on the 'updateagent' Debian package being installed on the system.
 * The updateagent package:
 * <ul>
 *   <li>Creates the required update directory structure</li>
 *   <li>Installs a service listening on port 1002 for executing 'apt-get update'</li>
 *   <li>Installs a service listening on port 1003 for executing 'apt-get install &lt;this dwh&gt;'</li>
 * </ul>
 * Without this package installed, all update operations will fail as the required
 * directory structure and services will not be present.
 */
@Singleton
public class UpdateManager {

    private static final Logger LOGGER = Logger.getLogger(UpdateManager.class.getName());
    /**
     * Port used by the updateagent service for APT package list updates (apt-get update)
     */
    private static final int APT_UPDATE_PORT = 1002;
    /**
     * Port used by the updateagent service for DWH package updates (apt-get install)
     */
    private static final int DWH_UPDATE_PORT = 1003;
    private static final int SOCKET_TIMEOUT = 5000;

    @Inject
    Preferences preferences;

    private CompletableFuture<Boolean> currentUpdate;


    /**
     * Checks if the update agent is installed by verifying the existence
     * of the update directory specified in preferences.
     *
     * This directory should be created by the updateagent Debian package
     * during installation. If the directory doesn't exist, it indicates
     * that the updateagent package is not installed.
     *
     * @return true if the update agent is installed, false otherwise
     */
    public boolean isUpdateAgentInstalled() {
        Path updatePath = Paths.get(preferences.get(PreferenceKey.updateDataPath));
        return Files.exists(updatePath);
    }

    /**
     * Retrieves the current update status by reading and combining information
     * from both result and info property files.
     *
     * These files are managed by the updateagent package services and contain
     * information about current and available versions, as well as update results.
     *
     * @return UpdateStatus object containing version and status information,
     *         or null if no status information is available
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

    /**
     * Reads a properties file from the specified path.
     *
     * @param path Path to the properties file
     * @return Properties object containing the file contents
     * @throws IOException if the file cannot be read
     * @throws FileNotFoundException if the file does not exist
     */
    private Properties readPropertiesFileFromPath(Path path) throws IOException {
        Properties properties = new Properties();
        if (!Files.exists(path)) {
            throw new FileNotFoundException("Properties file not found: " + path);
        }
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
     * Retrieves the update operation log content.
     *
     * @return String containing the log content, or null if no log exists or cannot be read
     */
    public String getUpdateLog() {
        try {
            Path path = Paths.get(preferences.get(PreferenceKey.updateDataPath), "log");
            return Files.exists(path) ? String.join("\n", Files.readAllLines(path)) : null;
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Could not read update service log");
            return null;
        }
    }

    /**
     * Initiates an APT package list reload operation by connecting to the
     * updateagent service on port 1002. This triggers an 'apt-get update'
     * command to refresh the system's package lists.
     *
     * @return true if the reload operation was initiated successfully, false otherwise
     */
    public boolean reloadAptPackageLists() {
        if (!isUpdateAgentInstalled()) {
            return false;
        }
        LOGGER.log(Level.INFO, "Started apt-reload service");
        return executeSocketOperation(APT_UPDATE_PORT);
    }

    /**
     * Initiates a DWH update operation if no update is currently in progress.
     * Connects to the updateagent service on port 1003 to trigger an
     * 'apt-get install' command for the DWH package. The update is executed
     * asynchronously.
     *
     * @return true if the update operation was initiated successfully, false otherwise
     */
    public boolean executeDwhUpdate() {
        if (!isUpdateAgentInstalled() || isUpdateInProgress()) {
            return false;
        }
        LOGGER.log(Level.INFO, "Started dwh-update service");
        try {
            currentUpdate = CompletableFuture.supplyAsync(() -> executeSocketOperation(DWH_UPDATE_PORT));
            return true;
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to start update process", e);
            return false;
        }
    }

    public boolean isUpdateInProgress() {
        return currentUpdate != null && !currentUpdate.isDone();
    }

    /**
     * Executes a socket operation on the specified port.
     * Used internally for both APT updates and DWH updates.
     *
     * @param port The port number to connect to
     * @return true if the operation was successful, false otherwise
     */
    private boolean executeSocketOperation(int port) {
        try (Socket socket = new Socket("localhost", port)) {
            socket.setSoTimeout(SOCKET_TIMEOUT);
            Thread.sleep(1000);
            return true;
        } catch (IOException | InterruptedException e) {
            LOGGER.log(Level.WARNING, "Socket operation failed on port " + port, e);
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return false;
        }
    }
}
