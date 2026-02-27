package org.aktin.dwh.admin.optin;

import lombok.val;
import org.aktin.Preferences;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.dwh.admin.optin.error.ErrorUtils;
import org.aktin.dwh.admin.optin.error.OptInErrorType;
import org.aktin.dwh.admin.optin.model.PatientEntryRequestDTO;
import org.aktin.dwh.admin.optin.model.PatientEntryResponseDTO;
import org.aktin.dwh.admin.optin.model.PatientReferenceExtensionsDTO;
import org.aktin.dwh.admin.optin.validation.CreateOrUpdateGroup;
import org.aktin.dwh.admin.util.PATCH;
import org.aktin.dwh.optinout.model.*;
import org.aktin.dwh.optinout.service.PatientService;
import org.aktin.dwh.optinout.service.PatientValidator;
import org.aktin.dwh.optinout.service.StudyService;

import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.validation.Valid;
import javax.validation.groups.ConvertGroup;
import javax.validation.groups.Default;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * RESTful HTTP end point for creating, deleting and retrieving patient entries.
 */
@Secured
@Path("studies")
public class OptInEndpoint {
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
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while retrieving studies");
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
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while retrieving patients");
        }
        return Response.ok(patients).build();
    }


    /**
     * Gets an entry by the specified study id, reference type, root, and extension parameters.
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
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while retrieving patient");
        }
        if (patientEntry == null) {
            return ErrorUtils.buildErrorResponse(Status.NOT_FOUND, OptInErrorType.PATIENT_NOT_FOUND, "Patient not found");
        }
        return Response.ok(patientEntry).build();
    }

    /**
     * Get encounters for patients
     *
     * @param ref  patient reference
     * @param extensions  extensions
     * @return list of patient encounters
     */
    @Path("/encounters")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEncountersForPatients(@Valid PatientReferenceExtensionsDTO request) {
        if(request.getExtensions().isEmpty()){
            return ErrorUtils.buildErrorResponse(Status.BAD_REQUEST, OptInErrorType.PARAM_INVALID, "List of extensions cannot be empty");
        }

        List<PatientEncounter> encounters = null;
        try {
            encounters = patientService.getEncounters(request.getPatientReference(), request.getExtensions());
        } catch (IOException e) {
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while retrieving encounters");
        }
        return Response.ok(encounters).build();
    }


    @Path("/masterdata")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMasterDataForPatients(@Valid PatientReferenceExtensionsDTO request) {
        if(request.getExtensions().isEmpty()){
            return ErrorUtils.buildErrorResponse(Status.BAD_REQUEST, OptInErrorType.PARAM_INVALID, "List of extensions cannot be empty");
        }

        List<PatientMasterData> masterData = null;
        try {
            masterData = patientService.getMasterData(request.getPatientReference(), request.getExtensions());
        } catch (IOException e) {
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while retrieving master data");
        }
        return Response.ok(masterData).build();
    }

    /**
     * Updates the comment of an existing entry
     *
     * @param id:    study id
     * @param ref:   type of the patient reference
     * @param ext:   extension
     * @param entry: object that contains further information (participation, sic, comment) about the entry
     * @return updated entry
     */
    @Path("{studyId}/patients/{reference}/{extension}")
    @PATCH
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEntryComment(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref,
                                @PathParam("extension") String ext,
                                @Valid @ConvertGroup(from = Default.class, to = CreateOrUpdateGroup.class) PatientEntryRequestDTO entry) {
        val username = security.getUserPrincipal().getName();
        val patientData = entry.toPatientEntryData();
        try {
            patientService.updatePatient(id, ref, ext, patientData, username);

            val pat = patientService.getPatientByID(id, ref, ext);

            return Response.ok(new PatientEntryResponseDTO(pat)).build();
        } catch (IOException e) {
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while updating patient entry");
        }
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
                return ErrorUtils.buildErrorResponse(Status.NOT_FOUND, OptInErrorType.PATIENT_NOT_FOUND, "Patient not found");
            }
            patientService.deletePatient(id, ref, ext, security.getUserPrincipal().getName());
        } catch (IOException e) {
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred deleting patient entry");
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
                                    @Valid List<PatientEntryRequestDTO> patients) {
        Map<PatientEntry, List<ValidationResult>> map = null;
        try {
            map = validator.validatePatients(id, patients.stream().map(PatientEntryRequestDTO::toPatientEntryData).collect(Collectors.toList()));
        } catch (IOException e) {
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while validating patients");
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
                                  @Valid @ConvertGroup(from = Default.class, to = CreateOrUpdateGroup.class) List<PatientEntryRequestDTO> entries) {
        try {
            patientService.addPatientsToStudy(id,
                    entries.stream().map(PatientEntryRequestDTO::toPatientEntryData).collect(Collectors.toList()),
                    security.getUserPrincipal().getName());
        } catch (IOException e) {
            return ErrorUtils.buildErrorResponse(Status.INTERNAL_SERVER_ERROR, OptInErrorType.UNKNOWN, "An error occurred while creating entries");
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
