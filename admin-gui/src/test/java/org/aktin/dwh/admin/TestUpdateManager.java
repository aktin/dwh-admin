package org.aktin.dwh.admin;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.updater.UpdateManager;
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
import java.util.HashMap;

@RunWith(MockitoJUnitRunner.class)
public class TestUpdateManager {

    @Mock
    Preferences preferences;

    @InjectMocks
    UpdateManager updateManager;

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
    public void checkForNewDwhUpdate() {
        Assert.assertTrue(updateManager.isNewDwhUpdateAvailable());
    }

    @Test
    public void checkDwhUpdateResult() {
        Assert.assertTrue(updateManager.wasDwhUpdateSuccessful());
    }

    @Test
    public void getDwhUpdateLog() {
        Assert.assertNotNull(updateManager.getDwhUpdateLog());
    }

    @Test
    public void getDwhUpdateInfo() {
        HashMap<String, String> map = new HashMap<>();
        map.put("version.installed", "V1.0");
        map.put("version.candidate", "V1.1");
        Assert.assertEquals(map, updateManager.getDwhUpdateInfo());
    }
}
