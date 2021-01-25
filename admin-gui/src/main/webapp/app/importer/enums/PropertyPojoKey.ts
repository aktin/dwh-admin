// possible keys in received property file object from backend
export enum PropertyPojoKey {
	id = 'id',         		// unique uuid
	filename = 'filename',  // original filename
	size = 'size',       	// size of binary
	script = 'script',     	// id of selected processing script
	operation = 'operation',// current operation on binary
	state = 'state',      	// current processing state of operation
}
