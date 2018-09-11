package org.aktin.dwh.admin.report;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.aktin.report.ArchivedReport;
import org.aktin.report.ReportArchive;
import org.aktin.report.ArchivedReport.Status;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Path("report/archive")
public class ReportArchiveEndpoint {
	private static final Logger log = Logger.getLogger(ReportArchiveEndpoint.class.getName());
	
	@Inject
	ReportArchive archive;
	/**
	 * List generated reports
	 * @return Response with list of all generated reports or response with status 304 (not modified) if the list 
	 * on the client is the same as on the broker (eTag didn't change).
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getGeneratedReports(@Context Request request) {
		List<ReportEntry> list = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		String reportsJson = "";
		for (ArchivedReport report : archive.reports()) {
			list.add(ReportEntry.fill(report));
		}
		try {
			reportsJson = mapper.writeValueAsString(list);
	    } catch (JsonProcessingException e) {
	    	log.log(Level.WARNING, "Unable to convert reportEntryList to JSON ", e);
	    }
		EntityTag etag = new EntityTag(Integer.toString(reportsJson.hashCode()));
		ResponseBuilder b = request.evaluatePreconditions(etag);
		if (b != null) {
			return b.build();
		}
		return Response.ok(list)
					   .tag(etag)
					   .header("Access-Control-Expose-Headers", "ETag")
					   .build();
	}
	
	/**
	 * List report info of specified id
	 * @return Response with report entry or response with status 304 (not modified) if the report entry 
	 * on the client is the same as on the broker (eTag didn't change).
	 */
	@GET
	@Path("{id}/info")
	public Response getReportInfo(@PathParam("id") int id, @Context Request request) throws IOException {
		ArchivedReport report = archive.get(id);
		ObjectMapper mapper = new ObjectMapper();
		String reportJson = "";
		if( report == null ){
			throw new NotFoundException();
		}
		ReportEntry reportEntry = ReportEntry.fill(report);
		try {
			reportJson = mapper.writeValueAsString(reportEntry);
	    } catch (JsonProcessingException e) {
	    	log.log(Level.WARNING, "Unable to convert reportEntry to JSON ", e);
	    }
		EntityTag etag = new EntityTag(Integer.toString(reportJson.hashCode()));
		ResponseBuilder b = request.evaluatePreconditions(etag);
		if (b != null) {
			return b.build();
		}
		return Response.ok(reportEntry)
				   	   .tag(etag)
				   	   .header("Access-Control-Expose-Headers", "ETag")
				   	   .build();
	}

	@HEAD
	@Path("{id}")
	public Response getReportMetadata(@PathParam("id") int id) throws IOException{
		ArchivedReport report = archive.get(id);
		if( report == null ) {
			throw new NotFoundException();
		}
		if( report.getStatus() == Status.Waiting ) {
			return Response.accepted().build();
		} 
		Objects.requireNonNull(report.getLocation(), "Archived report without location:" + id);
		return Response.ok().type(report.getMediaType()).build();
	}
	
	@GET
	@Path("{id}")
	public Response getGeneratedReport(@PathParam("id") int id) throws IOException{
		ArchivedReport report = archive.get(id);
		if( report == null ){
			throw new NotFoundException();
		}
		if( report.getStatus() == Status.Waiting ) {
			return Response.accepted().build();
		}
		Objects.requireNonNull(report.getLocation(),"Archived report without location:"+id);
		return Response.ok(Files.newInputStream(report.getLocation()), report.getMediaType()).build();
	}

	public static final URI buildReportURI(ArchivedReport report){
		return URI.create("report/archive/"+report.getId());
	}
}
