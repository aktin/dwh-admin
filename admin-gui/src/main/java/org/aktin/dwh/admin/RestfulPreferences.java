package org.aktin.dwh.admin;


import java.net.HttpURLConnection;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.inject.Inject;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.transform.Source;
import javax.xml.ws.BindingType;
import javax.xml.ws.Provider;
import javax.xml.ws.Service;
import javax.xml.ws.ServiceMode;
import javax.xml.ws.WebServiceContext;
import javax.xml.ws.WebServiceProvider;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.http.HTTPBinding;

import org.aktin.prefs.Preferences;


/**
 * Implements FHIR Binary interface to receive text/xml CDA documents
 * @author R.W.Majeed
 *
 */
@WebServiceProvider()
@ServiceMode(Service.Mode.MESSAGE)
@BindingType(HTTPBinding.HTTP_BINDING)
public class RestfulPreferences implements Provider<Source>{
	private static final Logger log = Logger.getLogger(RestfulPreferences.class.getName());
	private XMLOutputFactory outputFactory;
	private DocumentBuilder documentBuilder;
	@Inject
	private Preferences prefs;
	@Resource
    private WebServiceContext context;

	/**
	 * HTTP Error code 422, indicating that the submitted entity could not be processed due to semantical reasons, e.g. valid XML but Schematron validation failed.
	 * Other codes can be used from {@link HttpURLConnection}.
	 */
	public static final int HTTP_UNPROCESSABLE_ENTITY = 422;
	/**
	 * Returned if validation passed
	 */
	public static final int HTTP_OK = HttpURLConnection.HTTP_OK;
	/**
	 * Returned if the request URI contains illegal
	 */
	public static final int HTTP_BAD_REQUEST = HttpURLConnection.HTTP_BAD_REQUEST;
	/**
	 * Returned if the Content-type is not text/xml or if the entity could not be parsed as XML
	 */
	public static final int HTTP_UNSUPPORTED_TYPE = HttpURLConnection.HTTP_UNSUPPORTED_TYPE;
	
	
	public RestfulPreferences() throws ParserConfigurationException{
		outputFactory = XMLOutputFactory.newFactory();
		documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
	}
	

	/**
	 * Process RESTful/HTTP request
	 */
	@Override
	public Source invoke(Source request) {
		MessageContext mc = context.getMessageContext();
		String path = (String)mc.get(MessageContext.PATH_INFO);
		String query = (String)mc.get(MessageContext.QUERY_STRING);
		String httpMethod = (String)mc.get(MessageContext.HTTP_REQUEST_METHOD);
		// only PUT and POST supported
		if( !httpMethod.equals("PUT") && !httpMethod.equals("POST") ){
			// method not allowed
			mc.put(MessageContext.HTTP_RESPONSE_CODE, HttpURLConnection.HTTP_BAD_METHOD);
			return null;
		}
		log.info("REST request: "+httpMethod+" "+(path!=null?path:"")+(query!=null?"?"+query:""));

		// TODO write code
		
		// HTTP status response
		mc.put(MessageContext.HTTP_RESPONSE_CODE, 200);

		// TODO return response XML
		return null;
	}

}
