package org.aktin.dwh.admin.log;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.logging.Handler;
import java.util.logging.LogRecord;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 * Writes log records to the database: logger name, level, message, throwable, timestamp, source class
 * @author R.W.Majeed
 *
 */
public class JdbcLogHandler extends Handler {
	private Connection dbc;
	private PreparedStatement publish;
	
	public JdbcLogHandler() throws NamingException, SQLException {
		InitialContext ctx = new InitialContext();
		if( true )return; // XXX
		String dsName = "java:/AktinDS";
		//log.info("Connecting to i2b2 database via "+dsName);
		DataSource ds = (DataSource)ctx.lookup(dsName);
		// TODO open database connection
		dbc = ds.getConnection();
		// TODO use dependency dwh-db to get the connection
		publish = dbc.prepareStatement("INSERT INTO log_records(ts, level, source, logger, message, cause, source)VALUES(?,?,?,?,?,?,?)");
	}

	@Override
	public void publish(LogRecord record) {
		if( true )return; // TODO test and activate database processing
		try{
			// TODO use queue for log entries while the database is blocking
			synchronized( publish ){
				publish.setTimestamp(1, 
						Timestamp.from(Instant.ofEpochMilli(record.getMillis()))
				);
				publish.setString(2, record.getLevel().getName());
				// TODO more properties
				publish.execute();
			}
		}catch( SQLException e ){
			// TODO Auto-generated method stub
			
		}		
	}

	@Override
	public void flush() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void close() throws SecurityException {
		try {
			publish.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try{
			dbc.close();
		}catch( SQLException e ){
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		}
	}

}
