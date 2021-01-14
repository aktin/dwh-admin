package org.aktin.dwh.admin.importer.enums;

// possible operations for ImportState
public enum ImportOperation {
    queued,
    in_progress,
    successful,
    cancelled,
    failed
}
