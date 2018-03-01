package org.aktin.dwh.admin.visit;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.xml.namespace.QName;
import javax.xml.transform.TransformerException;

import org.aktin.Preferences;
import org.aktin.dwh.Anonymizer;
import org.aktin.dwh.DataExtractor;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.auth.Secured;
import org.w3c.dom.Document;

@Path("visit")
public class VisitEndpoint {
	private static final Logger log = Logger.getLogger(VisitEndpoint.class.getName());
	public static final QName EAV_ROOT = new QName("http://sekmi.de/histream/ns/eav-data", "eav-data");

	@Inject
	private DataExtractor extractor;
	@Inject
	private Anonymizer anonymizer;
	@Inject
	private Preferences prefs;

	private URL lookupResourceXSLT(String name){
		return getClass().getResource("/xslt/"+name+".xslt");
	}

	/**
	 * Perform an asynchronous GET operation with encounter IDE as stored in
	 * the i2b2 encounter_mapping table.
	 * @param encounter {@code encounter_ide} as stored in i2b2's encounter_mapping table 
	 * @param xslt optional XSLT transformation. {@code null} for identity transform.
	 * @param response asynchronous response object to retrieve the results
	 */
	@GET
	@Secured
	@Produces(MediaType.APPLICATION_XML)
	public void asyncGetByPseudonym(
			@QueryParam("eide") String encounter, 
			@QueryParam("xslt") String xslt,
			@Suspended AsyncResponse response)
	{
		Objects.requireNonNull(encounter,"query param 'eide' required if no encounter ext is provided");
		final URL res;
		if( xslt == null ){
			res = null;
		}else{
			res = lookupResourceXSLT(xslt);
			if( res == null ){
				String warn = "Unknown xslt resource: "+xslt;
				log.warning(warn);
				response.resume(new BadRequestException(warn));
				return;
			}
		}
		log.info("Asynchronous GET delegated for encounter_ide="+encounter);
		CompletableFuture<Document> doc;
		try {
			doc = extractor.extractEncounterXML(encounter, EAV_ROOT);
		} catch ( FileNotFoundException e ) {
			response.resume(new NotFoundException(e));
			return;
		}
		doc.whenComplete( (d,t) -> {
			if( t != null ){
				log.log(Level.WARNING, "Asynchronous GET terminated exceptionally", t);
				response.resume(t);
			}else if( d != null ){
				log.info("Asynchronous GET completed ["+d.getDocumentElement().getNamespaceURI()+"]:"+d.getDocumentElement().getLocalName());
				
				if( res != null ){
					// transform
					VisitTransformer vt = new VisitTransformer(res);
					try {
						d = vt.transform(d);
					} catch (TransformerException | IOException e) {
						log.log(Level.WARNING, "Visit transformation failed", e);
						response.resume(e);
						return;
					}
				}
				response.resume(d);
			}
		});
	}

	@GET
	@Secured
	@Produces(MediaType.APPLICATION_XML)
	@Path("{root}/{ext}")
	public void asyncGet(
			@PathParam("root") String visitRoot, 
			@PathParam("ext") String visitExt, 
			@QueryParam("xslt") String xslt,
			@Suspended AsyncResponse response)
	{
		String encounter = anonymizer.calculateEncounterPseudonym(visitRoot, visitExt);
		asyncGetByPseudonym(encounter, xslt, response);
	}
	
	@GET
	@Secured
	@Produces(MediaType.APPLICATION_XML)
	@Path("{ext}")
	public void asyncGet(
			@PathParam("ext") String visitExt, 
			@QueryParam("xslt") String xslt,
			@Suspended AsyncResponse response)
	{
		String visitRoot = prefs.get(PreferenceKey.cdaEncounterRootPreset);
		Objects.requireNonNull(visitRoot,"no preference for "+PreferenceKey.cdaEncounterRootPreset);
		asyncGet(visitRoot, visitExt, response);
	}

}
