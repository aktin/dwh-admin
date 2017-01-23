package org.aktin.dwh.admin.report;

import org.aktin.report.Report;

class ReportTemplate {
	public String id;
	public String description;

	public String getVersion(){
		return "1.3";
	}
	public ReportTemplate(Report report){
		this.id = report.getId(); 
		this.description = report.getDescription();
	}
}
