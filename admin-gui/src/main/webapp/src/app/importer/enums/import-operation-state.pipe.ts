import {Pipe, PipeTransform} from '@angular/core';
import {ImportOperationState} from './ImportOperationState';


@Pipe({
    name: 'importOperationStateLabel',
    pure: true,
    standalone: true
})
export class ImportOperationStatePipe implements PipeTransform {
    private readonly importStateLabels: Record<ImportOperationState, string> = {
        [ImportOperationState.UploadingReady]: 'Bereit zum Hochladen',
        [ImportOperationState.UploadingInProgress]: 'Wird hochgeladen',
        [ImportOperationState.UploadingSuccessful]: 'Hochladen abgeschlossen',
        [ImportOperationState.UploadingCancelled]: 'Hochladen abgebrochen',
        [ImportOperationState.UploadingFailed]: 'Hochladen fehlgeschlagen',
        [ImportOperationState.ImportingQueued]: 'In Warteschlange zum Import',
        [ImportOperationState.ImportingInProgress]: 'Wird importiert',
        [ImportOperationState.ImportingSuccessful]: 'Import abgeschlossen',
        [ImportOperationState.ImportingCancelled]: 'Import abgebrochen',
        [ImportOperationState.ImportingFailed]: 'Import fehlgeschlagen',
        [ImportOperationState.ImportingTimeout]: 'Zeitüberschreitung beim Import',
    };

    transform(state?: ImportOperationState | null): string {
        if (!state) return '';
        return (this.importStateLabels)[state] ?? String(state);
    }
}
