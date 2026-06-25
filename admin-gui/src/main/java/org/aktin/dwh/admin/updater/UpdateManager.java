package org.aktin.dwh.admin.updater;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.inject.Singleton;

/**
 *  This class manages updates for native debian installations. It  communicates with
 *  updateagent services running on the host machine.
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
