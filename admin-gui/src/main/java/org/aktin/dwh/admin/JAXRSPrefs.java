package org.aktin.dwh.admin;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.Preferences;
import org.aktin.dwh.admin.auth.Credentials;

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
		for( String key : prefs.keySet() ){
			ret.put(key, prefs.get(key));
		}
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
	 * @param key preference name
	 * @return preferf
	 */
	@GET
	@Path("{key}")
	public Response get(@PathParam("key") String name) {
		String pref = prefs.get(name);
		// check if preference is available
		if( pref == null ){
			return Response.status(Response.Status.NOT_FOUND)
					.entity("Param not found: "+name)
					.build();
		}
		// return response
		return Response.ok(pref).build();
	}
	
}
