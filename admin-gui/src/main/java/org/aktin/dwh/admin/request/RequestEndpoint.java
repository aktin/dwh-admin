package org.aktin.dwh.admin.request;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

import org.aktin.broker.request.RequestManager;
import org.aktin.broker.request.RequestStatus;
import org.aktin.broker.request.RetrievedRequest;
import org.aktin.dwh.admin.auth.Secured;

@Path("request")
public class RequestEndpoint {
	@Inject
	RequestManager manager;
	@Context 
	private SecurityContext security;

	/**
	 * List generated reports
	 * @return generated reports
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Request> getRequests(){
		// TODO allow ordering via query param
		List<Request> list = new ArrayList<>();
		// TODO optionally filter
		manager.forEachRequest( request -> {
			list.add(wrap(request));
		});

		return list;
	}

	private Request wrap(RetrievedRequest request){
		return new Request(request);
	}
	
	@GET
	@Path("{id}")
	public Request getRequest(@PathParam("id") int id) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		return wrap(req);
	}

	@Secured
	@POST
	@Path("{id}/autoSubmit/{value}")
	public void setAutoSubmit(@PathParam("id") int id, @PathParam("value") boolean autoSubmit) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		req.setAutoSubmit(true);
	}
	@Secured
	@POST
	@Path("{id}/status/{value}")
	public void changeStatus(@PathParam("id") int id, @PathParam("value") RequestStatus newStatus) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		String userId = security.getUserPrincipal().getName();
		req.changeStatus(userId, newStatus, null);
	}

}
