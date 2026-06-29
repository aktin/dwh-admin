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

@Singleton
public class UpdateManagerFactory {

    private static final Logger LOGGER = Logger.getLogger(UpdateManagerFactory.class.getName());

    @Setter
    private List<UpdateManager> updateManagers;
    private final UpdateManager applicable;

    /**
     * "Jakarta CDI inject" searches {@link UpdateManager} beans annotated with {@link EnvironmentSpecific} and
     * selects the first bean fulfilling its run requirements.
     * @param managers
     */
    @Inject
    public UpdateManagerFactory(@EnvironmentSpecific Instance<UpdateManager> managers) {
        this.updateManagers = this.getUpdateManagersFromInstance(managers);
        this.applicable = this.getFirstApplicableManager();

        if (this.applicable != null) {
            this.applicable.initialize();
        } else {
            LOGGER.log(Level.WARNING, "No update manager was selected. Update REST operations will remain unavailable.");
        }
    }

    private List<UpdateManager> getUpdateManagersFromInstance(@NonNull Instance<UpdateManager> managers) {
        List<UpdateManager> extracted = new ArrayList<>();
        for (UpdateManager manager : managers) {
            LOGGER.log(Level.INFO, "UpdateManager Bean found: "+ manager.getClass().getName());
            extracted.add(manager);
        }
        return extracted;
    }

    private UpdateManager getFirstApplicableManager() {
        for (UpdateManager manager : this.updateManagers) {
            if (manager.supportsCurrentSystem()) {
                return manager;
            }
        }
        LOGGER.log(Level.WARNING, "No applicable update manager found, automatic update function will not work.");
        return null;
    }

    /**
     * @return
     *      - updateManager: returns the first update manager instance matching its requirements
     *      - null: every instance failed at their requirements check
     */
    public UpdateManager getMainUpdateManager() {
        return applicable;
    }

}
