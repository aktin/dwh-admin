package org.aktin.dwh.admin.importer.pojos;

public class PropertiesFilePOJO {

    private String id;
    private String filename;
    private String size;
    private String script;
    private String operation;
    private String state;

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