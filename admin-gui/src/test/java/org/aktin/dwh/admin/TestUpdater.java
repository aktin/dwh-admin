package org.aktin.dwh.admin;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.updater.UpdateStatus;
import org.aktin.dwh.admin.updater.Updater;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.nio.file.Paths;

@RunWith(MockitoJUnitRunner.class)
public class TestUpdater {

    @Mock
    Preferences preferences;

    @Spy
    @InjectMocks
    Updater updater;

    @Before
    public void openMocks() {
        String path_resourceDir = Paths.get("src", "test", "resources").toString();
        Mockito.when(preferences.get(PreferenceKey.updateDataPath)).thenReturn(path_resourceDir);
    }

    @Test
    public void checkDwhUpdateResult() {
        UpdateStatus updateStatus = updater.getUpdateStatus();
        Assert.assertTrue(updateStatus.isSuccess());
    }

    @Test
    public void getDwhUpdateLog() {
        Assert.assertNotNull(updater.getUpdateLog());
    }

    @Test
    public void getDwhUpdateInfo() {
        UpdateStatus updateStatus = updater.getUpdateStatus();
        String installedVersion = updateStatus.getInstalledVersion();
        String candidateVersion = updateStatus.getCandidateVersion();
        Assert.assertEquals("V1.0", installedVersion);
        Assert.assertEquals("V1.1", candidateVersion);
    }

    @Test
    public void executeDwhUpdateTwice() {
        Mockito.doReturn(true).when(updater).touch(Mockito.anyString(), Mockito.anyInt());
        Assert.assertTrue(updater.executeDwhUpdate());
        Assert.assertFalse(updater.executeDwhUpdate());
    }
}
