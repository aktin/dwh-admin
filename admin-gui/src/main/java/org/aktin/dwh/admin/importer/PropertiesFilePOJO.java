package org.aktin.dwh.admin.importer;

public class PropertiesFilePOJO {

    private final String id;
    private final String filename;
    private final String size;
    private final String script;
    private final String operation;
    private final String state;

    public PropertiesFilePOJO(String id, String filename, String size, String script, String operation, String state) {
        this.id = id;
        this.filename = filename;
        this.size = size;
        this.script = script;
        this.operation = operation;
        this.state = state;
    }

    public String getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public String getSize() {
        return size;
    }

    public String getScript() {
        return script;
    }

    public String getOperation() {
        return operation;
    }

    public String getState() {
        return state;
    }
}