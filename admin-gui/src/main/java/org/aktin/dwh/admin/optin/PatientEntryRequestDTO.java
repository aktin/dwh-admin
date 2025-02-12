package org.aktin.dwh.admin.optin;

import org.aktin.dwh.optinout.Participation;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class PatientEntryRequestDTO {
	public Participation opt;
	public String sic;
	public String extension;
	public String comment;
}
