package org.aktin.dwh.node;

import java.net.URI;

/**
 * 
 * @author Raphael
 *
 */
public class Broker {

	private BrokerManager manager;

	/**
	 * Get notification URIs. mailto URIs will receive a
	 * text email containing details about the new requests.
	 * 
	 * @return notification URIs
	 */
	public URI[] getNotificationURIs(){
		return null;
	}
	public void setNotificationURIs(URI[] uris){
		
	}
}
