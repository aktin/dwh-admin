package org.aktin.dwh.admin;

import java.io.IOException;
import java.io.InputStream;

import javax.sql.DataSource;

import org.aktin.Preferences;
import org.aktin.dwh.Authenticator;
import org.aktin.dwh.admin.auth.AuthFilter;
import org.aktin.dwh.admin.auth.TokenManager;
import org.aktin.dwh.prefs.impl.PreferenceProducer;
import org.aktin.dwh.prefs.impl.PropertyFilePreferences;
import org.aktin.report.manager.ReportManager;
import org.aktin.report.manager.TestReportGeneration;
import org.aktin.report.test.SimpleReport;
import org.aktin.report.wolfsburg.WolfsburgMonthly;
import org.glassfish.hk2.utilities.binding.AbstractBinder;


public class MyBinder extends AbstractBinder{
	private DataSource ds;
	

	public MyBinder(DataSource ds){
		this.ds = ds;
	}

	@Override
	protected void configure() {
		// datasource singleton
		bind(ds).named("java:/AktinDS").to(DataSource.class);
		// singleton
		Preferences prefs;
		try( InputStream in = PropertyFilePreferences.class.getResourceAsStream("/aktin.properties") ){
			prefs = new PropertyFilePreferences(in);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		bind(prefs).to(Preferences.class);
		// producer doesn't work. TODO maybe register with jersey???
//		bind(PreferenceProducer.class).to(PreferenceProducer.class);

		// create singleton instance
		TestReportGeneration.locateR();
		ReportManager reports = new ReportManager(TestReportGeneration.rScript.toString(), new WolfsburgMonthly(), new SimpleReport());
		bind(reports).to(ReportManager.class);


		// authenticator beans
		bind(new MockAuthenticator()).to(Authenticator.class);
		// singletons must be instantiated beforehand
		bind(new TokenManager()).to(TokenManager.class);
		//bind(PMService.class).to(AbstractCell.class);
		//bind(WorkplaceService.class).to(AbstractCell.class);
	}

}
