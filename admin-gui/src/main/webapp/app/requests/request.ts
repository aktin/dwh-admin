
/**
 * Created by Xu on 08-Jun-17.
 */

export interface Query {
    id: number,
    title: string,
    description: string,
    schedule: {
        duration: string,
        reference: Date,
        interval: string;
    },
    principal: {
        name: string,
        organisation: string,
        email: string,
        phone: string,
        address?: string,
        url?: string,
    },
    extensions: string[];
}

export interface QueryBundle {
    rule: Rule,
    requests: Array<LocalRequest>
}

export interface Rule {
    user: string,
    action: QueryRuleAction,
    creationDate: Date
}

export interface Request {
    id: number,
    reference: Date,
    published: Date,
    scheduled: Date,
    deadline: Date,
    closed: Date,
    canceled: Date,
    query: Query,
    // later signature: string
}

export class LocalRequest {
    private static parseDate (date: string) {
        if (date) {
            return new Date(date);
        } return null;
    }

    public static nextStatus (status: RequestStatus, allow: boolean): RequestStatus {
        if (allow) {
            if (status === RequestStatus.Retrieved) {
                return RequestStatus.Seen;
            }
            if (status === RequestStatus.Seen) {
                return RequestStatus.Queued;
            }
            if (status === RequestStatus.Completed) {
                return RequestStatus.Sending;
            }
            return null;
        }
        return RequestStatus.Rejected;
    }

    public static parseRequest (data: any): LocalRequest {
        data['query'] = data['query'] || {};
        if (isNaN(data['marker'])) {
            data['marker'] = RequestMarker[data['marker']];
        }
        if (isNaN(data['status'])) {
            data['status'] = RequestStatus[data['status']];
        }
        let rawRequest = data['query'];
        rawRequest['reference'] = this.parseDate(rawRequest['reference']);
        rawRequest['published']     = this.parseDate(rawRequest['published']);
        rawRequest['scheduled']     = this.parseDate(rawRequest['scheduled']);
        rawRequest['deadline']      = this.parseDate(rawRequest['deadline']);
        rawRequest['closed']        = this.parseDate(rawRequest['closed']);
        rawRequest['canceled']      = this.parseDate(rawRequest['canceled']);
        rawRequest['query'] = rawRequest['query'] || {};
        let rawQuery = rawRequest['query'];
        rawQuery['schedule'] = rawQuery['schedule'] || {};
        rawQuery['schedule']['reference'] = this.parseDate(rawQuery['schedule']['reference']);
        // rawQuery['schedule']['duration'] = rawQuery['schedule']['duration'];

        Object.setPrototypeOf(data, LocalRequest.prototype);
        return data;
    }

    constructor (
        public requestId: number,
        public queryId: number,
        public marker: RequestMarker,
        public status: RequestStatus,
        public autoSubmit: boolean,
        public query: Request,
        public result: string,
    ) {}

    public needAuthorization (): boolean {
        return this.isNew() || this.status === RequestStatus.Completed;
    }

    public isNew (): boolean {
        return ([RequestStatus.Retrieved, RequestStatus.Seen].indexOf(this.status) >= 0);
    }

    public isFinished (): boolean {
        return this.failed() || this.status === RequestStatus.Submitted || this.status === RequestStatus.Expired;
    }

    public hasResultFile (): boolean {
        return this.result !== null;
    }

    public failed (): boolean {
        return ([RequestStatus.Rejected, RequestStatus.Failed].indexOf(this.status) >= 0);
    }

    public isRecurring(): boolean {
        return this.queryId !== null;
    }
}

export enum RequestMarker {
    STARRED,
    HIDDEN
}

export enum RequestStatus {
    /** Request was retrieved from the broker.
     * This is the first status in the data warehouse.
     */
    Retrieved,
        /** A user has opened the request to review it. */
    Seen,
        /** Request was queued for processing. It is waiting for access to resources. Further
         * processing is done automatically.
         */
    Queued,
        /** Request is currently being processed. */
    Processing,
        /** Processing has completed without errors and the results were stored.
         * User interaction may occur at this point to review/verify the results
         * before submission. */
    Completed,
        /** Results are being transferred to the aggregator / remote endpoint. */
    Sending,
        /** Request results have been submitted.
         * This is a terminal status which should not be changed. */
    Submitted,
        /** Unexpected failure occurred at some point during processing or transfer. */
    Failed,
        /** The request has been rejected (manually or automatically by a rule).
         * No further processing is performed. A rejection can follow either after {@link #Seen}
         * or manually after {@link #Completed}.
         */
    Rejected,
        /** The request was closed by the broker or deleted from it. */
    Expired
}

export enum QueryRuleAction {
    /**
	 * reject matching queries
	 */
    REJECT,
    /**
	 * accept execution of matching queries,
	 * but require interaction before results are submitted
	 */
    ACCEPT_EXECUTE,
    /**
	 * accept execution of matching queries and automatically
	 * submit the result data.
	 */
    ACCEPT_SUBMIT
}

/*
{
    requestId: number,
    queryId: number,
    marker: string,
    status: string,
    query: Request {
        id: number,
        reference: Date,
        published: Date,
        scheduled: Date,
        deadline: Date,
        closed: Date,
        canceled: Date,
        query: Query {
            id: number,
            title: string,
            description: string,
            schedule: {
                duration: string,
                reference: Date,
            },
            principal: {
                name: string,
                organization: string,
                email: string,
                phone: string,
                address?: string,
                url?: string,
            },
        }
    }
}
*/
