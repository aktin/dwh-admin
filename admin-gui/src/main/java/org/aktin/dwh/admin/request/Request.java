package org.aktin.dwh.admin.request;

import java.io.IOException;

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
	public String result;

	Request(RetrievedRequest r){
		this.requestId = r.getRequestId();
		this.queryId = r.getRequest().getQueryId();
		this.marker = r.getMarker();
		this.query = r.getRequest();
		this.status = r.getStatus();
		this.autoSubmit = r.hasAutoSubmit();

		try {
			if( r.getResultData() != null ){
				this.result = r.getResultData().getContentType();
			}else{
				this.result = null;
			}
		} catch (IOException e) {
			// unable to get result data
			// usually should not happen, since RequestImpl does not throw one
			this.result = null;
		}
	}
}
