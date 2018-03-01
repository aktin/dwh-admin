package org.aktin.dwh.admin;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;


@Path("info")
public class InfoEndpoint {

	@GET()
	@Path("version")
	@Produces(MediaType.TEXT_PLAIN)
	public String getApplicationVersion(){
		// get EAR version
		String ver;
		try {
			ver = null;
			ver = (String) (new InitialContext().lookup( "java:app/AppName"));
		} catch (NamingException e) {
			ver = "undefined";
		}
		return ver;
	}
}
