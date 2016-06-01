package org.aktin.dwh.admin;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.dwh.admin.auth.Credentials;
import org.aktin.prefs.Preference;
import org.aktin.prefs.Preferences;

/**
 * RESTful interface for reading/writing preferences
 * 
 * Read prefs:
 * {@code GET http://localhost:8080/aktin/admin/prefs}
 * @author R.W.Majeed
 *
 */
@Path("prefs")
public class JAXRSPrefs {	 
	@Inject
	private Preferences prefs;

	// Authentication implemented similar to http://stackoverflow.com/questions/26777083/best-practice-for-rest-token-based-authentication-with-jax-rs-and-jersey

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String,Object> getAll(){
		Map<String, Object> ret = new HashMap<>();
		ret.put("a", "b");
		ret.put("c", "d");
		ret.put("d", 123);
		return ret;
	}
	
	@GET
	@Path("test")
	@Produces(MediaType.APPLICATION_JSON)
	public Credentials test(){
		Credentials c = new Credentials();
		c.password = "pasw";
		c.username = "usrn";
		return c;
	}
	/**
	 * Get the value for a single preference
	 * @param name preference name
	 * @return preferf
	 */
	@GET
	@Path("{name}")
	public Response get(@PathParam("name") String name) {
		Preference<?>pref = prefs.get(name);
		// check if preference is available
		if( pref == null ){
			return Response.status(Response.Status.NOT_FOUND)
					.entity("Param not found: "+name)
					.build();
		}
		// is it readable?
		if( pref.isPublicReadable() == false ){
			// not readable
			return Response.status(Response.Status.FORBIDDEN)
					.entity("Param not readable: "+name)
					.build();
		}
		// return response
		return Response.ok(pref.getValue().toString()).build();
	}
	
	@PUT
	@Path("{name}")
	public Response put(@PathParam("name") String name, String value){
		Preference<?>pref = prefs.get(name);
		// check if preference is available
		if( pref == null ){
			return Response.status(Response.Status.NOT_FOUND)
					.entity("Param not found: "+name)
					.build();
		}
		// is it writable?
		if( pref.isPublicWritable() == false ){
			// not writable
			return Response.status(Response.Status.FORBIDDEN)
					.entity("Param not writeable: "+name)
					.build();
		}
		pref.setValueString(value, null);
		// return response
		return Response.ok().build();
	}
}
