package org.aktin.dwh.admin.optin;

import org.aktin.dwh.optinout.Participation;
import org.aktin.dwh.optinout.Study;

public class StudyWrapper {

    public String id;
    public String title;
    public String description;
    public long created;
    public long closed;
    public boolean supportsOptIn;
    public boolean supportsOptOut;
    public boolean supportsManualSic;

    StudyWrapper (Study s) {
        this.id = s.getId();
        this.title = s.getTitle();
        this.description = s.getDescription();
        this.supportsOptIn = s.isParticipationSupported(Participation.OptIn);
        this.supportsOptOut = s.isParticipationSupported(Participation.OptOut);
        this.supportsManualSic = s.supportsManualSICs();
        if (s.getCreatedTimestamp() != null) {
            this.created = s.getCreatedTimestamp().toEpochMilli();
        } else {
            this.created = -1;
        }
        if (s.getClosedTimestamp() != null) {
            this.closed = s.getClosedTimestamp().toEpochMilli();
        } else {
            this.closed = -1;
        }
    }

}
