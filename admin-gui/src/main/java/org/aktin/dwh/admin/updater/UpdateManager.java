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
import javax.ws.rs.core.Response;
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
        return Files.exists(Paths.get(preferences.get(PreferenceKey.updateDataPath)));
    }

    public UpdateStatus getUpdateStatus() {
        UpdateStatus status = new UpdateStatus();
        try {
            Properties resultProps = readPropertiesFileFromPath(getResultPath());
            Properties infoProps = readPropertiesFileFromPath(getInfoPath());

            status.setSuccess(Boolean.parseBoolean(resultProps.getProperty(UpdateServiceFileKey.SUCCESS.toString())));
            status.setLastUpdateTime(resultProps.getProperty(UpdateServiceFileKey.LAST_UPDATE.toString()));
            status.setInstalledVersion(infoProps.getProperty(UpdateServiceFileKey.INSTALLED.toString()));
            status.setCandidateVersion(infoProps.getProperty(UpdateServiceFileKey.CANDIDATE.toString()));
            status.setLastCheckTime(infoProps.getProperty(UpdateServiceFileKey.LAST_CHECK.toString()));
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Error reading update status", e);
        }
        return status;
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
            LOGGER.log(Level.WARNING, "Could not read update service log", e);
            return null;
        }
    }

    public Response reloadAptPackageLists() {
        return executeSocketOperation(APT_UPDATE_PORT, "apt-reload");
    }

    private Response executeSocketOperation(int port, String operation) {
        try (Socket socket = new Socket("localhost", port)) {
            socket.setSoTimeout(SOCKET_TIMEOUT);
            LOGGER.log(Level.INFO, "Started {0} service", operation);
            Thread.sleep(1000);
            return Response.accepted().build();
        } catch (IOException | InterruptedException e) {
            LOGGER.log(Level.WARNING, "Error during connection to " + operation + " service", e);
            return Response.serverError()
                .entity("Failed to execute " + operation + ": " + e.getMessage())
                .build();
        }
    }

    public Response executeDwhUpdate() {
        if (currentUpdate != null && !currentUpdate.isDone()) {
            return Response.status(Response.Status.CONFLICT)
                .entity("Update already in progress")
                .build();
        }
        try {
            currentUpdate = CompletableFuture.supplyAsync(this::performUpdate);
            return Response.accepted().build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.PRECONDITION_FAILED)
                .entity(e.getMessage())
                .build();
        }
    }

    private Boolean performUpdate() {
        Response response = executeSocketOperation(DWH_UPDATE_PORT, "dwh-update");
        return response.getStatus() == Response.Status.ACCEPTED.getStatusCode();
    }
}
