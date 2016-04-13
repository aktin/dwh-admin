package org.aktin.dwh.admin;

import javax.inject.Singleton;

import org.aktin.prefs.Preference;
import org.aktin.prefs.Preferences;

@Singleton
public class MockPreferences implements Preferences {

	public MockPreferences(){
		
	}
	@Override
	public String getString(String key) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Integer getInteger(String key) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void putString(String key, String value) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void putInteger(String key, Integer value) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Preference<?> get(String key) {
		// TODO Auto-generated method stub
		return null;
	}

}
