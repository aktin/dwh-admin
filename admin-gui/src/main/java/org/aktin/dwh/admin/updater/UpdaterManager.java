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
public class UpdaterManager {

    private static final Logger LOGGER = Logger.getLogger(UpdaterManager.class.getName());

    @Setter
    private List<Updater> updaters;
    private final Updater applicable;

    /**
     * "Jakarta CDI inject" searches {@link Updater} beans annotated with {@link EnvironmentSpecific} and
     * selects the first bean fulfilling its run requirements.
     * @param managers
     */
    @Inject
    public UpdaterManager(@EnvironmentSpecific Instance<Updater> managers) {
        this.updaters = this.getUpdateManagersFromInstance(managers);
        this.applicable = this.getFirstApplicableManager();

        if (this.applicable != null) {
            this.applicable.initialize();
        } else {
            LOGGER.log(Level.WARNING, "No update manager was selected. Update REST operations will remain unavailable.");
        }
    }

    private List<Updater> getUpdateManagersFromInstance(@NonNull Instance<Updater> managers) {
        List<Updater> extracted = new ArrayList<>();
        for (Updater manager : managers) {
            LOGGER.log(Level.INFO, "UpdateManager Bean found: "+ manager.getClass().getName());
            extracted.add(manager);
        }
        return extracted;
    }

    private Updater getFirstApplicableManager() {
        for (Updater manager : this.updaters) {
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
    public Updater getMainUpdateManager() {
        return applicable;
    }

}
