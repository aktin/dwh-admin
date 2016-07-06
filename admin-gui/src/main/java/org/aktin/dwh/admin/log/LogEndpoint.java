package org.aktin.dwh.admin.log;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * RESTful endpoint for log management. List log entries and delete the log.
 * 
 * @author R.W.Majeed
 *
 */
@Path("log")
public class LogEndpoint {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	Response get(){
		return Response.ok("TODO").build();
	}
}
