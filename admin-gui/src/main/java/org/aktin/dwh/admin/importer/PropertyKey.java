package org.aktin.dwh.admin.importer;

// possible keys for properties file of uploaded files
public enum PropertyKey {
    id,         // unique id
    path,       // path to binary
    filename,   // original filename/displayed filename in frontend
    size,       // size of binary
    script,     // id of selected processing script
    state,      // current processing state of binary
    uploaded,   // milestone timestamp of upload
    verified,   // milestone timestamp of verification
    imported    // milestone timestamp of import
}
