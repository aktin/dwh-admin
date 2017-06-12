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

        console.log(data);

        return <LocalRequest> data;
    }
    constructor (
        public requestId: number,
        public queryId: number,
        public marker: string,
        public status: string,
        public query: Request
    ) {}
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
