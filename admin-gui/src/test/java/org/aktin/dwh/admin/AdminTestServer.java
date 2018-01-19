package org.aktin.dwh.admin;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.NamingException;
import javax.sql.DataSource;

import org.aktin.dwh.admin.auth.AuthEndpoint;
import org.aktin.dwh.admin.auth.AuthFilter;
import org.aktin.dwh.admin.log.LogEndpoint;
import org.aktin.dwh.admin.report.ReportArchiveEndpoint;
import org.aktin.dwh.admin.report.ReportEndpoint;
import org.aktin.dwh.admin.request.QueryEndpoint;
import org.aktin.dwh.admin.request.RequestEndpoint;
import org.aktin.dwh.admin.user.UserEndpoint;
import org.aktin.dwh.db.TestDataSource;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

import de.sekmi.li2b2.services.PMService;

/**
 * li2b2 server for unit tests
 * or demonstrations.
 * 
 * @author R.W.Majeed
 *
 */
public class AdminTestServer {

	private ResourceConfig rc;
	private Server jetty;
	private DataSource ds;
	
	public AdminTestServer() throws SQLException, NamingException{
		ds = new TestDataSource();
		try( Connection dbc = ds.getConnection() ){
			dbc.createStatement().close();
		}
		rc = new ResourceConfig();
		rc.register(new MyBinder(ds));
		rc.register(JAXRSPrefs.class);
		rc.register(ReportEndpoint.class);
		rc.register(AuthEndpoint.class);
		rc.register(AuthFilter.class);
		rc.register(PMService.class);
		rc.register(UserEndpoint.class);
		rc.register(LogEndpoint.class);
		rc.register(ReportArchiveEndpoint.class);
		rc.register(Summary.class);
		rc.register(RequestEndpoint.class);
		rc.register(QueryEndpoint.class);

		setupJNDI(ds);
	}

	// XXX does that work???
	private void setupJNDI(DataSource ds) throws NamingException{
		// TODO implement custom initial context factory for testing
		// e.g. http://stackoverflow.com/questions/17083142/junit-testing-jndi-initialcontext-outside-the-application-server
//		System.setProperty(Context.INITIAL_CONTEXT_FACTORY, "org.apache.naming.java.javaURLContextFactory");
//		System.setProperty(Context.URL_PKG_PREFIXES, "org.apache.naming");            
//		InitialContext ic = new InitialContext();
//		
//		ic.bind("java:/comp/env/jdbc/TestAKTIN", ds);
	}
	public void register(Class<?> componentClass){
		rc.register(componentClass);
	}
	
	protected void start_local(int port) throws Exception{
		start(new InetSocketAddress(InetAddress.getLoopbackAddress(), port));
	}
	public int getLocalPort(){
		return ((ServerConnector)jetty.getConnectors()[0]).getLocalPort();
	}

	private Handler createStaticResourceHandler(){
		// use resource handler to serve files from WEB-INF
		// http://stackoverflow.com/questions/10284584/serving-static-files-w-embedded-jetty
		// TODO set context path to /aktin/admin

		ResourceHandler handler = new ResourceHandler();
		handler.setResourceBase("src/main/webapp");
		handler.setDirectoriesListed(true);
		handler.setWelcomeFiles(new String[]{"index.html"});

		ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
		context.setContextPath("/aktin/admin");
		
		context.setHandler(handler);
		
		return context;
	}
	public void start(InetSocketAddress addr) throws Exception{
		ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
		context.setContextPath("/aktin/admin/rest");

		jetty = new Server(addr);
		HandlerList handlers = new HandlerList();
		handlers.addHandler(context);
		handlers.addHandler(createStaticResourceHandler());
		jetty.setHandler(handlers);

		ServletHolder jersey = new ServletHolder(new ServletContainer(rc));
//		jersey.setInitOrder(0);
		context.addServlet(jersey, "/*");

		jetty.start();
	}
	public void join() throws InterruptedException{
		jetty.join();
	}
	public void destroy() throws Exception{
		jetty.destroy();
	}
	public void stop() throws Exception{
		jetty.stop();
	}

	/**
	 * Run the test server with with the official i2b2
	 * webclient.
	 * @param args command line arguments: port can be specified optionally
	 * @throws Exception any error
	 */
	public static void main(String[] args) throws Exception{
		// use port if specified
		int port;
		if( args.length == 0 ){
			port = 8080;
		}else if( args.length == 1 ){
			port = Integer.parseInt(args[0]);
		}else{
			System.err.println("Too many command line arguments!");
			System.err.println("Usage: "+AdminTestServer.class.getCanonicalName()+" [port]");
			System.exit(-1);
			return;
		}

		// start server
		AdminTestServer server = new AdminTestServer();
		try{
			server.start(new InetSocketAddress(port));
			System.err.println("Admin endpoints at: localhost:"+server.getLocalPort()+"/aktin/admin/rest/*");
			//assureBrokerRequestsAvailable(server.getLocalPort()+1);
			server.join();
		}finally{
			server.destroy();
		}
	}
}
