package org.aktin.dwh.admin.importer.pojos;

public class ScriptFilePOJO {

    private String id;
    private String viewname;
    private String version;
    private String mimetype;

    public ScriptFilePOJO(String id, String viewname, String version, String mimetype) {
        this.id = id;
        this.viewname = viewname;
        this.version = version;
        this.mimetype = mimetype;
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

    public String getMimetype() {
        return mimetype;
    }
}
