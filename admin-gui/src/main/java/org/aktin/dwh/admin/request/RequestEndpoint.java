package org.aktin.dwh.admin.request;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.aktin.broker.request.RequestManager;
import org.aktin.broker.request.RetrievedRequest;

@Path("request")
public class RequestEndpoint {
	@Inject
	RequestManager manager;
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

	
}
