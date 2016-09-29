package org.aktin.dwh.admin;

import java.util.Collections;
import java.util.Set;

import javax.inject.Singleton;

import org.aktin.Preferences;


@Singleton
public class MockPreferences implements Preferences {

	public MockPreferences(){
		
	}

	@Override
	public String get(String key) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Set<String> keySet() {
		// TODO Auto-generated method stub
		return Collections.emptySet();
	}

}
