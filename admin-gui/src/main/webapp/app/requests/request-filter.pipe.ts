/**
 * Created by Xu on 16-Jun-17.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { LocalRequest, RequestMarker, RequestStatus } from './request';

@Pipe({ name: 'requestFilter' })
export class RequestFilterPipe implements PipeTransform {
    private reqAuthStatus: RequestStatus[] = [RequestStatus.Retrieved, RequestStatus.Seen, RequestStatus.Completed];

    /**
     *
     * @param {LocalRequest[]} requests
     * @param {RequestStatus | string} status
     *      'auth': only auth needed,
     *      'all': show all,
     *      'done': completed requests
     *      DEFAULT: with status
     * @param {RequestMarker} marker
     *      STARRED: only starred,
     *      HIDDEN: show also hidden,
     *      NONE: not hidden
     * @returns {LocalRequest[]}
     */
    transform( requests: LocalRequest[], status: RequestStatus | string, marker: RequestMarker ): LocalRequest[] {
        let output = requests;

        if ( status === 'auth' ) { // show auth
            output = output.filter(req => req.needAuthorization());
        } else if ( status === 'done' ) { // show auth
            output = output.filter(req => req.isFinished());
        } else if ( typeof status === 'number') {
            output = output.filter(req => req.status === status);
        }

        switch ( marker ) {
            case RequestMarker.STARRED: {
                output = output.filter(req => req.marker === RequestMarker.STARRED);
                break;
            }
            case RequestMarker.HIDDEN: {
                // NOP - show hidden!
                output = output.filter(req => req.marker === RequestMarker.HIDDEN);
                break;
            }
            default: { // filter our the hidden ones
                output = output.filter(req => req.marker !== RequestMarker.HIDDEN);
            }
        }

        return output;
    }
}