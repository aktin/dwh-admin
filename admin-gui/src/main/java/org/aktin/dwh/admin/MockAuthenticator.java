package org.aktin.dwh.admin;

import javax.inject.Singleton;

import org.aktin.dwh.Authentication;
import org.aktin.dwh.Authenticator;

@Singleton
public class MockAuthenticator implements Authenticator{

	@Override
	public Authentication authenticate(String user, char[] password) {
		// TODO Auto-generated method stub
		return new Authentication() {
			
			@Override
			public boolean isAdmin() {
				return user.equals("admin");
			}

			@Override
			public boolean hasRole(String role) {
				if( role.equals("aktin") ){
					return true;
				}else{
					return false;
				}
			}

			@Override
			public String getName() {
				return user;
			}
		};
	}


}
