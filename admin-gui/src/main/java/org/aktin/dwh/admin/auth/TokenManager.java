package org.aktin.dwh.admin.auth;

import java.security.Principal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import javax.inject.Singleton;

@Singleton
public class TokenManager {
	private static final Logger log = Logger.getLogger(TokenManager.class.getName());
	private Map<UUID, Token> tokenMap;
	private long maxLifetime;
	private long expireMilliseconds;
	
	public TokenManager(){
		this.tokenMap = new HashMap<>();
		this.maxLifetime = Long.MAX_VALUE;
		// TODO use external configuration
		this.expireMilliseconds = 1000*60*5; // default is 5 minutes
	}
	public String registerToken(Principal principal){
		Token token = new Token(this, principal);
		UUID uuid = UUID.randomUUID();
		tokenMap.put(uuid, token);
		log.info("New token for user "+principal.getName()+": "+uuid.toString());
		return uuid.toString();
	}
	
	public Token lookupToken(String uuid){
		Token token;
		UUID key;
		try{
			key = UUID.fromString(uuid);
			token = tokenMap.get(key);
		}catch( IllegalArgumentException e ){
			token = null;
			key = null;
		}
		if( token != null ){
			// check if expired
			long now = System.currentTimeMillis();
			if( now - token.issued > maxLifetime ){
				log.info("Token lifetime exceeded for "+token.getPrincipal().getName()+": "+uuid);
				tokenMap.remove(key);
				token = null;
			}else if( now - token.renewed > expireMilliseconds ){
				log.info("Token too old ("+Instant.ofEpochMilli(token.renewed)+") for "+token.getPrincipal()+": "+uuid);
				tokenMap.remove(key);
				token = null;
			}
		}
		return token;
	}
	
	public void renew(Token token){
		token.renewed = System.currentTimeMillis();
	}
}
