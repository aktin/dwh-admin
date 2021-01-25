// all possible combinations of PropertyPojoKey.operation and PorpertyPojoKey.state
// used, to display current combination in view
export enum ImportOperationState {
    uploading_ready = 'Bereit',
    uploading_queued = 'In Warteschlange zum Hochladen',
    uploading_in_progress = 'Wird hochgeladen',
    uploading_successful = 'Hochladen abgeschlossen',
    uploading_cancelled = 'Hochladen abgebrochen',
    uploading_failed = 'Hochladen fehlgeschlagen',
    uploading_timeout = 'Zeitüberschreitung beim Hochladen',
    verifying_queued = "In Warteschlange zur Prüfung",
    verifying_in_progress = 'Wird geprüft',
    verifying_successful = 'Prüfung abgeschlossen',
    verifying_cancelled = 'Prüfung abgebrochen',
    verifying_failed = 'Prüfung fehlgeschlagen',
    verifying_timeout = 'Zeitüberschreitung bei Prüfung',
    importing_queued = "In Warteschlange zum Import",
    importing_in_progress = 'Wird importiert',
    importing_successful = 'Import abgeschlossen',
    importing_cancelled = 'Import abgebrochen',
    importing_failed = 'Import fehlgeschlagen',
    importing_timeout = 'Zeitüberschreitung beim Import',
}
