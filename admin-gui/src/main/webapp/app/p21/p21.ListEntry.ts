/**
 * class to display list entries in HTML
 */

export class ListEntry {

    state: ImportState = ImportState.uploading;
    id: string = Math.random().toString(36).substr(2, 9);

    constructor(
        public name: string,
        public size: number,
        public upload_progress: number,
        public upload_finished: boolean
    ) { }
}

export enum ImportState {
    uploading = 'Wird hochgeladen',
    upload_failed = 'Hochladen fehlgeschlagen',
    verificating = 'Wird geprüft',
    verification_successful = 'Prüfung abgeschlossen',
    verification_failed = 'Prüfung fehlgeschlagen',
    importing = 'Wird importiert',
    import_successful = 'Import abgeschlossen',
    import_failed = 'Import fehlgeschlagen'
}
