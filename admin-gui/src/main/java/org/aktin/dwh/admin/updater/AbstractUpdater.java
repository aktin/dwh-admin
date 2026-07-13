package org.aktin.dwh.admin.updater;

import java.io.*;
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
import org.aktin.dwh.admin.helper.TcpHelper;

/**
 * Shared update manager implementation for environment-specific update agents.
 *
 * <p>Concrete implementations only need to provide the target host and ports
 * for the socket-based update agent communication as well as the environment
 * detection used by {@link UpdaterManager}.</p>
 */
public abstract class AbstractUpdater implements Updater {

    private static final Logger LOGGER = Logger.getLogger(AbstractUpdater.class.getName());

    private final AtomicBoolean statusReadErrorLogged = new AtomicBoolean(false);

    private final AtomicBoolean isUpdateInProgress = new AtomicBoolean(false);

    @Inject
    Preferences preferences;

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
            if (statusReadErrorLogged.compareAndSet(false, true)) {
                LOGGER.log(Level.WARNING, "Error reading update status files", e);
            }
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
        return TcpHelper.touch(getHost(), getAptUpdatePort());
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
        boolean success = TcpHelper.touch(getHost(), getDwhUpdatePort());
        this.isUpdateInProgress.set(success);
        return success;
    }

    @Override
    public boolean isUpdateInProgress() {
        return this.isUpdateInProgress.get();
    }

    protected abstract String getHost();

    protected abstract int getAptUpdatePort();

    protected abstract int getDwhUpdatePort();


}
