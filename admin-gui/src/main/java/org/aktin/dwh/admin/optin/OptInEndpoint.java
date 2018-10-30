package org.aktin.dwh.admin.optin;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.aktin.Preferences;
import org.aktin.dwh.admin.auth.Secured;
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
	public Response getAllPatients(@Context Request request) throws IOException {
		long maxTimestamp = 0L;
		int numberPat = 0;
		List<PatientEntry> patientList = new ArrayList<>();
		for(Study study : sm.getStudies()) {
			List<? extends PatientEntry> patients = study.allPatients();
			patientList.addAll(patients);
			for(PatientEntry p : patients) {
				numberPat++;
				if(p.getTimestamp() > maxTimestamp) {
					maxTimestamp = p.getTimestamp();
				}
			}
		}
		EntityTag etag = new EntityTag(Long.toString(maxTimestamp) + "-" + Integer.toString(numberPat));
		ResponseBuilder b = request.evaluatePreconditions(etag);
		if (b != null) {
			return b.build();
		}
		return Response.ok(patientList)
					   .tag(etag)
					   .header("Access-Control-Expose-Headers", "ETag")
					   .build();
	}
	
	@Path("{studyId}")
	@GET
	public Response getEntriesByStudy(@PathParam("studyId") String id) throws IOException {
		Optional<? extends Study> o = sm.getStudies().stream().filter(s -> s.getId().equals(id)).findFirst();
		if (!o.isPresent()) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		Study s = o.get();
		List<PatientEntry> list = new ArrayList<>();
		list.addAll(s.allPatients());
		return Response.ok(list).build();
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
	
	@Secured
	@Path("addPatientEntry/{studyId}")
	@POST
	@Consumes({MediaType.APPLICATION_XML,MediaType.APPLICATION_JSON})
	public Response addPatient(@PathParam("studyId") String studyId, PatientEntryRequest patientEntry) throws NoSuchElementException, IOException {
		Study study = sm.getStudies().stream().filter(s -> s.getId().equals(studyId)).findFirst()
				.orElseThrow( () -> new NoSuchElementException("Unable to find study with id " + studyId + ".") );
		patientEntry.sic = study.generateSIC();
		// TODO: manual codes optional or depending on prefs
//		if(study.getManualCodes()) {
//			patientEntry.sic = study.generateSIC();
//		}
		PatientReference pat_ref = PatientReference.valueOf(pref.get("study.id.reference"));
		String root;
		switch (pat_ref) {
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
		if (root.isEmpty()) {
			if (patientEntry.id_ext.contains(pref.get("study.id.separator"))) {
				String[] splits = patientEntry.id_ext.split(pref.get("study.id.separator"), 2);
				root = splits[0];
				patientEntry.id_ext = splits[1];
			} else {
				root = patientEntry.id_ext;
				patientEntry.id_ext = "";
			}
		}
		// study.getPatientByID(arg0, arg1, arg2)
		PatientEntry pat = study.addPatient(pat_ref, root, patientEntry.id_ext, patientEntry.opt, patientEntry.sic, patientEntry.comment, security.getUserPrincipal().getName());
		return Response.ok(pat).build();
		// return Response.created(location)
	}
	
	@Secured
	@Path("deletePatientEntry/{studyId}/{sic}")
	@DELETE
	public void deletePatient(@PathParam("studyId") String id, @PathParam("sic") String sic) throws FileNotFoundException, IOException {
		Study study = sm.getStudies().stream().filter(s -> s.getId().equals(id)).findFirst()
				.orElseThrow( () -> new NoSuchElementException("Unable to find study with id " + id + ".") );
		PatientEntry pat = study.getPatientBySIC(sic);
		pat.delete(security.getUserPrincipal().getName());
	}
	
	@Path("preferences")
	@GET
	public JsonObject getPreferences() {
		JsonObjectBuilder b = Json.createObjectBuilder();
		b.add("reference", pref.get("study.id.reference"));
		b.add("labelPatient", pref.get("study.id.patient.label"));
		b.add("labelEncounter", pref.get("study.id.encounter.label"));
		b.add("labelBilling", pref.get("study.id.billing.label"));
		JsonObject p = b.build();
		return p;
	}
		
}
