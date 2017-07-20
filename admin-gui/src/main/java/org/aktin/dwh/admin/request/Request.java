package org.aktin.dwh.admin.request;

import org.aktin.broker.query.xml.QueryRequest;
import org.aktin.broker.request.Marker;
import org.aktin.broker.request.RequestStatus;
import org.aktin.broker.request.RetrievedRequest;

public class Request {

	public int requestId;
	public Integer queryId;
	public Marker marker;
	public RequestStatus status;
	public boolean autoSubmit;
	public QueryRequest query;

	Request(RetrievedRequest r){
		this.requestId = r.getRequestId();
		this.queryId = r.getQueryId();
		this.marker = r.getMarker();
		this.query = r.getRequest();
		this.status = r.getStatus();
		this.autoSubmit = r.hasAutoSubmit();
		
	}
}
