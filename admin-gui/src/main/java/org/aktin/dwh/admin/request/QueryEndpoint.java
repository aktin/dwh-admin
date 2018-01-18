package org.aktin.dwh.admin.request;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

import org.aktin.broker.request.RequestManager;
import org.aktin.broker.request.BrokerQueryRule;
import org.aktin.broker.request.RetrievedRequest;
import org.aktin.dwh.admin.auth.Secured;

@Path("query")
public class QueryEndpoint {
	@Inject
	RequestManager manager;
	@Context 
	private SecurityContext security;
	
	@GET
	@Path("{id}")
	public QueryBundle getQueryBundle(@PathParam("id") int id) throws IOException{
		List<RetrievedRequest> rs = new ArrayList<>();
		try( Stream<? extends RetrievedRequest> req = manager.getQueryRequests(id) ){
			req.forEach(rs::add);
		}
		if( rs.isEmpty() ){
			throw new NotFoundException();
		}
		// add rule if available
		QueryBundle qb = new QueryBundle();
		BrokerQueryRule rule = manager.getQueryRule(id);
		if( rule != null ){
			qb.rule = Rule.wrap(rule);
		}
		// sort by date XXX or already sorted???
		return qb;
	}


	@GET
	@Path("{id}/rule")
	public Rule getRule(@PathParam("id") int id){
		BrokerQueryRule rule = manager.getQueryRule(id);
		if( rule == null ){
			throw new NotFoundException();
		}
		return Rule.wrap(rule);
	}
	@Secured
	@DELETE
	@Path("{id}/rule")
	public void deleteRule(@PathParam("id") int id) throws IOException{
		BrokerQueryRule rule = manager.getQueryRule(id);
		if( rule == null ){
			throw new NotFoundException();
		}
		manager.deleteQueryRule(id);
	}


}
