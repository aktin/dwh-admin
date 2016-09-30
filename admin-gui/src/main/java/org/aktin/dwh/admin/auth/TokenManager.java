package org.aktin.dwh.admin.auth;

import java.time.Instant;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import javax.inject.Singleton;

import org.aktin.dwh.Authentication;

@Singleton
public class TokenManager {
	private static final Logger log = Logger.getLogger(TokenManager.class.getName());
	private Map<UUID, Token> tokenMap;
	private long maxLifetime;
	private long expireMilliseconds;
	private long cleanupInterval;
	private long lastCleanup;
	
	public TokenManager(){
		this.tokenMap = new HashMap<>();
		this.maxLifetime = Long.MAX_VALUE;
		// TODO use external configuration
		this.expireMilliseconds = 1000*60*5; // default is 5 minutes
		this.cleanupInterval = 1000*60*60; // default is 1 hour
		this.lastCleanup = System.currentTimeMillis();
	}
	public String registerToken(Authentication data){
		Token token = new Token(this, data);
		UUID uuid = UUID.randomUUID();

		// try to clean expired tokens
		cleanExpiredTokens();
		// add new token
		synchronized( tokenMap ){
			tokenMap.put(uuid, token);
		}
		log.info("New token for user "+data.getName()+": "+uuid.toString());
		return uuid.toString();
	}
	
	public Token lookupToken(String uuid){
		Token token;
		UUID key;
		try{
			key = UUID.fromString(uuid);
			synchronized( tokenMap ){
				token = tokenMap.get(key);
			}
		}catch( IllegalArgumentException e ){
			token = null;
			key = null;
		}
		if( token != null ){
			// check if expired
			if( isExpired(token, System.currentTimeMillis()) ){
				token = null;
			}
		}
		return token;
	}
	
	protected boolean isExpired(Token token, long now){
		if( now - token.issued > maxLifetime ){
			log.info("Token lifetime exceeded for "+token.getPayload().getName());
			return true;
		}else if( now - token.renewed > expireMilliseconds ){
			log.info("Token too old ("+Instant.ofEpochMilli(token.renewed)+") for "+token.getPayload().getName());
			return true;
		}else{
			return false;
		}
	}
	private void cleanExpiredTokens(){
		long now = System.currentTimeMillis();
		if( now - lastCleanup < cleanupInterval ){
			return;
		}
		cleanExpiredTokens(now);
		lastCleanup = now;
		
	}

	protected void cleanExpiredTokens(long now){
		synchronized( tokenMap ){
			Iterator<Token> iter = tokenMap.values().iterator();
			while( iter.hasNext() ){
				Token t = iter.next();
				if( isExpired(t, now) ){
					iter.remove();
				}
			}
		}
	}
	public void renew(Token token){
		token.renewed = System.currentTimeMillis();
	}
	public int getTokenCount(){
		return tokenMap.size();
	}
}
