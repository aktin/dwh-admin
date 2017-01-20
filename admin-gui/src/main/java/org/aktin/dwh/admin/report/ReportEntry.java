package org.aktin.dwh.admin.report;

import java.sql.Date;
import java.time.Instant;

import org.aktin.report.ArchivedReport;
import org.aktin.report.ArchivedReport.Status;

public class ReportEntry {
	public int id;
	public Date data;
	public Date start;
	public Date end;
	public String template;
	public String type;
	public Status status;

	private ReportEntry(){
	}
	static ReportEntry fill(ArchivedReport report){
		ReportEntry e = new ReportEntry();
		e.id = report.getId();
		e.data = convertInstant(report.getDataTimestamp());
		e.start = convertInstant(report.getStartTimestamp());
		e.end = convertInstant(report.getEndTimestamp());
		e.template = report.getTemplateId();
		e.type = report.getMediaType();
		e.status = report.getStatus();
		return e;
	}
	private static Date convertInstant(Instant instant){
		if( instant != null ){
			return new Date(instant.toEpochMilli());
		}else{
			return null;
		}
	}
}
