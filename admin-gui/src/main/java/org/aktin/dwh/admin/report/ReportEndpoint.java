package org.aktin.dwh.admin.report;


import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.report.GeneratedReport;
import org.aktin.report.Report;
import org.aktin.report.ReportArchive;
import org.aktin.report.ReportManager;

/**
 * RESTful HTTP end point for generating reports.
 * 
 * @author R.W.Majeed
 *
 */
@Path("report")
public class ReportEndpoint {

	@Inject
	ReportManager manager;
	
	@Inject
	ReportArchive archive;

	@Inject // TODO no need for tracker, user archive
	ReportTracker tracker;

	/**
	 * List all available report templates
	 * @return report templates
	 */
	@GET
	@Path("template")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ReportTemplate> getTemplates(){
		ArrayList<ReportTemplate> reports = new ArrayList<>();
		manager.reports().forEach(r -> reports.add(new ReportTemplate(r)));
		return reports;
	}

	/**
	 * Request a report to be generated for the specified template.
	 * <p>
	 *  For debugging, you can use the following command:
	 *  <pre>
	 *  curl -X POST http://localhost:8080/aktin/admin/report/template/org.aktin.report.test.SimpleReport --header 'Content-type: application/json' --data '{"from":"2001-01-01T00:00:00Z"}'
	 *  </pre>
	 * </p>
	 *
	 * @param templateId report template id
	 * @param request request body
	 * @return response response. On success, HTTP_CREATED with location header.
	 * @throws URISyntaxException failure to produce a report location URL
	 * @throws IOException error
	 */
	@POST
	@Path("template/{templateId}")
	//@Consumes(MediaType.APPLICATION_JSON)
	public Response generateReport(@PathParam("templateId") String templateId, ReportRequest request) throws URISyntaxException, IOException{
		System.out.println("Generate report: "+templateId);
		Report report = manager.getReport(templateId);
		if( report == null ){
			throw new NotFoundException("There is no template "+templateId);
		}
		// verify request contents
		verifyRequest(report, request);

		java.nio.file.Path temp = Files.createTempFile(report.getId(), ".pdf");
		System.out.println("Using temp file: "+temp);

		// TODO determine authenticated user
		// TODO use archive for token id
		int token = tracker.createReport(report, request, temp);
		
		return Response.created(new URI("generated/"+token)).build();
	}

	/**
	 * Verify the request contents and throw an exception if not valid.
	 * @param report report
	 * @param request report request contents
	 * @throws BadRequestException verification failure
	 */
	private void verifyRequest(Report report, ReportRequest request) throws BadRequestException{
		if( request.from == null ){
			throw new BadRequestException("From timestamp must be specified");
		}
	}
	/**
	 * List generated reports
	 * @return generated reports
	 */
	@GET
	@Path("generated")
	@Produces(MediaType.APPLICATION_JSON)
	public List<GeneratedReport> getGeneratedReports(){
		return null;//(List<GeneratedReport>) archive.reports();
	}
	
}
