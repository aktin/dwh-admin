export enum ImportState {
    ready = 'Bereit',
    in_queue = 'In Warteschlange',
    uploading = 'Wird hochgeladen',
    upload_cancelled = 'Hochladen abgebrochen',
    upload_failed = 'Hochladen fehlgeschlagen',
    verificating = 'Wird geprüft',
    verification_failed = 'Prüfung fehlgeschlagen',
    verification_successful = 'Prüfung abgeschlossen',
    importing = 'Wird importiert',
    import_cancelled = 'Import abgebrochen',
    import_failed = 'Import fehlgeschlagen',
    import_successful = 'Import abgeschlossen'
}
