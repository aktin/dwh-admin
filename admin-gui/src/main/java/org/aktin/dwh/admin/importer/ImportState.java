package org.aktin.dwh.admin.importer;

// possible states of PropertyKey.state
public enum ImportState {
    upload_successful,
    verifying,
    verification_queued,
    verification_successful,
    verification_cancelled,
    verification_failed,
    importing,
    importing_queued,
    import_successful,
    import_cancelled,
    import_failed,
}
