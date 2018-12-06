package org.aktin.dwh.admin;

import java.util.ArrayList;
import java.util.List;

import org.aktin.dwh.Authentication;

import de.sekmi.li2b2.hive.Credentials;

/**
 * Implementation of data structure containing i2b2 authentication information for AKTIN
 * @author R.W.Majeed
 *
 */
public class I2b2Authentication implements Authentication{
	public static final String ROLE_ADMIN = "admin";
	public static final String ROLE_STUDYNURSE = "study_nurse";
	
	private String userId;
	private String sessionKey;
	private String domain;
	private String role;
	private boolean isAdmin;
	private final List<Permission> permissions;

	/**
	 * Construct instance of I2b2Authentication.
	 * @param user user name
	 * @param session i2b2 session
	 * @param domain i2b2 domain
	 * @param role AKTIN role
	 * @param isAdmin whether the user has i2b2 admin privileges
	 */
	public I2b2Authentication(String user, String session, String domain, String role, boolean isAdmin) {
		this.userId = user;
		this.sessionKey = session;
		this.role = role;
		this.isAdmin = isAdmin;
		this.domain = domain;
		
		permissions = new ArrayList<>();
		switch(role) {
			case ROLE_ADMIN:
				for (Permission perm : Permission.values()) {
					permissions.add(perm);
				}
				break;
			case ROLE_STUDYNURSE:
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
