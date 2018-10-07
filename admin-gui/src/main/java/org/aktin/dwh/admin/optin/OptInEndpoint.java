package org.aktin.dwh.admin.optin;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

import org.aktin.dwh.optinout.Study;
import org.aktin.dwh.optinout.StudyManager;

@Path("optin")
public class OptInEndpoint {
	@Inject
	private StudyManager sm;

	@Path("test")
	@GET
	String testFunction() throws IOException {
		StringBuilder b = new StringBuilder();
		List<? extends Study> l = sm.getStudies();
		for( Study s : l ) {
			b.append(s.getId());
			b.append(' ');
		}
		return b.toString();
	}

}
