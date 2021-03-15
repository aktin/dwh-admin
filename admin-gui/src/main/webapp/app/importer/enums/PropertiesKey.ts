// possible keys in received property file object (from java endpoint)
export enum PropertiesKey {
	id = 'id',         		// unique uuid
	filename = 'filename',  // original filename
	size = 'size',       	// size of binary file
	script = 'script',     	// id of selected processing script
	operation = 'operation',// current operation process (see ImportOperation)
	state = 'state',      	// current processing state of operation (see ImportState)
}
