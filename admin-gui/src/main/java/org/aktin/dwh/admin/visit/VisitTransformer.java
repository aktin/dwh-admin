package org.aktin.dwh.admin.visit;

import java.io.IOException;
import java.net.URL;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamSource;

import org.w3c.dom.Document;

public class VisitTransformer {
	private TransformerFactory factory;
	private DocumentBuilderFactory bf;
	private URL xslt;

	public VisitTransformer(URL resourceXslt){
		xslt = resourceXslt;
		factory = TransformerFactory.newInstance();
		bf = DocumentBuilderFactory.newInstance();
		bf.setNamespaceAware(true);
		bf.setValidating(false);
	}

	public Document transform(Document source) throws TransformerException, IOException{
		Transformer t = factory.newTransformer(new StreamSource(xslt.openStream(), xslt.toExternalForm()));
		DocumentBuilder b;
		try {
			b = bf.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			throw new TransformerException("Unable to create document builder", e);
		}
		Document result = b.newDocument();
		t.transform(new DOMSource(source), new DOMResult(result));
		return result;
	}
}
