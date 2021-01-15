package org.aktin.dwh.admin.importer.pojos;

public class ScriptFilePOJO {

    private String id;
    private String viewname;
    private String version;

    public ScriptFilePOJO(String id, String viewname, String version) {
        this.id = id;
        this.viewname = viewname;
        this.version = version;
    }

    public String getId() {
        return id;
    }

    public String getViewname() {
        return viewname;
    }

    public String getVersion() {
        return version;
    }
}
