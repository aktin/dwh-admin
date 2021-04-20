package org.aktin.dwh.admin.report;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.aktin.report.ArchivedReport;
import org.aktin.report.ReportArchive;
import org.aktin.report.ArchivedReport.Status;

@Path("report/archive")
public class ReportArchiveEndpoint {

    @Inject
    ReportArchive archive;

    /**
     * List generated reports
     *
     * @return generated reports
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ReportEntry> getGeneratedReports() {
        List<ReportEntry> list = new ArrayList<>();
        for (ArchivedReport report : archive.reports()) {
            list.add(ReportEntry.fill(report));
        }
        return list;
    }

    @HEAD
    @Path("{id}")
    public Response getReportMetadata(@PathParam("id") int id) throws IOException {
        ArchivedReport report = archive.get(id);
        if (report == null) {
            throw new NotFoundException();
        }
        if (report.getStatus() == Status.Waiting) {
            return Response.accepted().build();
        }
        Objects.requireNonNull(report.getLocation(), "Archived report without location:" + id);
        return Response.ok().type(report.getMediaType()).build();
    }

    @GET
    @Path("{id}")
    public Response getGeneratedReport(@PathParam("id") int id) throws IOException {
        ArchivedReport report = archive.get(id);
        if (report == null) {
            throw new NotFoundException();
        }
        if (report.getStatus() == Status.Waiting) {
            return Response.accepted().build();
        }
        Objects.requireNonNull(report.getLocation(), "Archived report without location:" + id);
        return Response.ok(Files.newInputStream(report.getLocation()), report.getMediaType()).build();
    }

    public static final URI buildReportURI(ArchivedReport report) {
        return URI.create("report/archive/" + report.getId());
    }

	@DELETE
	@Path("{id}")
	public Response deleteGeneratedReport(@PathParam("id") int id) throws IOException {
		try {
			archive.deleteReport(id);
		} catch (FileNotFoundException e) {
			throw new NotFoundException();
		}
		return Response.ok().build();
	}
}
