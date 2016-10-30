package org.aktin.dwh.admin.user;

import java.io.IOException;
import java.net.URL;

import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.Response.Status;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.I2b2Authentication;
import org.aktin.dwh.admin.auth.Secured;

import de.sekmi.li2b2.client.Li2b2Client;
import de.sekmi.li2b2.client.pm.Role;
import de.sekmi.li2b2.client.pm.User;
import de.sekmi.li2b2.hive.ErrorResponseException;
import de.sekmi.li2b2.hive.HiveException;


/**
 * User administration endpoint. All methods require prior authentication with i2b2 credentials.
 * Command line testing:
 * <pre>
 * curl -H "Authorization: Bearer c2ab812d-94db-47fb-af81-75e0a13f6804" http://localhost:8080/aktin/admin/users
 * </pre>
 * @author R.W.Majeed
 *
 */
@Path("users")
public class UserEndpoint {
	@Context 
	private SecurityContext security;
	@Inject
	private Preferences prefs;

	private Li2b2Client initializeLi2b2Client() throws IOException{
		I2b2Authentication auth = (I2b2Authentication)security.getUserPrincipal();
		Li2b2Client li2b2 = new Li2b2Client();
		li2b2.setPM(new URL(prefs.get(PreferenceKey.i2b2ServicePM)));
		li2b2.setAuthorisation(auth.getCredentials());
		return li2b2;
	}

	@Secured
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public User[] listUsers() throws IOException, HiveException{
		return initializeLi2b2Client().PM().getUsers();
	}

	@Secured
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public void addUser(User user) throws HiveException, IOException{
		initializeLi2b2Client().PM().setUser(user);
	}

	@Secured
	@DELETE
	@Path("{name}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@PathParam("name") String name) throws HiveException, IOException{
		try{
			initializeLi2b2Client().PM().deleteUser(name);
			return Response.ok().build();
		}catch( ErrorResponseException e ){
			return Response.status(Status.NOT_FOUND).build();
		}
	}
	@Secured
	@GET
	@Path("roles")
	@Produces(MediaType.APPLICATION_JSON)
	public Role[] listRoles() throws IOException, HiveException{
		Li2b2Client client = initializeLi2b2Client();
		return client.PM().getRoles(client.getProjectId());
	}


}
