package org.aktin.dwh.admin.auth;

import java.security.Principal;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import org.aktin.dwh.Authentication;
import org.aktin.dwh.Authenticator;

/**
 * RESTful authentication endpoint. Log on/off users
 * via application/json calls
 * 
 * Example usage:
 * <pre>
 *   curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"xyz"}' http://localhost:8080/aktin/admin/auth/login
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
	
	@POST
	@Path("login")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response authenticateUser(Credentials cred){
		if( authenticator == null ){
			// no authenticator available
			// reject all users
			log.severe("No Authenticator available from CDI; rejecting all users");
			return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
		}
		// TODO allow access for other users
		Authentication p = authenticator.authenticate(cred.username, cred.password.toCharArray());
		if( p != null && p.isAdmin() ){
			// generate token
			String uid = tokens.registerToken(p);
			return Response.ok(uid).build();
		}else{
			// access denied
			return Response.status(Response.Status.UNAUTHORIZED).build();
		}
	}
	
	@POST
	@Path("logout")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.TEXT_PLAIN)
	public Response logout(String token){
		// TODO invalidate token
		return Response.ok().build();
	}
	
	@GET
	@Path("test")
	public String test(@Context SecurityContext sec){
		return "Security:"+sec.getUserPrincipal();
	}
}
