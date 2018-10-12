package org.aktin.dwh.admin;

import org.aktin.dwh.Authentication;

import de.sekmi.li2b2.hive.Credentials;

public class I2b2Authentication implements Authentication{

	private String userId;
	private String sessionKey;
	private String domain;
	private String role;
	private boolean isAdmin;

	public I2b2Authentication(String user, String session, String domain, String role, boolean isAdmin) {
		this.userId = user;
		this.sessionKey = session;
		this.role = role;
		this.isAdmin = isAdmin;
		this.domain = domain;
	}
	@Override
	public String getName() {
		return userId;
	}

	@Override
	public String getRole() {
		return role;
	}
	
	// TODO: getRole

	@Override
	public boolean isAdmin() {
		return isAdmin;
	}

//	public String getSessionKey(){
//		return sessionKey;
//	}
//	public String getDomain(){
//		return domain;
//	}
	public Credentials getCredentials(){
		return new Credentials(domain, userId, sessionKey, true);
	}

}
