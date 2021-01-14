package org.aktin.dwh.admin.importer;

public class PropertyFilePOJO {

    private final String id;
    private final DefaultPropertiesPOJO properties;

    public PropertyFilePOJO(String id, String filename, String size, String script, String operation, String state) {
        this.id = id;
        this.properties = new DefaultPropertiesPOJO(filename, size, script, operation, state);
    }

    public String getId() {
        return id;
    }

    public DefaultPropertiesPOJO getProperties() {
        return properties;
    }
}

class DefaultPropertiesPOJO {
    private final String filename;
    private final String size;
    private final String script;
    private final String operation;
    private final String state;

    DefaultPropertiesPOJO(String filename, String size, String script, String operation, String state) {
        this.filename = filename;
        this.size = size;
        this.script = script;
        this.operation = operation;
        this.state = state;
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
