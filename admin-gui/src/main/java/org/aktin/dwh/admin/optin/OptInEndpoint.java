package org.aktin.dwh.admin.optin;

import lombok.val;
import org.aktin.Preferences;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.dwh.optinout.*;

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
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * RESTful HTTP end point for creating, deleting and retrieving patient entries.
 * 
 */
@Path("optin")
public class OptInEndpoint {
	private static final Logger log = Logger.getLogger(OptInEndpoint.class.getName());
	@Inject
	private StudyManager sm;
	@Inject
	private Preferences pref;
	
	@Context 
	private SecurityContext security;
	
	/**
	 * Gets all patient entries of all existing studies.
	 * @return list of all patient entries of all studies
	 * @throws IOException
	 */
	@GET
	public List<PatientEntry> getEntries() throws IOException {
		List<PatientEntry> patientList = new ArrayList<>();
		for(Study study : sm.getStudies()) {
			List<? extends PatientEntry> patients = study.allPatients();
			patientList.addAll(patients);
		}
		return patientList;
	}
	
	/**
	 * Gets a list of all studies.
	 * @return list of studies
	 * @throws IOException
	 */
	@Path("studies")
	@GET
	public List<Study> getStudies() throws IOException {
		return (List<Study>) sm.getStudies();
	}
	
	/**
	 * Get all patient entries that belong to the study of the specified id.
	 * @param id
	 * @return Response with status 'ok' and the list of entries
	 * @throws IOException
	 */
	@Path("{studyId}")
	@GET
	public Response getEntriesByStudy(@PathParam("studyId") String id) throws IOException {
		Study s = this.getStudy(id);
		List<PatientEntry> list = new ArrayList<>();
		list.addAll(s.allPatients());
		return Response.ok(list).build();
	}
	

	/**
	 * Gets an entry by the specified study id, reference type, root and extension parameters.
	 * @param id: study id 
	 * @param ref: type of the patient reference 
	 * @param root: root number
	 * @param ext: extension number, can be empty
	 * @return PatientEntry that belongs to the given parameters
	 * @throws IOException
	 */
	@Path("{studyId}/{reference}/{root}{p:/?}{extension:.*}")
	@GET
	@Produces({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public PatientEntry getEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref, @PathParam("root") String root, 
			@PathParam("extension") String ext) throws IOException {
		Study study = this.getStudy(id);
		return study.getPatientByID(ref, root, ext);
	}

	/**
	 * Gets an entry by the specified study id, reference type, root and extension parameters.
	 * @param id: study id
	 * @param sic unique student object identifier
	 * @return PatientEntry that belongs to the given parameters
	 * @throws IOException
	 */
	@Path("{studyId}/{sic}")
	@GET
	@Produces({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public PatientEntry getEntryBySic(@PathParam("studyId") String id, @PathParam("sic") String sic) throws IOException {
		Study study = this.getStudy(id);
		return study.getPatientBySIC(sic);
	}

	@Path("encounter/{reference}/{root}{p:/?}{extension:.*}")
	@GET
	@Produces({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public List<PatientEncounter> getEncounters(@PathParam("reference") PatientReference ref,
												@PathParam("root") String root,
												@PathParam("extension") String ext) throws IOException {
		return sm.loadEncounters(ref, root, ext);
	}

	@Path("masterdata/{reference}/{root}{p:/?}{extension:.*}")
	@GET
	@Produces({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public PatientMasterData getMasterData(@PathParam("reference") PatientReference ref,
										   @PathParam("root") String root,
										   @PathParam("extension") String ext) throws IOException {
		return sm.loadMasterData(ref, root, ext);
	}
	
	/**
	 * Creates an entry under the location of the specified parameters with the data of the given PatientEntryRequest object. 
	 * @param id: study id
	 * @param ref: type of the patient reference
	 * @param root: root number
	 * @param ext: extension number, can be empty
	 * @param entry: object that contains further information (participation, sic, comment) about the entry
	 * @return Response with status 'created' if the entry was successfully created, otherwise Response with status 'conflict' if the entry already exists
	 * @throws IOException
	 */
	@Secured
	@Path("{studyId}/{reference}/{root}{p:/?}{extension:.*}")
	@POST
	@Consumes({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public Response createEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref, @PathParam("root") String root, 
				@PathParam("extension") String ext, PatientEntryRequest entry) throws IOException {
		Study study = this.getStudy(id);

		PatientEntry pat = study.getPatientByID(ref, root, ext);
		if (pat != null) {
			log.log(Level.WARNING, "Cannot create entry, PatientEntry already exists.");
			return Response.status(Status.CONFLICT).entity(pat).build();
		}

		pat = study.getPatientBySIC(entry.sic);
		if (pat != null) {
			log.log(Level.WARNING, "Cannot create entry, SIC already exists.");
			return Response.status(Status.CONFLICT).entity(pat).build();
		}

		if (study.getSicGeneration() == SICGeneration.AutoAndManual && (entry.sic == null || entry.sic.isEmpty())) {
			entry.sic = study.generateSIC();
		}

		pat = study.addPatient(ref, root, ext, entry.opt, entry.sic, entry.comment, security.getUserPrincipal().getName());

		return Response.created(buildEntryLocation(pat)).entity(pat).build();
	}

	/**
	 * Updates an existing entry
	 * @param id: study id
	 * @param ref: type of the patient reference
	 * @param root: root number
	 * @param ext: extension number, can be empty
	 * @param newEntry: object that contains further information (participation, sic, comment) about the entry
	 * @return Response with status 'created' if the entry was successfully created, otherwise Response with status 'conflict' if the entry already exists
	 * @throws IOException
	 */
	@Secured
	@Path("{studyId}/{reference}/{root}{p:/?}{extension:.*}")
	@PUT
	@Consumes({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public Response updateEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref, @PathParam("root") String root,
								@PathParam("extension") String ext, PatientEntryRequest entry) throws IOException {
		val study = this.getStudy(id);

		PatientEntry oldEntry = study.getPatientByID(ref, root, ext);
		if (oldEntry == null) {
			log.log(Level.WARNING, "Cannot update entry, entry does not exist");
			return Response.status(Status.BAD_REQUEST).entity(oldEntry).build();
		}
		PatientEntry newEntry = study.getPatientByID(ref, root, ext);
		newEntry.setComment(entry.comment);

		newEntry = study.updatePatient(oldEntry, newEntry);

		return Response.created(buildEntryLocation(newEntry)).entity(newEntry).build();
	}

	private static URI buildEntryLocation(PatientEntry entry) throws UnsupportedEncodingException {
		return URI.create(entry.getStudy().getId()+"/"+entry.getReference()+"/"+URLEncoder.encode(entry.getIdRoot(), StandardCharsets.UTF_8.name())+"/"+URLEncoder.encode(entry.getIdExt(), StandardCharsets.UTF_8.name()));
	}
	
	/**
	 * Deletes an entry which matches the given id, reference, root and extension. 
	 * @param id: study id
	 * @param ref: type of the patient reference
	 * @param root: root number
	 * @param ext: extension number, can be empty
	 * @return Response with status 'bad request' if no entry for these parameters was found, otherwise Response with status 'ok'
	 * @throws IOException
	 */
	@Secured
	@Path("{studyId}/{reference}/{root}{p:/?}{extension:.*}")
	@DELETE
	public Response deleteEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref, @PathParam("root") String root, 
			@PathParam("extension") String ext) throws IOException {
		Study study = this.getStudy(id);
		PatientEntry pat = study.getPatientByID(ref, root, ext);
		if (pat == null) {
			return Response.status(Status.BAD_REQUEST).build();
		} 
		pat.delete(security.getUserPrincipal().getName());
		return Response.ok().build();
	}
	
	/**
	 * Builds an JSON object with the preference values that are necessary for client side in context of the study manager.
	 * @return JSON object with the study relevant preferences
	 */
	@Path("preferences")
	@GET
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
	
	/**
	 * Gets the study by the given id.
	 * @param id: study id
	 * @return study object
	 * @throws IOException
	 * @throws NotFoundException if none of the existing study ids matches the given id
	 */
	private Study getStudy(String id) throws IOException {
		return sm.getStudies().stream().filter(s -> s.getId().equals(id)).findFirst()
				.orElseThrow( () -> new NotFoundException("Unable to find study with id " + id + ".", Response.status(Status.NOT_FOUND).build()) );
	}
	
		
}
