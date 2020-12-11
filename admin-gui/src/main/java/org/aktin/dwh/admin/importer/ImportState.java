package org.aktin.dwh.admin.importer;

public enum ImportState {
    upload_successful,
    verifying,
    verification_successful,
    verification_cancelled,
    verification_failed,
    importing ,
    import_successful,
    import_cancelled,
    import_failed,
}
