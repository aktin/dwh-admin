package org.aktin.dwh.admin;

import org.aktin.dwh.Authentication;

public class I2b2Authentication implements Authentication{

	private String userId;
	private String sessionKey;
	private String[] roles;
	private boolean isAdmin;

	public I2b2Authentication(String user, String session, String[] roles, boolean isAdmin) {
		this.userId = user;
		this.sessionKey = session;
		this.roles = roles;
		this.isAdmin = isAdmin;
	}
	@Override
	public String getName() {
		return userId;
	}

	@Override
	public boolean hasRole(String role) {
		for( String r : roles ){
			if( r.equals(role) ){
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean isAdmin() {
		return isAdmin;
	}

	public String getSessionKey(){
		return sessionKey;
	}

}
