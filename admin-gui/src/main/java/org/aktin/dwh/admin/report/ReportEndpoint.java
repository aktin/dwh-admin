package org.aktin.dwh.admin.report;


import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.report.Report;
import org.aktin.report.manager.ReportManager;


@Path("report")
public class ReportEndpoint {

	@Inject
	ReportManager manager;
	
	@GET
	@Path("test")
	@Produces(MediaType.TEXT_PLAIN)
	public Response test(){
		String ret = "OK:";
		for( Report report : manager.reports() ){
			ret += report+":";
		}

		return Response.ok(ret).build();
	}
	
}
