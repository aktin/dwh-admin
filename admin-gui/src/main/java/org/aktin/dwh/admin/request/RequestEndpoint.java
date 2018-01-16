package org.aktin.dwh.admin.request;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.activation.DataSource;
import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.SecurityContext;

import org.aktin.broker.request.RequestManager;
import org.aktin.broker.request.RequestStatus;
import org.aktin.broker.request.Marker;
import org.aktin.broker.request.RetrievedRequest;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.dwh.admin.filter.NoCache;

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
	@NoCache
	@Produces(MediaType.APPLICATION_JSON)
	public List<Request> getRequests(){
		// TODO allow ordering via query param
		List<Request> list = new ArrayList<>();
		// TODO optionally filter
		manager.requests().forEach( request -> {
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
	@GET
	@Path("{id}/result")
	public Response getRequestResult(@PathParam("id") int id) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		DataSource data = req.getResultData();
		if( data == null ){
			throw new NotFoundException();
		}
		ResponseBuilder b = Response.ok(data.getInputStream(), data.getContentType());
		// attachment name
		b.header("Content-Disposition", "inline; filename=\""+data.getName()+"\"");
		return b.build();
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

	@Secured
	@POST
	@Path("{id}/marker/{value}")
	public void changeMarker(@PathParam("id") int id, @PathParam("value") Marker mark) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		//TODO  how to remove marker?
		req.setMarker(mark);
	}

	@Secured
	@PUT
	@Path("{id}/marker")
	@Consumes({MediaType.APPLICATION_JSON,MediaType.APPLICATION_XML})
	public void updateMarker(@PathParam("id") int id, Marker mark) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		req.setMarker(mark);
	}
	@Secured
	@DELETE
	@Path("{id}/marker")
	public Response deleteMarker(@PathParam("id") int id) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		req.setMarker(null);
		return Response.noContent().build();
	}


}
