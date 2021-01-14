package org.aktin.dwh.admin.importer.enums;

// possible states of ImportOperation
public enum ImportState {
    queued,
    in_progress,
    successful,
    cancelled,
    failed
}
