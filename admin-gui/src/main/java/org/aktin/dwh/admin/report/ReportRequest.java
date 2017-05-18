package org.aktin.dwh.admin.report;

import java.util.Date;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class ReportRequest {
	// parameters configurable from outside (e.g. client via REST)
	public Date start;
	public Date end;
}
