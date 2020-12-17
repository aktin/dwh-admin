export enum ImportState {
    ready = 'Bereit',
    uploading = 'Wird hochgeladen',
    upload_queued = 'In Warteschlange zum Hochladen',
    upload_cancelled = 'Hochladen abgebrochen',
    upload_failed = 'Hochladen fehlgeschlagen',
    upload_successful = 'Hochladen abgeschlossen',
    verifying = 'Wird geprüft',
    verification_queue = "In Warteschlange zur Prüfung",
    verification_cancelled = 'Prüfung abgebrochen',
    verification_failed = 'Prüfung fehlgeschlagen',
    verification_successful = 'Prüfung abgeschlossen',
    importing = 'Wird importiert',
    import_queued = "In Warteschlange zum Import",
    import_cancelled = 'Import abgebrochen',
    import_failed = 'Import fehlgeschlagen',
    import_successful = 'Import abgeschlossen'
}