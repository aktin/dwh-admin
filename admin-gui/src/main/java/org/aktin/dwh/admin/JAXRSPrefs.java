package org.aktin.dwh.admin;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.aktin.prefs.Preferences;

@Path("entry-point")
public class JAXRSPrefs {	 
	@Inject
	private Preferences prefs;

	@GET
	@Path("test")
	@Produces(MediaType.TEXT_PLAIN)
	public String test() {
	    return "Testoo:"+prefs;
	}
}
