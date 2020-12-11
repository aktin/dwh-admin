package org.aktin.dwh.admin.importer;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ImportHelper {

    public static void changeStateProperty(String path, ImportState state, Logger logger) {
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty("state", String.valueOf(state));
                properties.store(output, "");
            }
        } catch (FileNotFoundException e) {
            logger.log(Level.SEVERE, "File for changeStateProperty() could not be found", e);
        } catch (IOException e) {
            logger.log(Level.SEVERE, "An Exception was thrown", e);
        }
    }
}
