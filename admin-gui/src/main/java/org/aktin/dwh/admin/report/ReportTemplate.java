package org.aktin.dwh.admin.report;

import org.aktin.report.Report;

class ReportTemplate {
	public String id;
	public String description;
	public String version;

	public ReportTemplate(Report report){
		this.id = report.getId(); 
		this.description = report.getDescription();
		this.version = "1.3";
	}
}
