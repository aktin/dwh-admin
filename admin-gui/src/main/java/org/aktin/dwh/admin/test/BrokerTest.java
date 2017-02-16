package org.aktin.dwh.admin.test;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URI;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

@Path("test/broker")
public class BrokerTest {
	@Inject
	Preferences prefs;

	@Path("status")
	@GET
	public Response retrieveStatus(){
		try{
			URI uri = URI.create(prefs.get(PreferenceKey.brokerEndpointURI));
			HttpURLConnection c = (HttpURLConnection)uri.resolve("status").toURL().openConnection();
			return Response.ok(c.getInputStream(), MediaType.APPLICATION_XML).build();
		} catch ( Throwable e ) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			return Response.serverError().entity(errors.toString()).build();
		}
		
	}
}
