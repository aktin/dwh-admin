package org.aktin.dwh.admin.optin;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

import org.aktin.dwh.optinout.Participation;
import org.aktin.dwh.optinout.PatientReference;

@XmlAccessorType(XmlAccessType.FIELD)
public class PatientEntryRequest {
	public String id_ext; 
	public Participation opt;
	public String sic;
	public String comment;
}
