package org.aktin.dwh.admin;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.updater.DebianUpdater;
import org.aktin.dwh.admin.updater.UpdateStatus;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import java.nio.file.Paths;

@RunWith(MockitoJUnitRunner.class)
public class TestDebianUpdater {

    @Mock
    Preferences preferences;

    @InjectMocks
    DebianUpdater debianUpdateManager;

    private AutoCloseable closeable;

    @Before
    public void openMocks() {
        closeable = MockitoAnnotations.openMocks(this);
        String path_resourceDir = Paths.get("src", "test", "resources").toString();
        Mockito.when(preferences.get(PreferenceKey.updateDataPath)).thenReturn(path_resourceDir);
    }

    @After
    public void releaseMocks() throws Exception {
        closeable.close();
    }

    @Test
    public void checkDwhUpdateResult() {
        UpdateStatus updateStatus = debianUpdateManager.getUpdateStatus();
        Assert.assertTrue(updateStatus.isSuccess());
    }

    @Test
    public void getDwhUpdateLog() {
        Assert.assertNotNull(debianUpdateManager.getUpdateLog());
    }

    @Test
    public void getDwhUpdateInfo() {
        UpdateStatus updateStatus = debianUpdateManager.getUpdateStatus();
        String installedVersion = updateStatus.getInstalledVersion();
        String candidateVersion = updateStatus.getCandidateVersion();
        Assert.assertEquals("V1.0", installedVersion);
        Assert.assertEquals("V1.1", candidateVersion);
    }

    @Test
    public void isUpdateAgentInstalled() {
        Assert.assertTrue(debianUpdateManager.isUpdateAgentInstalled());
    }
}
