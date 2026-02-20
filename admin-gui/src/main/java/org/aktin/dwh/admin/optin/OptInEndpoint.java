package org.aktin.dwh.admin.optin;

import lombok.val;
import org.aktin.Preferences;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.dwh.admin.optin.model.OptInErrorType;
import org.aktin.dwh.admin.optin.model.PatientEntryRequestDTO;
import org.aktin.dwh.admin.optin.model.PatientEntryResponseDTO;
import org.aktin.dwh.optinout.model.*;
import org.aktin.dwh.optinout.service.PatientService;
import org.aktin.dwh.optinout.service.PatientValidator;
import org.aktin.dwh.optinout.service.StudyService;

import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * RESTful HTTP end point for creating, deleting and retrieving patient entries.
 */
@Secured
@Path("studies")
public class OptInEndpoint {
    private static final Logger log = Logger.getLogger(OptInEndpoint.class.getName());
    @Inject
    private StudyService studyService;
    @Inject
    private PatientService patientService;
    @Inject
    private Preferences pref;
    @Inject
    private PatientValidator validator;

    @Context
    private SecurityContext security;

    /**
     * Gets a list of all studies.
     *
     * @return list of studies
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStudies() {
        List<? extends Study> studies = null;
        try {
            studies = studyService.getStudies();
        } catch (IOException e) {
            throw ErrorUtils.buildError(Status.NOT_FOUND, OptInErrorType.UNKNOWN, "An error occurred while retrieving studies:");
        }
        if(studies == null || studies.isEmpty()) {
            throw ErrorUtils.buildError(Status.NOT_FOUND, OptInErrorType.STUDIES_NOT_FOUND, "No studies found");
        }
        return Response.ok(studies).build();
    }

    /**
     * Get all patient entries that belong to the study of the specified id.
     *
     * @param id
     * @return Response with status 'ok' and the list of entries
     */
    @Path("{id}/patients")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPatientsOfStudy(@PathParam("id") String id) {
        List<PatientEntry> patients = null;
        try {
            patients = patientService.getAllPatientsOfStudy(id);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if(patients == null || patients.isEmpty()) {
            throw ErrorUtils.buildError(Status.NOT_FOUND, OptInErrorType.PATIENTS_NOT_FOUND, "No patients of study found");
        }
        return Response.ok(patients).build();
    }


    /**
     * Gets an entry by the specified study id, reference type, root and extension parameters.
     *
     * @param id:   study id
     * @param ref:  type of the patient reference
     * @param ext:  extension number, can be empty
     * @return PatientEntry that belongs to the given parameters
     */
    @Path("{studyId}/patients/{reference}/{extension}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPatient(@PathParam("studyId") String id,
                               @PathParam("reference") PatientReference ref,
                               @PathParam("extension") String ext) {
        PatientEntry patientEntry = null;
        try {
            patientEntry = patientService.getPatientByID(id, ref, ext);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if(patientEntry == null) {
            throw ErrorUtils.buildError(Status.NOT_FOUND, OptInErrorType.PATIENT_NOT_FOUND, "Patient not found");
        }
        return Response.ok(patientEntry).build();
    }

    /**
     * Get encounters for a patient
     *
     * @param ref  patient reference
     * @param extensions  extension
     * @return list of patient encounters
     */
    @Path("patients/{reference}/encounters")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEncounters(@PathParam("reference") PatientReference ref,
                                  List<String> extensions) {
        List<PatientEncounter> encounters = null;
        try {
            encounters = patientService.getEncounters(ref, extensions);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if(encounters == null || encounters.isEmpty()) {
            throw ErrorUtils.buildError(Status.NOT_FOUND, OptInErrorType.ENCOUNTERS_NOT_FOUND, "Encounters not found");
        }
        return Response.ok(encounters).build();
    }


    @Path("patients/{reference}/masterdata")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMasterData(@PathParam("reference") PatientReference ref,
                                  List<String> extensions) {
        List<PatientMasterData> masterData = null;
        try {
            masterData = patientService.getMasterData(ref, extensions);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if(masterData == null || masterData.isEmpty()) {
            throw ErrorUtils.buildError(Status.NOT_FOUND, OptInErrorType.MASTERDATA_NOT_FOUND, "Master data not found");
        }
        return Response.ok(masterData).build();
    }

    /**
     * Creates an entry under the location of the specified parameters with the data of the given PatientEntryRequest object.
     *
     * @param id:    study id
     * @param ref:   type of the patient reference
     * @param ext:   extension number, can be empty
     * @param entry: object that contains further information (participation, sic, comment) about the entry
     * @return Response with status 'created' if the entry was successfully created, otherwise Response with status 'conflict' if the entry already exists
     */
    @Path("{studyId}/patients/{reference}/{extension}")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref,
                                @PathParam("extension") String ext, PatientEntryRequestDTO entry) {
        val username = security.getUserPrincipal().getName();
        val patientData = entry.toPatientEntryData();
        try {
            PatientEntry pat = patientService.getPatientByID(id, ref, ext);
            val shouldAddPatient = pat == null;

            if (shouldAddPatient) {
                patientData.setReference(ref);
                patientService.addPatientsToStudy(id, Collections.singletonList(patientData), username);
            } else {
                patientService.updatePatient(id, ref, ext, patientData, username);
            }

            pat = patientService.getPatientByID(id, ref, ext);
            val response = new PatientEntryResponseDTO(pat);

            if (shouldAddPatient) {
                return Response.created(buildEntryLocation(id, pat)).entity(response).build();
            } else {
                return Response.ok(pat).build();
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static URI buildEntryLocation(String studyId, PatientEntry entry) throws UnsupportedEncodingException {
        return URI.create(MessageFormat.format("{0}/{1}/{2}", studyId, entry.getReference(), URLEncoder.encode(entry.getExtension(), StandardCharsets.UTF_8.name())));
    }

    /**
     * Deletes an entry which matches the given id, reference, root and extension.
     *
     * @param id:   study id
     * @param ref:  type of the patient reference
     * @param ext:  extension number, can be empty
     * @return Response with status 'bad request' if no entry for these parameters was found, otherwise Response with status 'ok'
     */
    @Secured
    @Path("{studyId}/patients/{reference}/{extension}")
    @DELETE
    public Response deleteEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref,
                                @PathParam("extension") String ext) {
        try {
            val pat = patientService.getPatientByID(id, ref, ext);
            if (pat == null) {
                throw ErrorUtils.buildError(Status.NOT_FOUND, OptInErrorType.PATIENT_NOT_FOUND, "Patient not found");
            }
            patientService.deletePatient(id, ref, ext, security.getUserPrincipal().getName());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return Response.noContent().build();
    }

    /**
     * Validates entered entry data for batch registration
     *
     * @param id      Study id
     * @param patients Entry data to validate
     * @return validation result, master data and encounters for every valid entry
     */
    @Secured
    @Path("{studyId}/patients/batch/validate")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateEntries(@PathParam("studyId") String id,
                                    List<PatientEntryRequestDTO> patients) {
        Map<PatientEntry, List<ValidationResult>> map = null;
        try {
            map = validator.validatePatients(id, patients.stream().map(PatientEntryRequestDTO::toPatientEntryData).collect(Collectors.toList()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        val result = map.entrySet().stream()
                .map(e -> {
                    val r = new PatientEntryResponseDTO(e.getKey());
                    r.setValidationResults(e.getValue());
                    return r;
                })
                .collect(Collectors.toList());
        return Response.ok(result).build();
    }

    /**
     * Batch registration for multiple entries
     *
     * @param id      Study id
     * @param entries new entry data
     * @return created entries
     */
    @Secured
    @Path("{studyId}/patients/batch")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createEntries(@PathParam("studyId") String id,
                                  List<PatientEntryRequestDTO> entries) {
        try {
            patientService.addPatientsToStudy(id,
                    entries.stream().map(PatientEntryRequestDTO::toPatientEntryData).collect(Collectors.toList()),
                    security.getUserPrincipal().getName());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return Response.ok().build();
    }

    /**
     * Builds an JSON object with the preference values that are necessary for client side in context of the study manager.
     *
     * @return JSON object with the study relevant preferences
     */
    @Path("preferences")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public JsonObject getPreferences() {
        JsonObjectBuilder b = Json.createObjectBuilder();
        b.add("reference", pref.get("study.id.reference"));
        b.add("rootPatient", pref.get("cda.patient.root.preset"));
        b.add("rootEncounter", pref.get("cda.encounter.root.preset"));
        b.add("rootBilling", pref.get("cda.billing.root.preset"));
        b.add("separator", pref.get("study.id.separator"));
        b.add("labelPatient", pref.get("study.id.patient.label"));
        b.add("labelEncounter", pref.get("study.id.encounter.label"));
        b.add("labelBilling", pref.get("study.id.billing.label"));
        return b.build();
    }
}
