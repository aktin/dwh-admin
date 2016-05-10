package org.aktin.dwh.admin;

import java.security.Principal;

import javax.inject.Singleton;

import org.aktin.dwh.Authenticator;

@Singleton
public class MockAuthenticator implements Authenticator{

	@Override
	public Principal authenticate(String user, char[] password) {
		// TODO Auto-generated method stub
		return new Principal() {
			
			@Override
			public String getName() {
				return user;
			}
		};
	}

	@Override
	public boolean isUserInRole(Principal user, String role) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isUserAdmin(Principal user) {
		// TODO Auto-generated method stub
		return user.getName().equals("admin");
	}


}
