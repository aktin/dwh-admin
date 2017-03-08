package org.aktin.dwh.admin.log;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.function.Supplier;

import javax.inject.Inject;
import javax.ws.rs.core.MediaType;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

public class WildflyJsonLogfileReader implements LogLineSupplierFactory{
	
	@Inject
	private Preferences prefs;


	public WildflyJsonLogfileReader(){
	}
	/** Package constructor for unit tests
	 * @param prefs preferences
	 */
	WildflyJsonLogfileReader(Preferences prefs){
		this.prefs = prefs;
	}
	@Override
	public Supplier<String> readLogfile() {
		throw new UnsupportedOperationException("TODO implement");
	}
	private String encodeUsernamePassword() throws CharacterCodingException{
		String user = prefs.get(PreferenceKey.wildflyManagementUser);
		String pass = prefs.get(PreferenceKey.wildflyManagementPassword);
		return encodeUsernamePassword(user, pass);
	}
	static String encodeUsernamePassword(String user, String pass) throws CharacterCodingException{
		ByteBuffer data = StandardCharsets.ISO_8859_1.encode(user+":"+pass);
		data = Base64.getEncoder().encode(data);
		return StandardCharsets.ISO_8859_1.newDecoder().decode(data).toString();
	}
	static String digestAuth(URL url, String user, String pass){
		throw new UnsupportedOperationException("TODO implement");
	}
	
	
	
	HttpURLConnection connect(String queryString) throws IOException{
		String url = prefs.get(PreferenceKey.wildflyManagementURL);
		if( queryString != null ){
			url = url + "?" + queryString;
		}
//		Client client = ClientBuilder.newClient();
//		//JAXRS: HttpAuthenticationFeature
//		client.register(...)
//		Objects.requireNonNull(url, "Configuration required: "+PreferenceKey.wildflyManagementURL);
//		WebTarget target = client.target(url);
//		return target.request(MediaType.APPLICATION_JSON_TYPE).header("Content-type",MediaType.APPLICATION_JSON);
		
		HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
		c.addRequestProperty("Content-Type", MediaType.APPLICATION_JSON);
		c.addRequestProperty("Accept", MediaType.APPLICATION_JSON);
		c.addRequestProperty("Authorization", "Basic "+encodeUsernamePassword());
		// TODO digest authentication
		//c.addRequestProperty(, value);
		return c;
	}

}
