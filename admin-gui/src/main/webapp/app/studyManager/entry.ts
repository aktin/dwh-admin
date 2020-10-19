export class Entry {
    comment: string;
    i2b2PatientNum: number;
    participation: Participation;
    ext: string;
    root: string;
    reference: string;
    sic: string;
    timestamp: number;
    user: string;
    study: object;
    participationString: string;

    constructor(obj: object) {
        this.comment = obj['comment'];
        this.i2b2PatientNum = obj['i2b2PatientNumber'];
        this.participation = Participation[obj['participation'] as keyof typeof Participation];
        this.ext = obj['idExt'];
        this.root = obj['idRoot'];
        this.reference = obj['reference'];
        this.sic = obj['SIC'];
        this.timestamp = obj['timestamp'];
        this.user = obj['user'];
        this.study = obj['study'];

        switch (this.participation) {
            case Participation.OptIn:
                this.participationString = 'Einschluss';
                break;
            case Participation.OptOut:
                this.participationString = 'Ausschluss';
                break;
        }
    }
}

export class Study {
    id: string;
    title: string;
    description: string;
    created: number;
    closed: number;
    supportsManualSic: boolean;
    supportsOptIn: boolean;
    supportsOptOut: boolean;

    constructor(obj: object) {
        this.id = obj['id'];
        this.title = obj['title'];
        this.description = obj['description'];
        this.created = obj['created'];
        this.closed = obj['closed'];
        this.supportsManualSic = obj['supportsManualSic'];
        this.supportsOptIn = obj['supportsOptIn'];
        this.supportsOptOut = obj['supportsOptOut'];
    }
}

export enum Participation {
    OptIn,
    OptOut
}
