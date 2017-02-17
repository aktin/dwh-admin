package org.aktin.dwh.admin.test;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;


@Path("test/r")
public class RTest {
	@Inject
	Preferences prefs;

	private static final String R_TEST_FILE = "r-script-test.R";
	@POST
	@Path("run")
	public Response runR(){
		String rBin = prefs.get(PreferenceKey.rScriptBinary);
		String tempDir = prefs.get(PreferenceKey.reportTempPath);
		java.nio.file.Path temp = Paths.get(tempDir);

		StringWriter exceptions = new StringWriter();
		InputStream stderr;
		int status;
		try {
			temp = Files.createDirectories(temp.resolve("test"));
			Files.copy(getClass().getResourceAsStream("/"+R_TEST_FILE), temp.resolve(R_TEST_FILE), StandardCopyOption.REPLACE_EXISTING);
			ProcessBuilder b = new ProcessBuilder(rBin, R_TEST_FILE);
			b.directory(temp.toFile());
			Process proc = b.start();
			status = proc.waitFor();
			stderr = proc.getErrorStream();
		} catch (IOException | InterruptedException e) {
			status = -1;
			stderr = null;
			e.printStackTrace(new PrintWriter(exceptions));
		}
		StringBuilder out = new StringBuilder();
		out.append("Exit Code: "+status);
		out.append("\n");
		out.append(exceptions.toString());
		if( stderr != null ){
			out.append("\nOutput:\n");
			out.append("TODO: append process stdout");
		}
		if( status == 0 ){
			return Response.ok(out.toString()).build();
		}else{
			return Response.serverError().entity(out.toString()).build();			
		}
	}
}
