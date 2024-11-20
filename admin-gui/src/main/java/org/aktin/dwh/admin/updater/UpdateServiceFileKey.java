package org.aktin.dwh.admin.updater;

public enum UpdateServiceFileKey {

    INSTALLED("version.installed"),

    CANDIDATE("version.candidate"),

    LAST_CHECK("version.time"),

    SUCCESS("update.success"),

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
