package org.aktin.dwh.admin.importer;


import java.sql.SQLException;
import java.util.List;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.generic.imports.manager.P21ImportStats;
import org.aktin.generic.imports.manager.P21StatsQueryManagerService;

@Path("p21")
public class P21StatsQueryEndpoint {

  @Inject
  private P21StatsQueryManagerService manager;

  @Context
  private SecurityContext security;

  public P21StatsQueryEndpoint() {

  }

  @Secured
  @GET
  @Path("p21/stats")
  @Produces(MediaType.APPLICATION_JSON)
  public List<P21ImportStats> getTest() throws SQLException {
    return manager.fetchAllP21Stats();
  }
}
