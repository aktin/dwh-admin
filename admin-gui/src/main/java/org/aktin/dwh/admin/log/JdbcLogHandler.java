package org.aktin.dwh.admin.log;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.logging.Handler;
import java.util.logging.LogRecord;

import javax.naming.NamingException;

import org.aktin.dwh.db.Manager;

/**
 * Writes log records to the database: logger name, level, message, throwable, timestamp, source class
 * XXX maybe move to separate project
 * @author R.W.Majeed
 *
 */
public class JdbcLogHandler extends Handler {
	private Connection dbc;
	private PreparedStatement publish;
	
	protected JdbcLogHandler(Connection dbc) throws SQLException{
		this.dbc = dbc;
		initialise();
	}
	private void initialise() throws SQLException{
		publish = dbc.prepareStatement("INSERT INTO log_records(ts, level, source, logger, message, cause)VALUES(?,?,?,?,?,?)");
		
	}
	/**
	 * Connect to the database
	 * @throws NamingException unable to locate the specified data source
	 * @throws SQLException SQL error during connection or prepared statements
	 */
	public JdbcLogHandler() throws NamingException, SQLException {
		this(Manager.openConnection());
	}

	public String stackTraceToString(Throwable throwable){
		if( throwable == null ){
			return null;
		}else{
			// TODO implement
			return throwable.toString();
		}
	}
	@Override
	public void publish(LogRecord record) {
		System.out.println("publish(level="+record.getLevel().getName()+"):"+record.getMessage());
		try{
			// TODO use queue for log entries while the database is blocking
			synchronized( publish ){
				publish.setTimestamp(1, 
						Timestamp.from(Instant.ofEpochMilli(record.getMillis()))
				);
				publish.setString(2, record.getLevel().getName());
				publish.setString(3, null);
				publish.setString(4, record.getLoggerName());
				publish.setString(5, record.getMessage());
				publish.setString(6, stackTraceToString(record.getThrown()));

				publish.execute();
			}
		}catch( SQLException e ){
			// print to stderr
			// TODO print timestamp and more info
			System.err.println("Unable to log message "+record.toString());
			e.printStackTrace();
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
