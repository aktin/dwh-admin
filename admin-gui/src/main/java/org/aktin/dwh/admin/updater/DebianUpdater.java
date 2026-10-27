package org.aktin.dwh.admin.updater;

import java.nio.file.Files;
import java.nio.file.Paths;
import javax.inject.Singleton;

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
@EnvironmentSpecific
public class DebianUpdater extends AbstractUpdater {

    private static final String HOST = "localhost";
    private static final int APT_UPDATE_PORT = 1002;
    private static final int DWH_UPDATE_PORT = 1003;

    public DebianUpdater() {
        super(HOST, APT_UPDATE_PORT, DWH_UPDATE_PORT);
    }

    @Override
    public boolean supportsCurrentSystem() {
        return !Files.exists(Paths.get("/.dockerenv"));
    }

}
