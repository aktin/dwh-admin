package org.aktin.dwh.admin.importer;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.*;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

// TODO COMMENTS + JAVA DOC
// TODO synchronized

@Singleton
public class ImportStateManager {

    private static final Logger LOGGER = Logger.getLogger(ImportStateManager.class.getName());

    @Inject
    private Preferences prefs;

    public void createPropertyFile(String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();

        Properties properties = new Properties();
        try (FileOutputStream fileOut = new FileOutputStream(new File(path))) {
            properties.store(fileOut, "");
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "File for could not be found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        }
    }

    public void writePropertyToFile(String uuid, String key, String value) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(key, value);
                properties.store(output, "");
            }
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "File for could not be found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        }
    }

    public void changeStateProperty(String uuid, ImportState state) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty("state", String.valueOf(state));
                properties.store(output, "");
            }
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "File for could not be found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        }
    }

    public boolean checkPropertyFileForKeys(String uuid, String[] list_keys) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        boolean result = false;

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            for (String key : list_keys) {
                if (!properties.containsKey(key)) {
                    return false;
                }
            }
            result = true;
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "File for could not be found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        } finally {
            return result;
        }
    }

    //TODO RAPHAEL FRAGEN wegen ="";
    public String getPropertyByKey(String uuid, String key) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        String result = "";

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            result = properties.getProperty(key);
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "File for could not be found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        } finally {
            return result;
        }
    }
}