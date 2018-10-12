package org.aktin.dwh.admin.auth;

import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import org.aktin.dwh.Authentication;
import org.aktin.dwh.Authenticator;
import org.aktin.dwh.admin.I2b2Authentication;

import de.sekmi.li2b2.services.token.Token;

/**
 * RESTful authentication endpoint. Log on/off users
 * via application/json calls
 * 
 * Example usage:
 * <pre>
 curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"xyz"}' http://localhost:8080/aktin/admin/rest/auth/login
 
 </pre>
 * Send token header:
 * <pre>
 * curl -H "Authorization: Bearer fe4798-1d90-41d4-a228-21e891d2bb65" http://localhost:8080/aktin/admin/rest/auth/test
 * 

 * </pre>
 * @author R.W.Majeed
 *
 */
@Path("auth")
public class AuthEndpoint {
	private static final Logger log = Logger.getLogger(AuthEndpoint.class.getName());

	@Inject
	private Authenticator authenticator;
	@Inject 
	private TokenManager tokens;
	
	@Context 
	private SecurityContext security;

	@POST
	@Path("login")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public Response authenticateUser(Credentials cred){
		if( authenticator == null ){
			// no authenticator available
			// reject all users
			log.severe("No Authenticator available from CDI; rejecting all users");
			return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
		}
		// TODO allow access for other users
		Authentication p = authenticator.authenticate(cred.username, cred.password.toCharArray());
		if( p != null ){
			// generate token
			String uid = tokens.registerPrincipal(p);
			return Response.ok(uid).build();
		}else{
			// access denied
			return Response.status(Response.Status.UNAUTHORIZED).build();
		}
	}
	
	@POST
	@Secured
	@Path("logout")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.TEXT_PLAIN)
	public String logout(String token){
		Token<?> t = tokens.lookupToken(token);
		t.invalidate();
		return "{duration:"+(System.currentTimeMillis()-t.issuedTimeMillis())+"}";
	}
	
	@Secured
	@GET
	@Path("role")
	public String getRole(){
		I2b2Authentication auth = (I2b2Authentication)security.getUserPrincipal();
		return auth.getRole();
	}
	
	@Deprecated
	@Secured
	@GET
	@Path("has/{role}")
	public boolean hasRole(@PathParam("role") String role){
		I2b2Authentication auth = (I2b2Authentication)security.getUserPrincipal();
		if( role.equals("admin") ){
			return auth.isAdmin();
		}else{
			return role.equals(auth.getRole());
		}
	}

	@Secured
	@GET
	@Path("check")
	public boolean authCheck(){
		return true;
		// always true to check whether stored data is true
	}
	@Secured
	@Produces(MediaType.APPLICATION_JSON)
	@GET
	@Path("status")
	public AuthStatus getStatus(){
		// TODO use real auth status
		return new AuthStatus();
	}

}
