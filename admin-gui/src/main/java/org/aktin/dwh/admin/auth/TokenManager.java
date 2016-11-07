package org.aktin.dwh.admin.auth;

import javax.inject.Singleton;

import org.aktin.dwh.Authentication;

import de.sekmi.li2b2.services.token.AbstractTokenManager;

@Singleton
public class TokenManager extends AbstractTokenManager<Authentication>{

	@Override
	public Authentication createPrincipal(String name) {
		throw new UnsupportedOperationException();
	}
	
}
