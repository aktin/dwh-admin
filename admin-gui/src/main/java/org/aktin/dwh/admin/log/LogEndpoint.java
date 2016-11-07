package org.aktin.dwh.admin.log;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Base64;
import java.util.Objects;
import java.util.function.Supplier;

import javax.inject.Inject;
import javax.naming.NamingException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.db.Manager;

/**
 * RESTful endpoint for log management. Show logfile with optional filtering.
 * Allow downloading logfile as Zip.
 * 
 * Calls are forwarded to the wildfly management API. E.g.
 * <pre>
 * curl -L -D - http://127.0.0.1:19990/management --header "Content-Type: application/json" -d '{"operation":"read-children-names","address":[{"subsystem":"logging"}],"child-type":"log-file","json.pretty":1}' --digest -u aktin:aktin2
 * </pre>
 * or
 * <pre>
 * curl -L -D - http://127.0.0.1:19990/management --header "Content-Type: application/json" -d '{"operation":"read-log-file","address":[{"subsystem":"logging"},{"log-file":"server.log"}],"json.pretty":1}' --digest -u aktin:aktin2
 * </pre>
 * @author R.W.Majeed
 *
 */
@Path("log")
public class LogEndpoint {
	
	@Inject
	private LogLineSupplierFactory logSupplier;

	public LogEndpoint(){
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(){
		Supplier<String> log = logSupplier.readLogfile();
		
		return Response.ok(new LogFileFilter(log)).build();
	}
	@GET
	@Path("test")
	@Produces(MediaType.TEXT_PLAIN)
	public Response test(){
		String ret = "OK";
		return Response.ok(ret).build();
	}
}
