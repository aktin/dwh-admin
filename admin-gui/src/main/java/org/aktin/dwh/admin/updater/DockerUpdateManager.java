package org.aktin.dwh.admin.updater;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.inject.Singleton;

/**
 * Docker container implementation of {@link IUpdateManager}.
 *
 * <p>Communicates with updateagent services running on the Docker host machine
 * via the {@code host.docker.internal} DNS name that Docker makes available
 * inside containers:</p>
 * <ul>
 *   <li>APT package-list reload ({@code apt-get update}) – port 1004</li>
 *   <li>DWH package upgrade ({@code apt-get install}) – port 1005</li>
 * </ul>
 *
 * <p>This class is intentionally thin: all business logic lives in
 * {@link AbstractUpdateManager}. Only the network coordinates differ between
 * this class and {@link UpdateManager}.</p>
 */
@Singleton
@EnvironmentSpecific
public class DockerUpdateManager extends AbstractUpdateManager {

    private static final Logger LOGGER = Logger.getLogger(DockerUpdateManager.class.getName());

    private static final String HOST = "host.docker.internal";
    private static final int APT_UPDATE_PORT = 1004;
    private static final int DWH_UPDATE_PORT = 1005;

    @PostConstruct
    public void initialize() {
        LOGGER.log(Level.INFO, "Initializing Docker UpdateManager and triggering APT package list reload...");
        boolean supports = this.supportsCurrentSystem();
        LOGGER.log(Level.INFO, "Supports Current System: " + supports);
        if (supports) {
            reloadAptPackageLists();
        }
    }

    @Override
    public boolean supportsCurrentSystem() {
        return Files.exists(Paths.get("/.dockerenv"));
    }

    @Override
    protected String getHost() {
        return HOST;
    }

    @Override
    protected int getAptUpdatePort() {
        return APT_UPDATE_PORT;
    }

    @Override
    protected int getDwhUpdatePort() {
        return DWH_UPDATE_PORT;
    }

    @Override
    public String getMsg() {
        return System.getenv("COMPOSE_LOCATION").trim();
    }
}
