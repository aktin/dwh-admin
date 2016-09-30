package org.aktin.dwh.admin.log;

import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.NamingException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.dwh.db.Manager;

/**
 * RESTful endpoint for log management. Show logfile with optional filtering.
 * Allow downloading logfile as Zip.
 * 
 * @author R.W.Majeed
 *
 */
@Path("log")
public class LogEndpoint {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	Response get(){
		return Response.ok("TODO").build();
	}
	
	@GET
	@Path("test")
	@Produces(MediaType.TEXT_PLAIN)
	public Response test(){
		String ret = "OK";
		try{
			Connection dbc = Manager.openConnection();
			dbc.close();
		}catch( NamingException e ){
			e.printStackTrace();
			ret = e.toString();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			ret = e.toString();
		}
		return Response.ok(ret).build();
	}
}
