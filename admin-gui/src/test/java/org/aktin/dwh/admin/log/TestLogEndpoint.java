package org.aktin.dwh.admin.log;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.nio.charset.CharacterCodingException;

import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;
import org.junit.Assert;
import org.junit.Test;

public class TestLogEndpoint {

	@Test
	public void verifyBasicAuthEncoding() throws CharacterCodingException{
		String enc = WildflyJsonLogfileReader.encodeUsernamePassword("Aladdin", "OpenSesame");
		Assert.assertEquals("QWxhZGRpbjpPcGVuU2VzYW1l", enc);
	}

	public static void main(String[] args) throws IOException{
		PropertyFilePreferences prefs = PropertyFilePreferences.empty();
		prefs.put(PreferenceKey.wildflyManagementURL.key(), "http://localhost:19990/management");
		prefs.put(PreferenceKey.wildflyManagementUser.key(), "aktin");
		prefs.put(PreferenceKey.wildflyManagementPassword.key(), "aktin2");
		WildflyJsonLogfileReader le = new WildflyJsonLogfileReader(prefs);
		HttpURLConnection c = le.connect("operation=attribute&name=server-state&json.pretty=1");
		c.getInputStream().close();
	}
}
