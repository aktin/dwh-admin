package org.aktin.dwh.admin.updater;

public enum UpdateServiceFileKey {

    INSTALLED("version.installed"),

    CANDIDATE("version.candidate"),

    SUCCESS("update.success");

    private final String value;

    UpdateServiceFileKey(String value) {
        this.value = value;
    }

    public String toString() {
        return this.value;
    }
}
