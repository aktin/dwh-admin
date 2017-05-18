package org.aktin.dwh.admin.report;


import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.report.ArchivedReport;
import org.aktin.report.Report;
import org.aktin.report.ReportArchive;
import org.aktin.report.ReportInfo;
import org.aktin.report.ReportManager;

/**
 * RESTful HTTP end point for generating reports.
 * 
 * @author R.W.Majeed
 *
 */
@Path("report/template")
public class ReportEndpoint {
	private static final Logger log = Logger.getLogger(ReportEndpoint.class.getName());

	@Inject
	ReportManager manager;
	
	@Inject
	ReportArchive archive;

	/**
	 * List all available report templates
	 * @return report templates
	 */
	@GET
	@Path("")
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
	 * </p>
	 * <pre>
	 *  curl -X POST http://localhost:8080/aktin/admin/report/template/org.aktin.report.test.SimpleReport --header 'Content-type: application/json' --data '{"from":"2001-01-01T00:00:00Z"}'
	 * </pre>
	 *
	 * @param templateId report template id
	 * @param request request body
	 * @return response response. On success, HTTP_CREATED with location header.
	 * @throws URISyntaxException failure to produce a report location URL
	 * @throws IOException error
	 */
	@POST
	@Path("{templateId}")
	//@Consumes(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_XML)
	public Response generateReport(@PathParam("templateId") String templateId, ReportRequest request) throws URISyntaxException, IOException{
		System.out.println("Generate report: "+templateId);
		Report template = manager.getReport(templateId);
		if( template == null ){
			throw new NotFoundException("There is no template "+templateId);
		}
		// verify request contents
		verifyRequest(template, request);
		
		ReportInfo info = template.createReportInfo(
				Instant.ofEpochMilli(request.start.getTime()), 
				Instant.ofEpochMilli(request.end.getTime())
		);
	
		// create in archive
		ArchivedReport report = archive.addReport(info, "TODO:authuser");
		// generate report
		try {
			report.createAsync(manager);
		} catch (IOException e) {
			log.log(Level.WARNING, "Report creation failed, exception stored for "+report.getId(), e);
			archive.setReportFailure(report.getId(), null, e);
		}
		
		return Response.created(ReportArchiveEndpoint.buildReportURI(report)).build();
	}

	/**
	 * Verify the request contents and throw an exception if not valid.
	 * @param report report
	 * @param request report request contents
	 * @throws BadRequestException verification failure
	 */
	private void verifyRequest(Report report, ReportRequest request) throws BadRequestException{
		if( request.start == null ){
			throw new BadRequestException("Start timestamp must be specified");
		}
		if( request.end == null ){
			throw new BadRequestException("End timestamp must be specified");
		}
	}
}
