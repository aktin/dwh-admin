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
    public static parseRequest (data: any): LocalRequest {
        return null;
    }
    constructor (
        requestId: number,
        queryId: number,
        marker: string,
        status: string,
        query: Request
    ) {}
}

