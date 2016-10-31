package org.aktin.dwh.admin;

import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;

import javax.sql.DataSource;

import org.aktin.Preferences;
import org.aktin.dwh.Authenticator;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.auth.TokenManager;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;
import org.aktin.report.manager.ReportManager;
import org.aktin.report.manager.TestReportGeneration;
import org.aktin.report.test.SimpleReport;
import org.glassfish.hk2.utilities.binding.AbstractBinder;

import de.sekmi.li2b2.api.pm.Project;
import de.sekmi.li2b2.api.pm.ProjectManager;
import de.sekmi.li2b2.api.pm.User;
import de.sekmi.li2b2.services.impl.ProjectManagerImpl;
import de.sekmi.li2b2.services.token.AbstractTokenManager;


public class MyBinder extends AbstractBinder{
	private DataSource ds;
	

	public MyBinder(DataSource ds){
		this.ds = ds;
	}

	private void setup_i2b2_simulation(){
		ProjectManagerImpl pm = new ProjectManagerImpl();
		Project project = pm.addProject("AKTIN", "AKTIN Data Warehouse");
		User user = pm.addUser("demo");//, "i2b2demo");
		user.setPassword("demouser".toCharArray());
		project.addUserRoles(user, "USER","EDITOR","DATA_OBFSC","Bamboo");
		user = pm.addUser("i2b2");
		user.setPassword("demouser".toCharArray());
		project.addUserRoles(user, "MANAGER");
		//pm.addProject("Demo2", "li2b2 Demo2").addUserRoles(user, "USER");
		bind(new AbstractTokenManager<Principal>() {
			@Override
			public Principal createPrincipal(String name) {
				return new Principal() {
					@Override
					public String getName() {
						return name;
					}
				};
			}
		}).to(de.sekmi.li2b2.services.token.TokenManager.class);
		bind(pm).to(ProjectManager.class);
	}
	@Override
	protected void configure() {
		// datasource singleton
		bind(ds).named("java:/AktinDS").to(DataSource.class);
		// singleton
		PropertyFilePreferences prefs;
		try( InputStream in = PropertyFilePreferences.class.getResourceAsStream("/aktin.properties") ){
			prefs = new PropertyFilePreferences(in);
			prefs.put(PreferenceKey.i2b2ServicePM.key(), "http://localhost:8080/aktin/admin/i2b2/services/PMService/");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		bind(prefs).to(Preferences.class);
		// producer doesn't work. TODO maybe register with jersey???
//		bind(PreferenceProducer.class).to(PreferenceProducer.class);

		// create singleton instance
		TestReportGeneration.locateR();
		ReportManager reports = new ReportManager(TestReportGeneration.rScript.toString(), new SimpleReport());
		bind(reports).to(ReportManager.class);


		// authenticator beans
		I2b2Authenticator auth = new I2b2Authenticator();
		auth.setPreferences(prefs);
		bind(auth).to(Authenticator.class);
		// singletons must be instantiated beforehand
		bind(new TokenManager()).to(TokenManager.class);
		//bind(PMService.class).to(AbstractCell.class);
		//bind(WorkplaceService.class).to(AbstractCell.class);
		setup_i2b2_simulation();
	}

}
