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
				// TODO Auto-generated method stub
				return true;
			}
			
			@Override
			public boolean hasRole(String role) {
				// TODO Auto-generated method stub
				if( role.equals("bamboo") ){
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
