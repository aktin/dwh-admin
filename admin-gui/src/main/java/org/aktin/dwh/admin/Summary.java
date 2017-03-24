package org.aktin.dwh.admin;

import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.aktin.dwh.ImportSummary;

@Path("import-summary")
public class Summary {
	@Inject
	private org.aktin.dwh.ImportSummary summ;

	@GET
	@Produces(MediaType.APPLICATION_XML)
	public ImportSummary getSummaryXML(){
		return summ;
	}
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public ImportSummary getSummaryJSON(){
		return summ;
	}
	@DELETE
	public void reset(){
		summ.reset();
		
	}
}
