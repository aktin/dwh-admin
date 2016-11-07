package org.aktin.dwh.admin.log;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.function.Supplier;

public class DemoLogfileReader implements LogLineSupplierFactory {


	private static class DemoSupplier implements Supplier<String>, Closeable{
		private BufferedReader reader;
		public DemoSupplier(){
			reader = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/wildfly.log"), StandardCharsets.UTF_8));
		}
		@Override
		public String get() {
			String line = null;
			if( reader != null ){
				try{
					line = reader.readLine();
					if( line == null ){
						close();
					}
				}catch( IOException e ){
					throw new UncheckedIOException(e);
				}
			}
			return line;
		}
		@Override
		public void close() throws IOException {
			reader.close();
			reader = null;
		}
	}

	@Override
	public Supplier<String> readLogfile() {
		return new DemoSupplier();
	}
}
