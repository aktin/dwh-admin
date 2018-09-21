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
            case 'recurring' : {
                output = output.filter(req => req.isRecurring());
                break;
            }
            case 'single' : {
                output = output.filter(req => !req.isRecurring());
                break;
            }
            case 'done' : {
                output = output.filter(req => req.isFinished());
                break;
            }
            case 'inProgress' : {
                output = output.filter(req => !req.isFinished());
                break;
            }
            case 'seen': {
                output = output.filter(req => req.status === RequestStatus.Seen);
                break;
            }
            case 'retrieved' : {
                output = output.filter(req => req.status === RequestStatus.Retrieved);
                break;
            }
            case 'queued': {
                output = output.filter(req => req.status === RequestStatus.Queued);
                break;
            }
            case 'processing': {
                output = output.filter(req => req.status === RequestStatus.Processing);
                break;
            }
            case 'completed': {
                output = output.filter(req => req.status === RequestStatus.Completed);
                break;
            }
            case 'sending': {
                output = output.filter(req => req.status === RequestStatus.Sending);
                break;
            }
            case 'seen': {
                output = output.filter(req => req.status === RequestStatus.Seen);
                break;
            }
            case 'submitted' : {
                output = output.filter(req => req.status === RequestStatus.Submitted);
                break;
            }
            case 'rejected' : {
                output = output.filter(req => req.status === RequestStatus.Rejected);
                break;
            }
            case 'failed' : {
                output = output.filter(req => req.status === RequestStatus.Failed);
                break;
            }
            case 'expired' : {
                output = output.filter(req => req.status === RequestStatus.Expired);
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
