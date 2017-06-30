/**
 * Created by Xu on 16-Jun-17.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

@Pipe({ name: 'requestFilter' })
export class RequestFilterPipe implements PipeTransform {
    private reqAuthStatus: RequestStatus[] = [RequestStatus.Retrieved, RequestStatus.Seen, RequestStatus.Completed];

    transform( requests: LocalRequest[], status: RequestStatus | boolean, marker: RequestMarker ): LocalRequest[] {
        let output = requests;

        if ( status === true ) { // show all status
            // do nothing
        } else if ( status ) {
            output = output.filter(req => req.status === status);
        } else {
            output = output.filter(req => req.needAuthorization());
        }
        switch ( marker ) {
            case RequestMarker.STARRED: {
                output = output.filter(req => req.marker === RequestMarker.STARRED);
                break;
            }
            case RequestMarker.HIDDEN: {
                // NOP - show hidden!
                break;
            }
            default: { // filter our the hidden ones
                output = output.filter(req => req.marker !== RequestMarker.HIDDEN);
            }
        }

        return output;
    }
}