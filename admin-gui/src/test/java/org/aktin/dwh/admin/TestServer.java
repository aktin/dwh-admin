package org.aktin.dwh.admin;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.aktin.dwh.admin.auth.AuthEndpoint;
import org.aktin.dwh.admin.auth.AuthFilter;
import org.aktin.dwh.admin.report.ReportEndpoint;
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

/**
 * li2b2 server for unit tests
 * or demonstrations.
 * 
 * @author R.W.Majeed
 *
 */
public class TestServer {

	private ResourceConfig rc;
	private Server jetty;
	private DataSource ds;
	
	public TestServer() throws SQLException{
		ds = new TestDataSource();
		rc = new ResourceConfig();
		rc.register(JAXRSPrefs.class);
		rc.register(ReportEndpoint.class);
		rc.register(AuthEndpoint.class);
		rc.register(new MyBinder(ds));
		rc.register(AuthFilter.class);
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
		return handler;
	}
	public void start(InetSocketAddress addr) throws Exception{
		ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
		context.setContextPath("/aktin/admin");

		jetty = new Server(addr);
		HandlerList handlers = new HandlerList();
		handlers.addHandler(createStaticResourceHandler());
		handlers.addHandler(context);
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
			System.err.println("Usage: "+TestServer.class.getCanonicalName()+" [port]");
			System.exit(-1);
			return;
		}

		// start server
		TestServer server = new TestServer();
		try{
			server.start(new InetSocketAddress(port));
			System.err.println("Admin endpoints at: localhost:"+server.getLocalPort()+"/aktin/admin/*");
			server.join();
		}finally{
			server.destroy();
		}
	}
}
