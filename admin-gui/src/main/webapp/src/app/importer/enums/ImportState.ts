// possible values for PropertiesKey.state
export enum ImportState {
    Ready = 'ready',
    Queued = 'queued',
    InProgress = 'in_progress',
    Successful = 'successful',
    Cancelled = 'cancelled',
    Failed = 'failed',
    Timeout = 'timeout'
}
