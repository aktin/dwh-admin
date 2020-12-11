export enum ImportState {
    ready = 'Bereit',
    uploading = 'Wird hochgeladen',
    upload_cancelled = 'Hochladen abgebrochen',
    upload_failed = 'Hochladen fehlgeschlagen',
    upload_successful = 'Hochladen abgeschlossen',
    verifying = 'Wird geprüft',
    verification_cancelled = 'Prüfung abgebrochen',
    verification_failed = 'Prüfung fehlgeschlagen',
    verification_successful = 'Prüfung abgeschlossen',
    importing = 'Wird importiert',
    import_cancelled = 'Import abgebrochen',
    import_failed = 'Import fehlgeschlagen',
    import_successful = 'Import abgeschlossen'
}