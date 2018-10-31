package org.aktin.dwh.admin;

import java.util.ArrayList;
import java.util.List;

import org.aktin.dwh.Authentication;

import de.sekmi.li2b2.hive.Credentials;

public class I2b2Authentication implements Authentication{

	private String userId;
	private String sessionKey;
	private String domain;
	private String role;
	private boolean isAdmin;
	private final List<Permission> permissions;

	public I2b2Authentication(String user, String session, String domain, String role, boolean isAdmin) {
		this.userId = user;
		this.sessionKey = session;
		this.role = role;
		this.isAdmin = isAdmin;
		this.domain = domain;
		
		permissions = new ArrayList<>();
		switch(role) {
			case "admin":
				for (Permission perm : Permission.values()) {
					permissions.add(perm);
				}
				break;
			case "study_nurse":
				permissions.add(Permission.READ_STUDYMANAGER);
				permissions.add(Permission.WRITE_STUDYMANAGER);
				break;
		}
	}
	@Override
	public String getName() {
		return userId;
	}

	@Override
	public String getRole() {
		return role;
	}

	@Override
	public boolean isAdmin() {
		return isAdmin;
	}
	
	public List<Permission> getPermissions() {
		return permissions;
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
