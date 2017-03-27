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
		try{
			String url = prefs.get(PreferenceKey.i2b2ServicePM.key());
			Objects.requireNonNull(url, "Preference required: "+PreferenceKey.i2b2ServicePM.key());
			URL pm = new URL(url);
			String project = prefs.get(PreferenceKey.i2b2Project);
			String domain = prefs.get(PreferenceKey.i2b2ServiceDomain);
			Li2b2Client client = new Li2b2Client();
			client.setPM(pm);
			client.setAuthorisation(user, new String(password), domain);
			client.setProjectId(project);
			UserConfiguration uc = client.PM().requestUserConfiguration();
			String[] roles = null;
			for( UserProject p : uc.getProjects() ){
				if( p.id.equals(project) ){
					roles = p.role;
				}
			}
			log.info("Roles from config: "+Arrays.toString(roles));
			auth = new I2b2Authentication(uc.getUserName(), uc.getSessionKey(), uc.getUserDomain(), roles, uc.isAdmin());
		}catch (ErrorResponseException e) {
			// unauthorized
		}catch( IOException | HiveException e ){
			log.log(Level.SEVERE, "Authentication via i2b2 failed", e);
		}
		return auth;
	}


}
