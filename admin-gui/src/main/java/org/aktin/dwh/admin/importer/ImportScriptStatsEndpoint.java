package org.aktin.dwh.admin.importer;

import java.util.List;
import java.util.Map;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.aktin.generic.imports.manager.P21StatsSpec;
import org.aktin.generic.imports.manager.StatsQueryService;
import org.aktin.generic.imports.manager.StatsSpec;

/**
 * Endpoint for executing and retrieving statistics query results.
 * <p>
 * Supports different statistics specifications (e.g., P21) by injecting the corresponding {@link StatsSpec} implementation. Returns query results as a JSON array of generic key/value maps
 * (representing the result row as a map of column names to their values).
 */
@Path("/script/stats")
@Produces(MediaType.APPLICATION_JSON)
public class ImportScriptStatsEndpoint {

  @Inject
  private StatsQueryService statsService;

  @Inject
  private P21StatsSpec p21Spec;

  @GET
  @Path("p21")
  public Response p21() {
    return Response.ok(statsService.run(p21Spec)).build();
  }
}
