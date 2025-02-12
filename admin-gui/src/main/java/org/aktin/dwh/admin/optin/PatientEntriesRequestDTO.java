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

	// lists of sics and extensions, each element of one list corresponds to the element in the other list at the same index
	// if a sic is going to be generated, the value of the respective index should be null
	public List<String> sics;
	public List<String> extensions;
}
