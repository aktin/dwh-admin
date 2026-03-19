package org.aktin.dwh.admin.optin.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.aktin.dwh.optinout.model.PatientReference;

import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
@Getter
@Setter
@NoArgsConstructor
public class PatientReferenceExtensionsDTO {
    @NotNull
    private PatientReference patientReference;
    @NotNull
    private List<String> extensions;
}
