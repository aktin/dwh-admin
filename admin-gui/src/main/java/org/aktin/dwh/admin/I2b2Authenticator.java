package org.aktin.dwh.admin;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.inject.Singleton;

import org.aktin.Preferences;
import org.aktin.dwh.Authenticator;
import org.aktin.dwh.PreferenceKey;

import de.sekmi.li2b2.client.Li2b2Client;
import de.sekmi.li2b2.client.pm.UserConfiguration;
import de.sekmi.li2b2.hive.ErrorResponseException;
import de.sekmi.li2b2.hive.HiveException;
import de.sekmi.li2b2.hive.pm.Param;
import de.sekmi.li2b2.hive.pm.UserProject;

@Singleton
public class I2b2Authenticator implements Authenticator{
	private static final Logger log = Logger.getLogger(I2b2Authenticator.class.getName());

	private Preferences prefs;

	public I2b2Authenticator(){
		
	}
	
	@Inject
	public void setPreferences(Preferences prefs){
		this.prefs = prefs;
	}
	@Override
	public I2b2Authentication authenticate(String user, char[] password) {
		// TODO Auto-generated method stub
		I2b2Authentication auth = null;
		String url = prefs.get(PreferenceKey.i2b2ServicePM);
		Objects.requireNonNull(url, "Preference required: "+PreferenceKey.i2b2ServicePM.key());
		// use literal preference name to keep old dwh-api dependency. TODO use enum for next version
		String domain = prefs.get("i2b2.service.domain");
		Objects.requireNonNull(domain, "i2b2.service.domain not defined");
		String project = prefs.get(PreferenceKey.i2b2Project);
		try{
			URL pm = new URL(url);
			Li2b2Client client = new Li2b2Client();
			client.setPM(pm);
			client.setAuthorisation(user, new String(password), domain);
			client.setProjectId(project);
			UserConfiguration uc = client.PM().requestUserConfiguration();
			String[] roles = null; // i2b2 roles
			String role = null; // relevant AKTIN role
			for( UserProject p : uc.getProjects() ){
//	allow mismatch of preference i2b2.project to actual project.. XXX TODO fix that i2b2.project matches actual one
//				if( p.id.equals(project) ){
//					roles = p.role;
				if( p.params == null ) {
					// no project params available, skip this project
					continue;
				}
				Param[] params = p.params;
				for( int i=0; i<params.length; i++ ) {
					if( params[i].name.equals("AKTIN_ROLE") ) {
						role = params[i].value;
					}
				}
//				}
			}
			log.info("i2b2 roles from config: "+Arrays.toString(roles));
			log.info("AKTIN role from config: "+role);

			if( role == null && uc.isAdmin() ){
				// no AKTIN role defined for user, but user has admin privileges in i2b2,
				// automatically grant AKTIN admin
				role = I2b2Authentication.ROLE_ADMIN;
			}
			
			if( role != null ){
				auth = new I2b2Authentication(uc.getUserName(), uc.getSessionKey(), uc.getUserDomain(), role, uc.isAdmin());
			}else {
				// no permission to use AKTIN frontend
				log.warning("Authentication access denied. No AKTIN_ROLE defined for user "+user);
			}
		} catch (ErrorResponseException e) {
			// unauthorized
		} catch( IOException | HiveException e ){
			log.log(Level.SEVERE, "Authentication via i2b2 failed", e);
		}
		return auth;
	}


}
