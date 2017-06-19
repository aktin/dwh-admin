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
    },
    principal: {
        name: string,
        organization: string,
        email: string,
        phone: string,
        address?: string,
        url?: string,
    },
    extensions: string[];
}

export interface Request {
    id: number,
    referenceDate: Date,
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

    public static parseRequest (data: any): LocalRequest {
        data['query'] = data['query'] || {};
        data['marker'] = RequestMarker[data['marker']];
        data['status'] = RequestStatus[data['status']];
        let rawRequest = data['query'];
        rawRequest['referenceDate'] = this.parseDate(rawRequest['referenceDate']);
        rawRequest['published']     = this.parseDate(rawRequest['published']);
        rawRequest['scheduled']     = this.parseDate(rawRequest['scheduled']);
        rawRequest['deadline']      = this.parseDate(rawRequest['deadline']);
        rawRequest['closed']        = this.parseDate(rawRequest['closed']);
        rawRequest['canceled']      = this.parseDate(rawRequest['canceled']);
        rawRequest['query'] = rawRequest['query'] || {};
        let rawQuery = rawRequest['query'];
        rawQuery['schedule'] = rawQuery['schedule'] || {};
        rawQuery['schedule']['reference'] = this.parseDate(rawQuery['schedule']['reference']);

        Object.setPrototypeOf(data, LocalRequest.prototype);
        return data;
    }
    constructor (
        public requestId: number,
        public queryId: number,
        public marker: RequestMarker,
        public status: RequestStatus,
        public autoSubmit: boolean,
        public query: Request
    ) {}
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
        /** The request has been rejected (manually or automatically by a rule).
         * No further processing is performed. A rejection can follow either after {@link #Seen}
         * or manually after {@link #Completed}.
         */
    Rejected,
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
}

/*
{
    requestId: number,
    queryId: number,
    marker: string,
    status: string,
    query: Request {
        id: number,
        referenceDate: Date,
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
