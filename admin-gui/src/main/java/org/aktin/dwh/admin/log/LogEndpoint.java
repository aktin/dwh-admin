package org.aktin.dwh.admin.log;

import java.util.function.Supplier;

import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * RESTful endpoint for log management. Show logfile with optional filtering.
 * <p>
 * Display logs e.g. via {@code GET /admin/log?level=WARNING}
 * </p>
 * 
 * </p>
 * <p>
 * Calls are forwarded to the wildfly management API. E.g.
 * <pre>
 * curl -L -D - http://127.0.0.1:19990/management --header "Content-Type: application/json" -d '{"operation":"read-children-names","address":[{"subsystem":"logging"}],"child-type":"log-file","json.pretty":1}' --digest -u aktin:aktin2
 * </pre>
 * or
 * <pre>
 * curl -L -D - http://127.0.0.1:19990/management --header "Content-Type: application/json" -d '{"operation":"read-log-file","address":[{"subsystem":"logging"},{"log-file":"server.log"}],"json.pretty":1}' --digest -u aktin:aktin2
 * </pre>
 * </p>
 * @author R.W.Majeed
 *
 */
@Path("log")
public class LogEndpoint {
	
	@Inject
	private LogLineSupplierFactory logSupplier;

	public LogEndpoint(){
	}

	/**
	 * To read the logfile, use {@code GET /admin/log}. For filtering, a query
	 * parameter {@code level} can be specified. E.g. {@code GET /admin/log?level=WARNING}.
	 * See {@link FilterLevel}.
	 * @param level filter level. Lines with levels higher than specified are also displayed.
	 *   E.g. a level of {@code WARNING} will also show lines with {@code ERROR} level.
	 * @return response JSON output stream
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@DefaultValue("INFO") @QueryParam("level") FilterLevel level){
		Supplier<String> log = logSupplier.readLogfile();
		
		return Response.ok(new LogFileFilter(log, level)).build();
	}
	@GET
	@Path("test")
	@Produces(MediaType.TEXT_PLAIN)
	public Response test(){
		String ret = "OK";
		return Response.ok(ret).build();
	}
}
