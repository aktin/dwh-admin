package org.aktin.dwh.admin.auth;

import java.security.Principal;

public class Token {
	private Principal principal;
	//private TokenManager manager;
	long issued;
	long renewed;
	
	Token(TokenManager manager, Principal principal){
		this.principal = principal;
		this.issued = System.currentTimeMillis();
		this.renewed = this.issued;
	}
	
	public void renew(){
		this.renewed = System.currentTimeMillis();
	}
	
	public Principal getPrincipal(){
		return this.principal;
	}
}
