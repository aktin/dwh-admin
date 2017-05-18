package org.aktin.dwh.admin.report;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Iterator;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.aktin.Preferences;
import org.aktin.dwh.EMail;
import org.aktin.dwh.PreferenceKey;
import org.aktin.report.ArchivedReport;
import org.aktin.report.Report;
import org.aktin.report.ReportArchive;
import org.aktin.report.ReportInfo;
import org.aktin.report.ReportManager;

@Path("report/monthly")
public class MonthlyReportEndpoint {
	private static final Logger log = Logger.getLogger(MonthlyReportEndpoint.class.getName());
	private static final String MONTHLY_REPORT_TEMPLATE_ID="org.aktin.report.aktin.AktinMonthly";
	@Inject
	private ReportArchive archive;

	@Inject
	private ReportManager manager;

	@Inject
	private Preferences prefs;

	@Inject @EMail Event<ReportInfo> sendReport;
	

	private ReportInfo createReportInfo(){
		ZoneId zone = ZoneId.of(prefs.get(PreferenceKey.timeZoneId));
		// calculate timestamps for previous month
		// get current local date
		LocalDate today = Instant.now().atZone(zone).toLocalDate();
		// start on first day of month
		LocalDateTime start = today.minusMonths(1).withDayOfMonth(1).atStartOfDay();
		// end with start of first day in current month
		LocalDateTime end = today.withDayOfMonth(1).atStartOfDay();

		Report template = manager.getReport(MONTHLY_REPORT_TEMPLATE_ID);
		Objects.requireNonNull(template, "Monthly report template not available: "+MONTHLY_REPORT_TEMPLATE_ID);
		return template.createReportInfo(start.atZone(zone).toInstant(), end.atZone(zone).toInstant());
	}
	/**
	 * Create/overwrite a new monthly report (for the previous month)
	 */
	private ArchivedReport createReport(String userId, Consumer<ArchivedReport> afterCompletion) throws IOException{
		ReportInfo info = createReportInfo();
		// create in archive
		ArchivedReport report = archive.addReport(info, userId);
		// generate report
		try {
			CompletableFuture<Void> future = report.createAsync(manager);
			if( afterCompletion != null ){
				future.thenRun( () -> afterCompletion.accept(report));
			}
		} catch (IOException e) {
			log.log(Level.WARNING, "Report creation failed, exception stored for "+report.getId(), e);
			archive.setReportFailure(report.getId(), null, e);
		}
		return report;
	}

	@POST
	@Path("email")
	public Response sendReportViaEmail(){
		sendReport.fire(createReportInfo());
		return Response.accepted().build();
	}
	/**
	 * Locate the current monthly report (previous month) or create
	 * the report if it was generated available previously
	 * @return response
	 */
	@GET
	public Response getCurrentReport(){
		Iterator<? extends ArchivedReport> prev = archive.reports().iterator();
		ZoneId zone = ZoneId.of(prefs.get(PreferenceKey.timeZoneId));
		ZonedDateTime startOfCurrentMonth = ZonedDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
		ArchivedReport current = null;
		while( prev.hasNext() ){
			ArchivedReport r = prev.next();
			if( r.getDataTimestamp() == null ){
				// not yet finished, may be our candidate if it is the monthly report
				if( r.getTemplateId().equals(MONTHLY_REPORT_TEMPLATE_ID) && r.getEndTimestamp().equals(startOfCurrentMonth.toInstant()) ){
					current = r;
					break;
				}
				continue;
			}else if( r.getDataTimestamp().atZone(zone).isBefore(startOfCurrentMonth) ){
				// report was created in the previous month
				break;
			}else if( !r.getTemplateId().equals(MONTHLY_REPORT_TEMPLATE_ID) ){
				continue;
			}else{
				// this is our candidate
				current = r;
				break;
			}
		}
		if( current == null ){
			// create report
			// TODO determine authenticated user
			String userId = "TODO:authuser";
			try {
				current = createReport(userId, null);
			} catch (IOException e) {
				log.log(Level.SEVERE, "Report failed", e);
				return Response.serverError().build();
			}
		}
		return Response.temporaryRedirect(ReportArchiveEndpoint.buildReportURI(current)).build();
	}


}
