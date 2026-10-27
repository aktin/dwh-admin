package org.aktin.dwh.admin.updater;

import java.nio.file.Files;
import java.nio.file.Paths;

import javax.inject.Singleton;

/**
 * Docker container implementation of {@link Updater}.
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
 * {@link AbstractUpdater}. Only the network coordinates differ between
 * this class and {@link DebianUpdater}.</p>
 */
@Singleton
public class DockerUpdater extends AbstractUpdater {

    private static final String HOST = "host.docker.internal";
    private static final int APT_UPDATE_PORT = 1004;
    private static final int DWH_UPDATE_PORT = 1005;

    public DockerUpdater() {
        super(HOST, APT_UPDATE_PORT, DWH_UPDATE_PORT);
    }

    @Override
    public boolean supportsCurrentSystem() {
        return Files.exists(Paths.get("/.dockerenv"));
    }

}
