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

@Singleton
public class UpdateManager {

    private static final Logger LOGGER = Logger.getLogger(UpdateManager.class.getName());
    private static final int APT_UPDATE_PORT = 1002;
    private static final int DWH_UPDATE_PORT = 1003;
    private static final int SOCKET_TIMEOUT = 5000;

    @Inject
    Preferences preferences;

    private CompletableFuture<Boolean> currentUpdate;

    public boolean isUpdateAgentInstalled() {
        Path updatePath = Paths.get(preferences.get(PreferenceKey.updateDataPath));
        return Files.exists(updatePath);
    }

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

    public String getUpdateLog() {
        try {
            Path path = Paths.get(preferences.get(PreferenceKey.updateDataPath), "log");
            return Files.exists(path) ? String.join("\n", Files.readAllLines(path)) : null;
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Could not read update service log");
            return null;
        }
    }

    public boolean reloadAptPackageLists() {
        if (!isUpdateAgentInstalled()) {
            return false;
        }
        LOGGER.log(Level.INFO, "Started apt-reload service");
        return executeSocketOperation(APT_UPDATE_PORT);
    }

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
