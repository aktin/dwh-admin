/**
 * Created by Xu on 16-Jun-17.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

@Pipe({ name: 'requestfilter' })
export class RequestFilterPipe implements PipeTransform {
    transform(requests: LocalRequest[], marker: RequestMarker, status: RequestStatus): LocalRequest[] {
        let output = requests;
        if ( marker ) {
            output = output.filter(req => req.marker === marker);
        }
        if ( status ) {
            output = output.filter(req => req.status === status);
        }

        return output;
    }
}
