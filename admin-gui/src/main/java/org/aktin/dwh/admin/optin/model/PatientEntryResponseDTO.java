package org.aktin.dwh.admin.optin.model;

import lombok.Getter;
import lombok.Setter;
import org.aktin.dwh.optinout.model.Participation;
import org.aktin.dwh.optinout.model.PatientEntry;
import org.aktin.dwh.optinout.model.PatientEntryData;
import org.aktin.dwh.optinout.model.ValidationResult;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.time.Instant;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
@Getter
public class PatientEntryResponseDTO {
    private String comment;
    private String root;
    private Participation participation;
    private Instant timestamp;
    private String user;
    private String extension;
    private String sic;
    private String ide;

    @Setter
    private List<ValidationResult> validationResults;

    PatientEntryResponseDTO() {
    }

    public PatientEntryResponseDTO(PatientEntry pat) {
        extension = pat.getExtension();
        sic = pat.getSIC();
        comment = pat.getComment();
        root = pat.getRoot();
        participation = pat.getParticipation();
        timestamp = pat.getTimestamp();
        user = pat.getUser();
        ide = pat.getIde();
    }
}
