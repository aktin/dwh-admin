/**
 * Created by Xu on 16-Jun-17.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

@Pipe({ name: 'requestfilter' })
export class RequestFilterPipe implements PipeTransform {
    transform(requests: LocalRequest[], status: RequestStatus, onlyStarred: boolean, showHidden: boolean): LocalRequest[] {
        let output = requests;

        if ( status ) {
            output = output.filter(req => req.status === status);
        }
        if ( onlyStarred ) {
            output = output.filter(req => req.marker === RequestMarker.STARRED);
        }
        if ( !showHidden ) {
            output = output.filter(req => req.marker !== RequestMarker.HIDDEN);
        }

        return output;
    }
}
