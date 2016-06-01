package org.aktin.dwh.admin;

import java.io.IOException;

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
		Preference<String> p = new Preference<String>() {

			@Override
			public Preferences getPreferences() {
				// TODO Auto-generated method stub
				return null;
			}

			@Override
			public Class<String> getType() {
				// TODO Auto-generated method stub
				return null;
			}

			@Override
			public String getValue() {
				// TODO Auto-generated method stub
				return key + "test";
			}

			@Override
			public String getKey() {
				// TODO Auto-generated method stub
				return null;
			}

			@Override
			public boolean isPublicWritable() {
				// TODO Auto-generated method stub
				return false;
			}

			@Override
			public boolean isPublicReadable() {
				// TODO Auto-generated method stub
				return true;
			}

			@Override
			public void setValue(String value, String user) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void setValue(String value) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void setValueString(String value)
					throws IllegalArgumentException {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void setValueString(String value, String user)
					throws IllegalArgumentException {
				// TODO Auto-generated method stub
				
			}
		};
		return p;
	}
	@Override
	public void flush() throws IOException {
		// TODO Auto-generated method stub
	}

}
