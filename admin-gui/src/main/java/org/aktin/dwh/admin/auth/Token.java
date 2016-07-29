package org.aktin.dwh.admin.auth;

import org.aktin.dwh.Authentication;

public class Token {
	private Authentication payload;
	//private TokenManager manager;
	long issued;
	long renewed;
	
	Token(TokenManager manager, Authentication payload){
		this.payload = payload;
		this.issued = System.currentTimeMillis();
		this.renewed = this.issued;
	}
	
	public void renew(){
		this.renewed = System.currentTimeMillis();
	}
	
	public Authentication getPayload(){
		return this.payload;
	}
	public void invalidate(){
		// next check for valid token will fail
		this.renewed = 0;
	}
}
