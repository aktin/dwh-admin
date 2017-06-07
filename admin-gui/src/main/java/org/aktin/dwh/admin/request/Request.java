package org.aktin.dwh.admin.request;

import org.aktin.broker.query.xml.QueryRequest;
import org.aktin.broker.request.Marker;
import org.aktin.broker.request.RetrievedRequest;

public class Request {

	public int requestId;
	public int queryId;
	public Marker marker;
	public QueryRequest query;

	Request(RetrievedRequest r){
		this.requestId = r.getRequestId();
		this.queryId = r.getQueryId();
		this.marker = r.getMarker();
		this.query = r.getRequest();
	}
}
