package org.aktin.dwh.admin.optin.model;

import lombok.Getter;
import lombok.Setter;
import org.aktin.dwh.admin.optin.validation.CreateOrUpdateGroup;
import org.aktin.dwh.optinout.model.Participation;
import org.aktin.dwh.optinout.model.PatientEntryData;
import org.aktin.dwh.optinout.model.PatientReference;

import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
public class PatientEntryRequestDTO {
	@NotNull(groups = CreateOrUpdateGroup.class)
	private Participation participation;
	@NotNull
	private PatientReference reference;
	private String sic;
	@NotNull
	private String extension;
	private String comment;
	@NotNull(groups = CreateOrUpdateGroup.class)
	private boolean generateSic;

	public PatientEntryData toPatientEntryData() {
		return new PatientEntryData(null, extension, sic, comment, generateSic, participation, reference, null);
	}
}

