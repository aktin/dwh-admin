package org.aktin.dwh.admin.updater;

/**
 * Enumeration of property keys used in update service files.
 * These keys are used to store and retrieve information about
 * DWH versions and update status in property files.
 */
public enum UpdateServiceFileKey {

    /**
     * Key for the currently installed DWH version
     */
    INSTALLED("version.installed"),

    /**
     * Key for the available candidate version for update
     */
    CANDIDATE("version.candidate"),

    /**
     * Key for the timestamp of last version check
     */
    LAST_CHECK("version.time"),

    /**
     * Key for the success status of the last update
     */
    SUCCESS("update.success"),

    /**
     * Key for the timestamp of the last update attempt
     */
    LAST_UPDATE("update.time");

    private final String value;

    UpdateServiceFileKey(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return this.value;
    }
}
