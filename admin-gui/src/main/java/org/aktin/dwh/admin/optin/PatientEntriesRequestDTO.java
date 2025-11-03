package org.aktin.dwh.admin.optin;

import org.aktin.dwh.optinout.Participation;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
public class PatientEntriesRequestDTO {
	public Participation opt;
	public String comment;
	// should sic be automatically generated or manually inserted
	public boolean generateSic;
	public List<EntryDTO> entries;
}

