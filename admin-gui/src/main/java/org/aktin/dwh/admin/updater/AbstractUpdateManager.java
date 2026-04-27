package org.aktin.dwh.admin.updater;

import java.io.*;
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
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

/**
 * Shared update manager implementation for environment-specific update agents.
 *
 * <p>Concrete implementations only need to provide the target host and ports
 * for the socket-based update agent communication as well as the environment
 * detection used by {@link UpdateManagerFactory}.</p>
 */
public abstract class AbstractUpdateManager implements IUpdateManager {

    private static final Logger LOGGER = Logger.getLogger(AbstractUpdateManager.class.getName());
    private static final int SOCKET_TIMEOUT = 5000;

    @Inject
    Preferences preferences;

    private CompletableFuture<Boolean> currentUpdate;

    @Override
    public boolean isUpdateAgentInstalled() {
        Path updatePath = Paths.get(preferences.get(PreferenceKey.updateDataPath));
        return Files.exists(updatePath);
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

    @Override
    public boolean reloadAptPackageLists() {
        if (!isUpdateAgentInstalled()) {
            return false;
        }
        LOGGER.log(Level.INFO, "Started apt-reload service");
        return executeSocketOperation(getAptUpdatePort());
    }

    @Override
    public boolean executeDwhUpdate() {
        if (!isUpdateAgentInstalled() || isUpdateInProgress()) {
            return false;
        }
        LOGGER.log(Level.INFO, "Started dwh-update service");
        try {
            currentUpdate = CompletableFuture.supplyAsync(() -> executeSocketOperation(getDwhUpdatePort()));
            return true;
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to start update process", e);
            return false;
        }
    }

    @Override
    public boolean isUpdateInProgress() {
        return currentUpdate != null && !currentUpdate.isDone();
    }

    private boolean executeSocketOperation(int port) {
        String host = getHost();
        String msg = getMsg();

        // todo: move socket operations into own class
        try (Socket socket = new Socket(host, port)) {
            socket.setSoTimeout(SOCKET_TIMEOUT);
            Thread.sleep(1000);
            String composeLocation = System.getenv("COMPOSE_LOCATION");
            if (composeLocation == null) {
                composeLocation = "";
            }
            LOGGER.log(Level.INFO, "composeloc: " + composeLocation.trim());

            String message =
                    "compose.location=" + composeLocation + "\n";

            OutputStream out = socket.getOutputStream();
            out.write(message.getBytes("UTF-8"));
            out.flush();
            LOGGER.log(Level.INFO, "Socket operation completed on {0}:{1}", new Object[]{host, port});
            return true;
        } catch (InterruptedException e) {
            LOGGER.log(Level.WARNING, "Thread interrupted during socket operation on port: " + port, e);
            Thread.currentThread().interrupt();
            return false;
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "I/O error during socket operation on port: " + port, e);
            return false;
        }
    }

    protected abstract String getHost();

    protected abstract int getAptUpdatePort();

    protected abstract int getDwhUpdatePort();

    protected abstract String getMsg();
}
