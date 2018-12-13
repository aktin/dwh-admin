package org.aktin.dwh.admin.test;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.ZoneId;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.aktin.Preferences;
import org.aktin.dwh.EmailService;
import org.aktin.dwh.PreferenceKey;

@Path("test/email")
public class EmailTest {
	@Inject
	Preferences prefs;

	@Inject EmailService email;

	@Path("send")
	@POST
	public Response sendEmail(){
		ZoneId tz = ZoneId.of(prefs.get(PreferenceKey.timeZoneId));
		String ts = LocalDateTime.now(tz).toString();

		StringBuilder body = new StringBuilder();
		body.append("Sehr geehrte Damen und Herren,\ndiese E-mail wurde versendet um den Versand von E-mails zu testen.");
		body.append('\n');
		body.append("Zeitstempel: "+ts);
		body.append('\n');

		String subject = "AKTIN E-mail test "+ts;
		try {
			email.sendEmail(subject, body.toString());
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
