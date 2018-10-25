package org.aktin.dwh.admin.optin;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
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

import org.aktin.Preferences;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.dwh.optinout.PatientEntry;
import org.aktin.dwh.optinout.PatientReference;
import org.aktin.dwh.optinout.Study;
import org.aktin.dwh.optinout.StudyManager;

import com.fasterxml.jackson.databind.util.JSONPObject;

@Path("optin")
public class OptInEndpoint {
	 private static final Logger log = Logger.getLogger(OptInEndpoint.class.getName());
	@Inject
	private StudyManager sm;
	@Inject
	private Preferences pref;
	
	@Context 
	private SecurityContext security;

	@Path("test")
	@GET
	public String testFunction() throws IOException {
		StringBuilder b = new StringBuilder();
		List<? extends Study> l = sm.getStudies();
		for( Study s : l ) {
			b.append(s.getId());
			b.append(' ');
		}
		return b.toString();
	}
	
	@Path("studies")
	@GET
	public List<? extends Study> getStudies() throws IOException {
		return sm.getStudies();
	}
	
	@Path("patientList")
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
	
//	@Path("patientList/filter={studyId}+{date}+{optIn}+{optOut}")
//	@GET
//	public List<PatientEntry> getFilteredList(@PathParam("studyId") String id, @PathParam("date") String date, @PathParam("optIn") boolean optIn, @PathParam("optOut") boolean optOut) throws IOException {
//		List<PatientEntry> listAll = this.getAllPatients();
//		List<PatientEntry> filteredList = listAll.stream().filter(p -> {
//			boolean res = true;
//			if (!id.isEmpty()) {
//				res = res && p.getStudy().getId().equals(id);
//			}
//			if (res && date != null) {
//				LocalDate filterDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE_TIME));
//				LocalDate creation = Instant.ofEpochMilli(p.getTimestamp()).toLocalDate();
//				res = res && creation.equals(filterDate);
//			}
//			if(res && optIn) {
//				res = res && p.getParticipation() == Participation.OptIn;
//			}
//			if(res && optOut) {
//				res = res && p.getParticipation() == Participation.OptOut;
//			}
//			return res;
//			}).collect(Collectors.toList());
//		
//		return filteredList;
//	}
	
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
		PatientEntry pat = study.addPatient(pat_ref, root, patientEntry.id_ext, patientEntry.opt, patientEntry.sic, patientEntry.comment, security.getUserPrincipal().getName());
		return Response.ok(pat).build();
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
	
	@Path("studyPreferences")
	@GET
	public JsonObject getStudyPreferences() {
		JsonObjectBuilder b = Json.createObjectBuilder();
		b.add("reference", pref.get("study.id.reference"));
		b.add("labelPatient", pref.get("study.id.patient.label"));
		b.add("labelEncounter", pref.get("study.id.encounter.label"));
		b.add("labelBilling", pref.get("study.id.billing.label"));
		JsonObject p = b.build();
		return p;
	}
	
//	@Path("auditTrail")
//	@GET
//	public List<AuditTrailEntry> getAuditTrail() {
//		return sm.getAuditTrail();
//		
//	}
	
}
