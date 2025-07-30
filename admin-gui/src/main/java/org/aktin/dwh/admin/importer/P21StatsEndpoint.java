package org.aktin.dwh.admin.importer;


import java.sql.SQLException;
import java.util.List;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import org.aktin.dwh.admin.auth.Secured;
import org.aktin.generic.imports.manager.P21ImportStats;
import org.aktin.generic.imports.manager.P21StatsQueryManagerService;

@Path("p21")
public class P21StatsEndpoint {

  @Inject
  private P21StatsQueryManagerService manager;

  @Context
  private SecurityContext security;

  /**
   * Retrieves P21 import statistics for each year and file type (e.g., FALL, FAB, OPS, ICD).
   *
   * @return HTTP response:
   *           - 200 OK — JSON array containing counts of encounters per year and file type
   *           - 404 Not Found — if no statistics are available
   *
   * @throws SQLException if a database access error occurs
   */
  //@Secured
  @GET
  @Path("stats")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getStats() throws SQLException {
    List<P21ImportStats> stats = manager.fetchAllP21Stats();
    return Response.ok(stats).build();
  }
}
