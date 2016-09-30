package org.aktin.dwh.node;

import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerService;
import javax.inject.Inject;

/**
 * Schedule connections to brokers.
 * 
 * @author R.W.Majeed
 *
 */
@Singleton
@Startup
public class BrokerSchedule {

	@Inject
	private BrokerManager node;

	@Inject
	private TimerService timer;

	// TODO Map<Timer,Broker>
	
	@Timeout
	protected void scheduleTimeout(Timer timer){
		// TODO get Broker, fetch queries, submit status, send notifications
	}
}
