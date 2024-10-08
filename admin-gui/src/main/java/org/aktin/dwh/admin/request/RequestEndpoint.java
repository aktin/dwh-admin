package org.aktin.dwh.admin.request;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import javax.activation.DataSource;
import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.SecurityContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.aktin.broker.request.RequestManager;
import org.aktin.broker.request.RequestStatus;
import org.aktin.broker.request.Marker;
import org.aktin.broker.request.QueryRuleAction;
import org.aktin.broker.request.RetrievedRequest;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.dwh.admin.filter.NoCache;


/**
 * RESTful HTTP end point for receiving, updating and deleting requests and their attributes.
 * 
 */
@Path("request")
public class RequestEndpoint {
	private static final Logger log = Logger.getLogger(RequestEndpoint.class.getName());
	private static final ObjectMapper mapper = new ObjectMapper();

	@Inject
	RequestManager manager;
	@Context 
	private SecurityContext security;

	
	/**
	 * GET request to receive all requests.
	 * @return response with a list of all requests if the lastActionTimestamp on the client differs from the one on the server, 
	 * 		   otherwise response with status 304 (Not Modified).
	 */
	@GET
	@NoCache
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRequests(@Context javax.ws.rs.core.Request request) {
		// TODO allow ordering via query param
		List<Request> list = new ArrayList<>();
		long maxTimestamp = 0L;
		// TODO optionally filter
		for(Iterator<? extends RetrievedRequest> iterator = manager.requests().iterator(); iterator.hasNext();) {
			RetrievedRequest req = iterator.next();
			long reqTimestamp = req.getLastActionTimestamp();
			if(maxTimestamp < reqTimestamp) {
				maxTimestamp = reqTimestamp;
			}
			list.add(wrap(req));
		}
		EntityTag etag = new EntityTag(Long.toString(maxTimestamp));
		ResponseBuilder b = request.evaluatePreconditions(etag);
		if (b != null) {
			return b.build();
		}
		return Response.ok(list)
					   .tag(etag)
					   .header("Access-Control-Expose-Headers", "ETag")
					   .build();
	}

	private Request wrap(RetrievedRequest request){
		return new Request(request);
	}
	
	/**
	 * GET request to receive the request of the given id.
	 * @param id requestId
	 * @return response with the request object if the lastActionTimestamp on the client differs from the one on the server, 
	 * 		   otherwise response with status 304 (Not Modified).pl
	 * @throws IOException
	 */
	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRequest(@PathParam("id") int id, @Context javax.ws.rs.core.Request request) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		EntityTag etag = new EntityTag(Long.toString(req.getLastActionTimestamp()));
		ResponseBuilder b = request.evaluatePreconditions(etag);
		if (b != null) {
			return b.build();
		}
		return Response.ok(mapper.writeValueAsString(wrap(req)))
				.tag(etag)
				.header("Access-Control-Expose-Headers", "ETag")
				.build();
	}

	/**
	 * GET request to receive unmapped request of given id
	 * @param id
	 * @param request
	 * @return
	 * @throws IOException
	 */
	@GET
	@Path("{id}/unmapped")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUnmappedRequest(@PathParam("id") int id, @Context javax.ws.rs.core.Request request) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		EntityTag etag = new EntityTag(Long.toString(req.getLastActionTimestamp()));
		ResponseBuilder b = request.evaluatePreconditions(etag);
		if (b != null) {
			return b.build();
		}
		return Response.ok(wrap(req))
				.tag(etag)
				.header("Access-Control-Expose-Headers", "ETag")
				.build();
	}

	/**
	 * GET request to receive the result file of the specified request.
	 * @param id requestId
	 * @return Response containing the result file
	 * @throws IOException
	 */
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
		return Response.ok(data.getInputStream(), data.getContentType())
				.header("Content-Disposition", "inline; filename=\""+data.getName()+"\"")
				.build();
	}

	/**
	 * POST request to set the value of the autoSubmit attribute of the specifies request. 
	 * If autoSubmit is set to true the result of the request is send to server without asking for permission.
	 * @param id requestId
	 * @param autoSubmit
	 * @throws IOException
	 */
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
	/**
	 * POST request to set the status of the specifies request to the given value.
	 * @param id requestId
	 * @param newStatus of the request
	 * @throws IOException
	 */
	@Secured
	@POST
	@Path("{id}/status/{value}")
	public void changeStatus(@PathParam("id") int id, @PathParam("value") RequestStatus newStatus) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		String userId = security.getUserPrincipal().getName();
		log.info("query "+id+" changeStatus (by "+userId+") -> "+newStatus);
		// check to prevent accidental re-execution of finished query
		if( newStatus == RequestStatus.Queued ){
			switch( req.getStatus() ){
			case Completed:
			case Failed:
			case Submitted:
			case Sending:
				log.warning("Illegal try to change status back to queued rejected");
				throw new ClientErrorException("Re-queuing finished request rejected", 409);
			default:
				// change permitted, go on
				break;
			}
		}
		req.changeStatus(userId, newStatus, null);
	}

	/**
	 * POST request to set the marker of a request.
	 * The marker determines if the request is visible in the user interface or if it's marked as deleted.
	 * @param id requestId
	 * @param mark value of enum Mark
	 * @throws IOException
	 */
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

	/**
	 * PUT request to change an already existing marker of a request.
	 * @param id requestId
	 * @param mark value of enum Mark
	 * @throws IOException
	 */
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
	/**
	 * DELETE request to delete a marker of a request.
	 * @param id requestId
	 * @return empty Response
	 * @throws IOException
	 */
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


	/**
	 * Create a query rule for this request.
	 * Does only work, if there is no previous rule.
	 * To retrieve a rule, use {@link QueryEndpoint#getRule(int)}.
	 * @param id request id
	 * @param action action
	 * @return response status created
	 * @throws IOException NotFoundException or {@link ClientErrorException}(422)
	 */
	@Secured
	@POST
	@Path("{id}/rule/{action}")
	public Response createQueryRule(@PathParam("id") int id, @PathParam("action") QueryRuleAction action) throws IOException{
		RetrievedRequest req = manager.getRequest(id);
		if( req == null ){
			throw new NotFoundException();
		}
		Integer queryId = req.getRequest().getQueryId();
		if( queryId == null ){
			// rules only allowed for identifyable queries (e.g. repeating)
			throw new ClientErrorException(422);
		}
		manager.createQueryRule(req, security.getUserPrincipal().getName(), action);
		return Response.created(URI.create("../../../query/"+queryId+"/rule")).build();
	}


}
