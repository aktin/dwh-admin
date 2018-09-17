package org.aktin.dwh.admin.report;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

@Path("report/archive")
public class ReportArchiveEndpoint {
	
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
		long maxTimestamp = 0L;
		int numWaiting = 0;
		for (ArchivedReport report : archive.reports()) {
			ReportEntry reportEntry = ReportEntry.fill(report);
			if (reportEntry.status == Status.Waiting) {
				numWaiting += 1;
			}
			list.add(reportEntry);
			if(reportEntry.created.getTime() > maxTimestamp) {
				maxTimestamp = reportEntry.created.getTime();
			}
		}
		// eTag consists of timestamp of the last created report and the number of reports with status 'Waiting' (to register changes from waiting to terminal status)
		EntityTag etag = new EntityTag(Long.toString(maxTimestamp) + "-" + Integer.toString(numWaiting)); 
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
		if( report == null ) {
			throw new NotFoundException();
		}
		ReportEntry reportEntry = ReportEntry.fill(report);
		// eTag consists of creation timestamp and the ordinal of the status (to register changes from waiting to terminal status)
		EntityTag etag = new EntityTag(Long.toString(reportEntry.created.getTime()) + "-" + reportEntry.status.ordinal()); 
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
