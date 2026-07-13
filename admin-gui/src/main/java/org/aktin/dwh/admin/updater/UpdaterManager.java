package org.aktin.dwh.admin.updater;

import lombok.NonNull;

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

    private final List<Updater> updaters;
    private final Updater selected;

    /**
     * "Jakarta CDI inject" searches {@link Updater} beans annotated with {@link EnvironmentSpecific} and
     * selects the first bean fulfilling its run requirements.
     * @param managers
     */
    @Inject
    public UpdaterManager(@EnvironmentSpecific Instance<Updater> managers) {
        this.updaters = this.getUpdatersFromInstance(managers);
        this.selected = this.getFirstApplicableUpdater();

        if (this.selected != null) {
            this.selected.initialize();
        } else {
            LOGGER.log(Level.WARNING, "No update manager was selected. Update REST operations will remain unavailable.");
        }
    }

    private List<Updater> getUpdatersFromInstance(@NonNull Instance<Updater> updaters) {
        List<Updater> extracted = new ArrayList<>();
        for (Updater u : updaters) {
            LOGGER.log(Level.INFO, "Updater Bean found: "+ u.getClass().getName());
            extracted.add(u);
        }
        return extracted;
    }

    private Updater getFirstApplicableUpdater() {
        for (Updater manager : this.updaters) {
            if (manager.supportsCurrentSystem()) {
                return manager;
            }
        }
        LOGGER.log(Level.WARNING, "No applicable updater found, automatic update function will not work.");
        return null;
    }

    /**
     * @return
     *      - updater: returns the first {@code updater} instance matching its requirements
     *      - null: every instance failed at their requirements check
     */
    public Updater getMainUpdater() {
        return selected;
    }

}
