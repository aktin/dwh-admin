package org.aktin.dwh.admin.log;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.function.Supplier;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;

public class LogFileFilter implements StreamingOutput {

	private Supplier<String> log;
	private int filterLevel;

	public LogFileFilter(Supplier<String> log){
		this.log = log;
		this.filterLevel = 4; // warn
	}
	@Override
	public void write(OutputStream output) throws IOException, WebApplicationException {
		BufferedWriter out = new BufferedWriter(new OutputStreamWriter(output, StandardCharsets.UTF_8));
		out.write("[\n");
		while( true ){
			String line = log.get();
			if( line == null ){
				break;
			}
			// TODO read ahead. Some lines start with a space and are part of the previous message. maybe some neither start with timestamp nor space
			String[] parts = line.split(" ", 4);
			if( parts.length < 4 ){
				// TODO log error
				throw new IOException("Unexpected log line format: "+line);
			}
			switch( parts[2] ){
			case "DEBUG":
				if( filterLevel < 3 ){
					continue;
				}
			case "INFO":
				if( filterLevel < 2 ){
					continue;
				}
			case "WARN":
				if( filterLevel < 1 ){
					continue;
				}
			case "ERROR":
			default:
				out.write("{'ts':'");
				out.write(parts[0]);
				out.write(' ');
				out.write(parts[1]);
				out.write("','lv':'");
				out.write(parts[2]);
				out.write("',m='");
				out.write(parts[3]);
				out.write("'}");				
				out.newLine();
			}			
		}
		out.write("\n]\n");
		out.close();
	}


}
