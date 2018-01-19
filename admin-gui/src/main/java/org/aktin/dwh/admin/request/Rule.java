package org.aktin.dwh.admin.request;

import org.aktin.broker.request.BrokerQueryRule;
import org.aktin.broker.request.QueryRuleAction;

public class Rule {
	public String user;
	public QueryRuleAction action;

	public static Rule wrap(BrokerQueryRule rule){
		Rule r = new Rule();
		r.action = rule.getAction();
		r.user = rule.getUserId();
		return r;
	}
}
