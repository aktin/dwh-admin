// possible values for PropertiesKey.state
export enum ImportState {
    ready = 'ready',
    queued = 'queued',
    in_progress = 'in_progress',
    successful = 'successful',
    cancelled = 'cancelled',
    failed = 'failed',
    timeout = 'timeout'
}
