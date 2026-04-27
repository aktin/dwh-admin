package org.aktin.dwh.admin.updater;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class SelectedUpdateManagerProducer {

    @Inject
    private UpdateManagerFactory updateManagerFactory;

    @Produces
    @Singleton
    public IUpdateManager produceUpdateManager() {
        return updateManagerFactory.getMainUpdateManager();
    }
}
