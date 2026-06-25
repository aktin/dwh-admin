package org.aktin.dwh.admin.updater;

import lombok.NonNull;
import lombok.Setter;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This class acts like a broker for update managers and provides the correct
 * UpdateManager implementation depending on the current system requirements.
 */

@Singleton
public class UpdateManagerFactory {

    private static final Logger LOGGER = Logger.getLogger(UpdateManagerFactory.class.getName());

    @Setter
    private List<IUpdateManager> updateManagers;
    private final IUpdateManager applicable;

    /**
     * Jakarta CDI inject searches beans implementing {@link IUpdateManager} and
     * @param managers
     */
    @Inject
    public UpdateManagerFactory(@EnvironmentSpecific Instance<IUpdateManager> managers) {
        this.updateManagers = this.getUpdateManagersFromInstance(managers);
        this.applicable = this.getFirstApplicableManager();

        if (this.applicable != null) {
            this.applicable.initialize();
        } else {
            LOGGER.log(Level.WARNING, "No update manager was selected. Update REST operations will remain unavailable.");
        }
    }

    private List<IUpdateManager> getUpdateManagersFromInstance(@NonNull Instance<IUpdateManager> managers) {
        List<IUpdateManager> extracted = new ArrayList<>();
        for (IUpdateManager manager : managers) {
            LOGGER.log(Level.INFO, "UpdateManager Bean found: "+ manager.getClass().getName());
            extracted.add(manager);
        }
        return extracted;
    }

    private IUpdateManager getFirstApplicableManager() {
        for (IUpdateManager manager : this.updateManagers) {
            if (manager.supportsCurrentSystem()) {
                return manager;
            }
        }
        LOGGER.log(Level.WARNING, "No applicable update manager found, automatic update function will not work.");
        return null;
    }

    public IUpdateManager getMainUpdateManager() {
        return applicable;
    }

}
