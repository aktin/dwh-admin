package org.aktin.dwh.admin.report;

import java.sql.Date;
import java.time.Instant;

import org.aktin.report.ArchivedReport;
import org.aktin.report.ArchivedReport.Status;

public class ReportEntry {
	int id;
	Date data;
	Date start;
	Date end;
	String template;
	Status status;

	private ReportEntry(){
	}
	static ReportEntry fill(ArchivedReport report){
		ReportEntry e = new ReportEntry();
		e.id = report.getId();
		e.data = convertInstant(report.getDataTimestamp());
		e.start = convertInstant(report.getStartTimestamp());
		e.end = convertInstant(report.getEndTimestamp());
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
