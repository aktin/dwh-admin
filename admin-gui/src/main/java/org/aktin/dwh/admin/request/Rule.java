package org.aktin.dwh.admin.request;

import org.aktin.broker.request.BrokerQueryRule;
import org.aktin.broker.request.QueryRuleAction;

public class Rule {
	public String user;
	public QueryRuleAction action;
	// TODO: creationDate as Instant -> receiving nano and epocheSeconds on client instead date in ISO format
	public String creationDate;

	public static Rule wrap(BrokerQueryRule rule){
		Rule r = new Rule();
		r.action = rule.getAction();
		r.user = rule.getUserId();
		r.creationDate = rule.getTimestamp().toString();
		return r;
	}
}
