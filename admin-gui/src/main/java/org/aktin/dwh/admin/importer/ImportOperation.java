package org.aktin.dwh.admin.importer;

// possible operations for ImportState
public enum ImportOperation {
    queued,
    in_progress,
    successful,
    cancelled,
    failed
}
