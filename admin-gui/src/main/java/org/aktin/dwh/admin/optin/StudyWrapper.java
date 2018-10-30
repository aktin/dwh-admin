package org.aktin.dwh.admin.optin;

import java.time.Instant;

import org.aktin.dwh.optinout.Participation;
import org.aktin.dwh.optinout.Study;

public class StudyWrapper {
	
	public String id;
	public String title;
	public String description;
	public Instant created;
	public Instant closed;
	public boolean supportsOptIn;
	public boolean supportsOptOut;
	public boolean supportsManualSic;
	
	StudyWrapper (Study s) {
		this.id = s.getId();
		this.title = s.getTitle();
		this.description = s.getDescription();
		this.created = s.getCreatedTimestamp();
		this.closed = s.getClosedTimestamp();
		this.supportsOptIn = s.isParticipationSupported(Participation.OptIn);
		this.supportsOptOut = s.isParticipationSupported(Participation.OptOut);
		this.supportsManualSic = s.supportsManualSICs();
	}

}
