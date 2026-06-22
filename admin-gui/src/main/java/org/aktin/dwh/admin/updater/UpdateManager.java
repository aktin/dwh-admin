package org.aktin.dwh.admin.updater;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
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
public class UpdateManager extends AbstractUpdateManager {

    private static final Logger LOGGER = Logger.getLogger(UpdateManager.class.getName());
    private static final int APT_UPDATE_PORT = 1002;
    private static final int DWH_UPDATE_PORT = 1003;
    private static final String msg = "";

    public void initialize() {
        LOGGER.log(Level.INFO, "Initializing UpdateManager and triggering APT package list reload...");
        boolean supports = this.supportsCurrentSystem();
        LOGGER.log(Level.INFO, "Supports Current System: " + supports);
        if (supports) {
            reloadAptPackageLists();
        }
    }

    @Override
    public boolean supportsCurrentSystem() {
        return !Files.exists(Paths.get("/.dockerenv"));
    }

    @Override
    protected String getHost() {
        return "localhost";
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
    protected String getMsg() {
        return msg;
    }
}
