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

        switch (status) {
            case 'all' : {
                break;
            }
            case 'auth' : {
                output = output.filter(req => req.needAuthorization());
                break;
            }
            case 'new' : {
                output = output.filter(req => req.status === RequestStatus.Retrieved);
                break;
            }
            case 'done' : {
                output = output.filter(req => req.isFinished());
                break;
            }
            case 'submitted' : {
                output = output.filter(req => req.isSubmitted());
                break;
            }
            case 'failed' : {
                output = output.filter(req => req.failed());
                break;
            }
            case 'recurring' : {
                output = output.filter(req => req.isRecurring());
                break;
            }
        }
        if ( status === 'hidden') {
            output = output.filter(req => req.marker === RequestMarker.HIDDEN);
        } else {
            output = output.filter(req => req.marker !== RequestMarker.HIDDEN);
        }

        return output;
    }
}
