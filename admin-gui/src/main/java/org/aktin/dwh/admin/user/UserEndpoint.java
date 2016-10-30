package org.aktin.dwh.admin.user;

import java.io.IOException;
import java.net.URL;

import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
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

import de.sekmi.li2b2.client.FormattedMessageLogger;
import de.sekmi.li2b2.client.Li2b2Client;
import de.sekmi.li2b2.client.pm.Role;
import de.sekmi.li2b2.client.pm.User;
import de.sekmi.li2b2.hive.ErrorResponseException;
import de.sekmi.li2b2.hive.HiveException;


/**
 * User administration endpoint. All methods require prior authentication with i2b2 credentials.
 * <p>
 * Command line testing (requires sh-type shell or git bash on windows):
 * <pre>
 * token=`curl -H "Content-Type: application/json" -s -X POST -d '{"username":"i2b2","password":"demouser"}' http://localhost:8080/aktin/admin/auth/login`
 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users
 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users/roles
 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users/demo/roles
 * curl -s -H "Authorization: Bearer $token" -X DELETE http://localhost:8080/aktin/admin/users/demo/roles/Bamboo
 * curl -s -H "Authorization: Bearer $token" -X PUT http://localhost:8080/aktin/admin/users/demo/roles/Super
 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users/demo/roles
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
		li2b2.setProjectId(prefs.get(PreferenceKey.i2b2Project));
		return li2b2;
	}

	/**
	 * Retrieve all i2b2 users
	 * @return user list
	 * @throws HiveException unexpected response by i2b2
	 * @throws IOException communications error with i2b2
	 */
	@Secured
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public User[] getUsers() throws IOException, HiveException{
		return initializeLi2b2Client().PM().getUsers();
	}


	/**
	 * Create or update the given user
	 * @param user
	 * @return response status
	 * @throws HiveException unexpected response by i2b2
	 * @throws IOException communications error with i2b2
	 */
	@Secured
	@POST
	@Path("{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createOrUpdateUser(@PathParam("user") String name, User data) throws HiveException, IOException{
		if( data.user_name != null && !data.user_name.equals(name) ){
			// if a user name is specified in the supplied data, it must match the path parameter user
			return Response.status(Status.BAD_REQUEST).build();
		}else{
			// user name not specified in data (which is OK, since already provided in path)
			// use name from path
			data.user_name = name;
		}
		initializeLi2b2Client().PM().setUser(data);
		// TODO we should return HTTP status created iif the user did not exist previously
		return Response.ok().build();
	}

	@Secured
	@DELETE
	@Path("{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@PathParam("user") String name) throws HiveException, IOException{
		try{
			initializeLi2b2Client().PM().deleteUser(name);
			return Response.noContent().build();
		}catch( ErrorResponseException e ){
			return Response.status(Status.NOT_FOUND).build();
		}
	}

	/**
	 * Retrieve all roles for all users.
	 *
	 * @return all roles
	 * @throws HiveException unexpected response by i2b2
	 * @throws IOException communications error with i2b2
	 */
	@Secured
	@GET
	@Path("roles")
	@Produces(MediaType.APPLICATION_JSON)
	public Role[] getRoles() throws IOException, HiveException{
		Li2b2Client client = initializeLi2b2Client();
		client.setMessageLog(FormattedMessageLogger.consoleLogger());
		Role[] roles = client.PM().getRoles(client.getProjectId());
		// clear project because it is irrelevant and redundant
		for( int i=0; i<roles.length; i++ ){
			roles[i].project_id = null;
		}
		return roles;
	}

	/**
	 * Delete the specified role for the given user.
	 * 
	 * @param user user name
	 * @param role role to delete
	 * @throws HiveException unexpected response by i2b2
	 * @throws IOException communications error with i2b2
	 */
	@Secured
	@DELETE
	@Path("{user}/roles/{role}")
	@Produces(MediaType.APPLICATION_JSON)
	public void deleteRole(@PathParam("user") String user, @PathParam("role") String role) throws HiveException, IOException{
		Li2b2Client client = initializeLi2b2Client();
		client.PM().deleteRole(user, role, client.getProjectId());
	}

	/**
	 * Set the specified role for the given user.
	 * 
	 * @param user user name
	 * @param role new role
	 * @throws HiveException unexpected response by i2b2
	 * @throws IOException communications error with i2b2
	 */
	@Secured
	@PUT
	@Path("{user}/roles/{role}")
	@Produces(MediaType.APPLICATION_JSON)
	public void setRole(@PathParam("user") String user, @PathParam("role") String role) throws HiveException, IOException{
		Li2b2Client client = initializeLi2b2Client();
		client.PM().setRole(user, role, client.getProjectId());
	}

	/**
	 * Retrieve roles for the given user. This method is not needed, because all roles for all users
	 * can be retrieved using {@link #getRoles()}.
	 * 
	 * @param user user name to retrieve roles for
	 * @return role names for the given user
	 * @throws HiveException unexpected response by i2b2
	 * @throws IOException communications error with i2b2
	 */
	@Secured
	@GET
	@Path("{user}/roles")
	@Produces(MediaType.APPLICATION_JSON)
	public String[] getRoles(@PathParam("user") String user) throws HiveException, IOException{
		Li2b2Client client = initializeLi2b2Client();
		return client.PM().getRoles(user, client.getProjectId());
	}

}
