package org.aktin.dwh.admin.updater;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.core.Response;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.Reader;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Singleton
public class UpdateManager {

    private static final Logger LOGGER = Logger.getLogger(UpdateManager.class.getName());

    @Inject
    Preferences preferences;

    public Properties getDwhUpdateInfo() {
        Properties properties = null;
        try {
            Path path = Paths.get(preferences.get(PreferenceKey.updateDataPath), "info");
            properties = readPropertiesFileFromPath(path);
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Could not read pre-update info file");
        }
        return properties;
    }

    public boolean isNewDwhUpdateAvailable() {
        Properties propertiesInfo = getDwhUpdateInfo();
        if (!propertiesInfo.isEmpty()) {
            String version_installed = (String) propertiesInfo.get(UpdateServiceFileKey.INSTALLED.toString());
            String version_candidate = (String) propertiesInfo.get(UpdateServiceFileKey.CANDIDATE.toString());
            return !version_installed.equals(version_candidate);
        } else
            return false;
    }

    public Response reloadAptPackageLists() {
        try (Socket ignored = new Socket("localhost", 1002)) {
            LOGGER.log(Level.INFO, "Started apt-reload service");
            Thread.sleep(1000);
            return Response.status(202).build();
        } catch (IOException | InterruptedException e) {
            LOGGER.log(Level.WARNING, "Error during connection to apt-get update service");
            return Response.status(500).build();
        }
    }

    public Response executeDwhUpdate() {
        try (Socket ignored = new Socket("localhost", 1003)) {
            LOGGER.log(Level.INFO, "Started dwh-update service");
            Thread.sleep(1000);
            return Response.status(202).build();
        } catch (IOException | InterruptedException e) {
            LOGGER.log(Level.WARNING, "Error during connection to dwh-update service");
            return Response.status(500).build();
        }
    }

    public boolean wasDwhUpdateSuccessful() {
        try {
            Path path = Paths.get(preferences.get(PreferenceKey.updateDataPath), "result");
            Properties properties = readPropertiesFileFromPath(path);
            String wasSuccessful = (String) properties.get(UpdateServiceFileKey.SUCCESS.toString());
            return Boolean.parseBoolean(wasSuccessful);
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Could not read post-update result file");
        }
        return false;
    }

    public String getDwhUpdateLog() {
        try {
            Path path = Paths.get(preferences.get(PreferenceKey.updateDataPath), "log");
            if (Files.exists(path)) {
                return Files.readAllLines(path).stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining("\n"));
            } else
                throw new FileNotFoundException();
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "Could not read update service log");
        }
        return "[error]";
    }

    private Properties readPropertiesFileFromPath(Path path) throws IOException {
        Properties properties = new Properties();
        if (Files.exists(path)) {
            try (Reader input = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
                properties.load(input);
            }
        } else
            throw new FileNotFoundException();
        return properties;
    }
}
