package org.aktin.dwh.admin;

import java.io.IOException;
import java.net.URL;
import java.util.Objects;

import javax.inject.Inject;
import javax.inject.Singleton;

import org.aktin.Preferences;
import org.aktin.dwh.Authenticator;
import org.aktin.dwh.PreferenceKey;

import de.sekmi.li2b2.client.Li2b2Client;
import de.sekmi.li2b2.client.pm.UserConfiguration;
import de.sekmi.li2b2.hive.ErrorResponseException;
import de.sekmi.li2b2.hive.HiveException;

@Singleton
public class I2b2Authenticator implements Authenticator{

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
			String project = prefs.get(PreferenceKey.i2b2Project.key());
			Li2b2Client client = new Li2b2Client();
			client.setPM(pm);
			client.setAuthorisation(user, new String(password), project);
			UserConfiguration uc = client.PM().requestUserConfiguration();
//			String[] roles = client.PM().getRoles(user, project); // FIXME
			String[] roles = new String[]{};
			auth = new I2b2Authentication(uc.getUserName(), uc.getSessionKey(), roles, uc.isAdmin());
		}catch (ErrorResponseException e) {
			// unauthorized
		}catch( IOException e ){
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (HiveException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return auth;
	}


}
