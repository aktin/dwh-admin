package org.aktin.dwh.admin.request;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.aktin.broker.request.RequestManager;
import org.aktin.broker.request.RequestStatus;
import org.aktin.broker.request.BrokerQueryRule;
import org.aktin.broker.request.QueryRuleAction;
import org.aktin.broker.request.RetrievedRequest;
import org.aktin.dwh.admin.auth.Secured;

/**
 * RESTful HTTP end point for receiving and deleting query rules.
 * 
 */
@Path("query")
public class QueryEndpoint {
	private static final Logger log = Logger.getLogger(QueryEndpoint.class.getName());
	@Inject
	RequestManager manager;
	@Context 
	private SecurityContext security;
	
	/**
	 * GET request to retrieve the queryBundle resource (contains the query rule and a list of all requests that belong 
	 * to the query) which can be addressed by the given path.
	 * @param id queryId
	 * @return response with queryBundle of the given queryId if the lastActionTimestamp on the 
	 * 		   client differs from the one on the server, otherwise response with status 304 (Not Modified).
	 * @throws IOException
	 */
	@GET
	@Path("{id}")
	public Response getQueryBundle(@PathParam("id") int id, @Context javax.ws.rs.core.Request request) throws IOException {
		List<RetrievedRequest> rs = new ArrayList<>();
		long maxTimestamp = 0L;
		long ruleTimestamp = 0L;
		try( Stream<? extends RetrievedRequest> req = manager.getQueryRequests(id) ) {
			for(Iterator<? extends RetrievedRequest> iterator = req.iterator(); iterator.hasNext();) {
				RetrievedRequest currReq = iterator.next();
				rs.add(currReq);
				if(currReq.getLastActionTimestamp() > maxTimestamp) {
					maxTimestamp = currReq.getLastActionTimestamp();
				}
			}
		}
		if( rs.isEmpty() ){
			throw new NotFoundException();
		}
		// add rule if available
		QueryBundle qb = new QueryBundle();
		BrokerQueryRule rule = manager.getQueryRule(id);
		if( rule != null ) {
			ruleTimestamp = rule.getTimestamp().toEpochMilli();
			qb.rule = Rule.wrap(rule);
		}
		qb.requests = rs.stream().map(req -> new Request(req)).collect(Collectors.toList());
		// sort by date XXX or already sorted???
		EntityTag etag = new EntityTag(Long.toString(maxTimestamp) + "-" + Long.toString(ruleTimestamp));
		ResponseBuilder b = request.evaluatePreconditions(etag);
		if (b != null) {
			return b.build();
		}
		return Response.ok(qb)
					   .tag(etag)
					   .header("Access-Control-Expose-Headers", "ETag")
					   .build();
	}
	
	
	/**
	 * POST request to apply the given rule action to all requests that are already present and belong to the query.
	 * Only requests with a changeable status (interaction required for this or a following status, ignoring auto submit) will be affected.
	 * @param id queryId
	 * @param action rule action
	 */
	@POST
	@Secured
	@Path("{id}/applyRule")
	@Produces(MediaType.APPLICATION_JSON)
	public void applyRule(@PathParam("id") int id, QueryRuleAction action) throws IOException {
		List<RetrievedRequest> rs = new ArrayList<>();
		try( Stream<? extends RetrievedRequest> req = manager.getQueryRequests(id) ){
			req.forEach(rs::add);
		}
		for( RetrievedRequest req : rs ) {
			switch( req.getStatus() ) {
			case Rejected:
			case Submitted:
			case Failed:
			case Sending:
				continue;
			case Retrieved:
			case Seen:
			case Queued:
			case Processing:
			case Completed:
				if( action == QueryRuleAction.REJECT ) {
					try {
						req.changeStatus(security.getUserPrincipal().getName(), RequestStatus.Rejected, "Automatic reject by query rule");
					} catch (IOException e) {
						log.log(Level.SEVERE, "Unable to apply reject rule to request " + req.getRequestId(), e);
					}
				} else {
					if( action == QueryRuleAction.ACCEPT_SUBMIT ) {
						req.setAutoSubmit(true);
					} else if( action == QueryRuleAction.ACCEPT_EXECUTE ) {
						req.setAutoSubmit(false);
					}
					if (req.getStatus() == RequestStatus.Retrieved || req.getStatus() == RequestStatus.Seen) {
						try {
							req.changeStatus(security.getUserPrincipal().getName(), RequestStatus.Queued, "Automatic accept by query rule");
						} catch (IOException e) {
							log.log(Level.SEVERE, "Unable to apply accept rule to request " + req.getRequestId(), e);
						}
					} else if(req.getStatus() == RequestStatus.Completed && req.hasAutoSubmit()) {
						try {
							req.changeStatus(security.getUserPrincipal().getName(), RequestStatus.Sending, "Automatic submitted by query rule");
						} catch (IOException e) {
							log.log(Level.SEVERE, "Unable to submit request " + req.getRequestId(), e);
						}
					}
				} 
				break;
			default: throw new AssertionError();
			}
		}
	}

	/**
	 * GET request to retrieve the rule of a specific query which contains the rule action and the creator of the rule.
	 * @param id queryId
	 * @return rule object
	 */
	@GET
	@Path("{id}/rule")
	public Rule getRule(@PathParam("id") int id){
		BrokerQueryRule rule = manager.getQueryRule(id);
		if( rule == null ){
			throw new NotFoundException();
		}
		return Rule.wrap(rule);
	}
	/**
	 * DELETE request to delete the rule of the query which is specified by the given id.
	 * @param id queryId
	 * @throws IOException
	 */
	@Secured
	@DELETE
	@Path("{id}/rule")
	public void deleteRule(@PathParam("id") int id) throws IOException {
		BrokerQueryRule rule = manager.getQueryRule(id);
		if( rule == null ){
			throw new NotFoundException();
		}
		manager.deleteQueryRule(id);
		try (Stream<? extends RetrievedRequest> req = manager.getQueryRequests(id)) {
			for(Iterator<? extends RetrievedRequest> requests = req.iterator(); requests.hasNext();) {
				requests.next().setAutoSubmit(false);
			}
		}
	}


}
