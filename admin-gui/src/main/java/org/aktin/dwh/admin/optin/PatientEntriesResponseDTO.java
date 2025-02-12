package org.aktin.dwh.admin.optin;

import lombok.Getter;
import lombok.Setter;
import org.aktin.dwh.optinout.PatientEncounter;
import org.aktin.dwh.optinout.PatientMasterData;

@Getter @Setter
public class PatientEntriesResponseDTO {
    private String extension;
    private String sic;
    private EntryValidation entryValidation = EntryValidation.VALID;
    private PatientEncounter lastEncounter;
    private PatientMasterData masterData;
}
