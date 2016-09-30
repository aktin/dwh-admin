package org.aktin.dwh.node;

import java.net.URI;

import javax.ejb.Singleton;
import javax.sql.DataSource;

@Singleton
public class BrokerManager {

	private DataSource ds;

	// TODO resource/inject annotation for ds
	public BrokerManager(DataSource ds){
		this.ds = ds;
		// TODO load broker into cache from ds
	}

	public void fetchRequests(){
		
	}
	public Broker getBroker(String id){
		// TODO get broker from cache
		return null;
	}

	public Broker addBroker(String id, URI brokerURI){
		// TODO implement, insert to database
		return null;
	}
}
