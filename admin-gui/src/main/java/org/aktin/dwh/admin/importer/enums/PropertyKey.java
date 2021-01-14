package org.aktin.dwh.admin.importer.enums;

// possible keys for properties file of uploaded files
public enum PropertyKey {
    id,         // unique id
    filename,   // original filename/displayed filename in frontend
    size,       // size of binary
    script,     // id of selected processing script
    operation,  // current operation on binary
    state,      // current processing state of oepration
    uploaded,   // milestone timestamp of upload
    verified,   // milestone timestamp of verification
    imported    // milestone timestamp of import
}
