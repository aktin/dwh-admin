package org.aktin.dwh.admin.test;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import javax.inject.Inject;
import javax.mail.Address;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

@Path("test/email")
public class EmailTest {
	@Inject
	Preferences prefs;

	private Session lookupJndiMailSession() throws NamingException{
		String jndiName = prefs.get(PreferenceKey.emailSession);
		InitialContext ctx = new InitialContext();
		return (Session)ctx.lookup(jndiName);
	}
	@Path("send")
	@POST
	public Response sendEmail(){
		try {
			MimeMessage msg = new MimeMessage(lookupJndiMailSession());
			// use specified time zone
			ZoneId tz = ZoneId.of(prefs.get(PreferenceKey.timeZoneId));
			String ts = LocalDateTime.now(tz).toString();
			Address[] to = javax.mail.internet.InternetAddress.parse(prefs.get(PreferenceKey.email));
			msg.setRecipients(RecipientType.TO, to);
			// sender address
			Address[] replyTo = InternetAddress.parse(prefs.get(PreferenceKey.emailReplyTo));
			msg.setReplyTo(replyTo);
			msg.setSubject("AKTIN E-mail test "+ts);
			msg.setSentDate(new Date());
			StringBuilder body = new StringBuilder();
			body.append("Sehr geehrte Damen und Herren,\ndiese E-mail wurde versendet um den Versand von E-mails zu testen.");
			body.append('\n');
			body.append("Zeitstempel: "+ts);
			body.append('\n');
			msg.setText(body.toString());
	
			// TODO send attachment for testing
	//		MimeMultipart mp = new MimeMultipart(new FileDataSource(report.getLocation().toFile()));
	//		msg.setContent(mp);
			Transport.send(msg);
			body = new StringBuilder();
			body.append("E-Mail gesendet an ").append(prefs.get(PreferenceKey.email));
			body.append('\n');
			body.append("Bitte verifizieren Sie, dass die Test-E-Mail angekommen ist.");
			return Response.ok(body.toString()).build();
		} catch ( Throwable e ) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			return Response.serverError().entity(errors.toString()).build();
		}
		
	}
}
