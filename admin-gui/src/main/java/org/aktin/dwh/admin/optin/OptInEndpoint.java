package org.aktin.dwh.admin.optin;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.Response.Status;

import org.aktin.Preferences;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.dwh.optinout.Participation;
import org.aktin.dwh.optinout.PatientEntry;
import org.aktin.dwh.optinout.PatientReference;
import org.aktin.dwh.optinout.Study;
import org.aktin.dwh.optinout.StudyManager;

@Path("optin")
public class OptInEndpoint {
	private static final Logger log = Logger.getLogger(OptInEndpoint.class.getName());
	@Inject
	private StudyManager sm;
	@Inject
	private Preferences pref;
	
	@Context 
	private SecurityContext security;

	@GET
	public List<PatientEntry> getEntries() throws IOException {
		List<PatientEntry> patientList = new ArrayList<>();
		for(Study study : sm.getStudies()) {
			List<? extends PatientEntry> patients = study.allPatients();
			patientList.addAll(patients);
		}
		return patientList;
	}
	
	@Path("studies")
	@GET
	public List<StudyWrapper> getStudies() throws IOException {
		List<StudyWrapper> studies = new ArrayList<>();
		for(Study s : sm.getStudies()) {
			studies.add(new StudyWrapper(s));
		}
		return studies;
	}
	
	@Path("{studyId}")
	@GET
	public Response getEntriesByStudy(@PathParam("studyId") String id) throws IOException {
		Study s = this.getStudy(id);
		List<PatientEntry> list = new ArrayList<>();
		list.addAll(s.allPatients());
		return Response.ok(list).build();
	}
	

	@Path("{studyId}/{reference}/{root}/{extension}")
	@GET
	public PatientEntry getEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref, @PathParam("root") String root, 
			@PathParam("extension") String ext) throws IOException {
		Study study = this.getStudy(id);
		return study.getPatientByID(ref, root, ext);
	}
	
	@Secured
	@Path("{studyId}/{reference}/{root}/{extension}")
	@POST
	@Consumes({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public Response createEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref, @PathParam("root") String root, 
				@PathParam("extension") String ext, PatientEntryRequest entry) throws IOException {
		Study study = this.getStudy(id);
		if ((!study.supportsManualSICs() || entry.sic.isEmpty()) && entry.opt == Participation.OptIn) {
			entry.sic = study.generateSIC();
		}
		PatientEntry pat = study.getPatientByID(ref, root, ext);
		if (pat != null) {
			log.log(Level.WARNING, "Cannot create entry, PatientEntry already exists.");
			return Response.status(Status.CONFLICT).build();
		}
		study.addPatient(ref, root, ext, entry.opt, entry.sic, entry.comment, security.getUserPrincipal().getName());
		return Response.created(URI.create(id+"/"+ref+"/"+root+"/"+ext)).build();
	}
	
	@Secured
	@Path("{studyId}/{reference}/{root}/{extension}")
	@DELETE
	public Response deleteEntry(@PathParam("studyId") String id, @PathParam("reference") PatientReference ref, @PathParam("root") String root, 
			@PathParam("extension") String ext) throws FileNotFoundException, IOException {
		Study study = this.getStudy(id);
		PatientEntry pat = study.getPatientByID(ref, root, ext);
		if (pat == null) {
			return Response.status(Status.BAD_REQUEST).build();
		} 
		pat.delete(security.getUserPrincipal().getName());
		return Response.ok().build();
	}
	
	@Path("preferences")
	@GET
	public JsonObject getPreferences() {
		String root;
		switch(PatientReference.valueOf(pref.get("study.id.reference"))) {
			case Patient:
				root = pref.get("cda.patient.root.preset");
				break;
			case Encounter:
				root = pref.get("cda.encounter.root.preset");
				break;
			case Billing:
				root = pref.get("cda.billing.root.preset");
				break;
			default:
				throw new IllegalArgumentException("Empty string as reference type is not allowed.");
		}
		JsonObjectBuilder b = Json.createObjectBuilder();
		b.add("reference", pref.get("study.id.reference"));
		b.add("root", root);
		b.add("seperator", pref.get("study.id.seperator"));
		b.add("labelPatient", pref.get("study.id.patient.label"));
		b.add("labelEncounter", pref.get("study.id.encounter.label"));
		b.add("labelBilling", pref.get("study.id.billing.label"));
		JsonObject p = b.build();
		return p;
	}
	
	private Study getStudy(String id) throws IOException {
		return sm.getStudies().stream().filter(s -> s.getId().equals(id)).findFirst()
				.orElseThrow( () -> new NotFoundException("Unable to find study with id " + id + ".", Response.status(Status.NOT_FOUND).build()) );
	}
	
		
}
