package org.aktin.dwh.admin.importer;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.importer.enums.ImportOperation;
import org.aktin.dwh.admin.importer.enums.ImportState;
import org.aktin.dwh.admin.importer.enums.PropertyKey;
import org.aktin.dwh.admin.importer.enums.ScriptKey;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

// TODO COMMENTS + JAVA DOC
// TODO synchronized
// TODO Aufräumen?

@Singleton
public class FileOperationManager {

    private static final Logger LOGGER = Logger.getLogger(FileOperationManager.class.getName());
    private final PropertyKey[] DEFAULT_KEYS = {PropertyKey.id, PropertyKey.filename, PropertyKey.size, PropertyKey.script, PropertyKey.operation, PropertyKey.state};

    @Inject
    private Preferences prefs;

    //TODO hat ALLE lese/schreib operationen

    //TODO INIT get all scripts und files in /var/lib/aktin -> HashMap mit UUID


    //TODO CRUD für Skripts und Properties

    //TODO split State into and und operation


    // Exception by createDirecotries
    public String createUploadFileFolder(String uuid) throws IOException {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid).toString();
        Files.createDirectories(Paths.get(path));
        return path;
    }

    // Exception by createDirecotries
    public String deleteUploadFileFolder(String uuid) throws IOException {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid).toString();
        try (Stream<Path> walk = Files.walk(Paths.get(path))) {
            walk.sorted(Comparator.reverseOrder())
                    .map(java.nio.file.Path::toFile)
                    .forEach(File::delete);
        }
        return path;
    }

    //Exception by move
    public void moveUploadFile(String path_old, String path_new, String file_name) throws IOException {
        java.nio.file.Path oldFile = Paths.get(path_old);
        java.nio.file.Path newFile = Paths.get(path_new, file_name);
        Files.move(oldFile, newFile);
    }

    // outputstream -> java.io.FileNotFoundException
    // store -> IOException
    public void createUploadFileProperty(String uuid, String file_name, long file_size, String script_name) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        Properties properties = new Properties();
        try (FileOutputStream fileOut = new FileOutputStream(new File(path))) {
            properties.setProperty(PropertyKey.id.name(), uuid);
            properties.setProperty(PropertyKey.filename.name(), file_name);
            properties.setProperty(PropertyKey.size.name(), String.valueOf(file_size));
            properties.setProperty(PropertyKey.script.name(), script_name);
            properties.setProperty(PropertyKey.operation.name(), String.valueOf(ImportOperation.uploading));
            properties.setProperty(PropertyKey.state.name(), String.valueOf(ImportState.successful));
            properties.setProperty(PropertyKey.uploaded.name(), String.valueOf(System.currentTimeMillis()));
            properties.store(fileOut, "");
        } catch (java.io.FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to stream found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to store found", e);
        }
    }

    // files.walk -> IOExveption
    public ArrayList<String> getUploadedFileIDs() throws IOException {
        String path = prefs.get(PreferenceKey.importDataPath);
        ArrayList<String> list_uuid = new ArrayList<>();
        try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
            walk.filter(Files::isDirectory)
                    .filter(path_dir -> !path_dir.equals(Paths.get(path)))
                    .map(java.nio.file.Path::getFileName)
                    .map(java.nio.file.Path::toString)
                    .forEach(list_uuid::add);
        }
        return list_uuid;
    }

    public boolean checkPropertyFileForIntegrity(String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        Properties properties = new Properties();
        boolean result = false;
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            for (PropertyKey key : DEFAULT_KEYS) {
                if (!properties.containsKey(key.name())) {
                    return false;
                }
            }
            result = true;
        } catch (java.io.FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to stream found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to load found", e);
        } finally {
            return result;
        }
    }

    public PropertiesFilePOJO createPropertyPOJO(String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        Properties properties = new Properties();
        PropertiesFilePOJO pojo_properties = null;
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            String id = properties.getProperty(PropertyKey.id.name());
            String filename = properties.getProperty(PropertyKey.filename.name());
            String size = properties.getProperty(PropertyKey.size.name());
            String script = properties.getProperty(PropertyKey.script.name());
            String operation = properties.getProperty(PropertyKey.operation.name());
            String state = properties.getProperty(PropertyKey.state.name());
            pojo_properties = new PropertiesFilePOJO(id, filename, script, size, operation, state);
        } catch (java.io.FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to stream found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to load found", e);
        } finally {
            return pojo_properties;
        }
    }


//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

    public void writePropertyToFile(String uuid, PropertyKey key, String value) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(key.name(), value);
                properties.store(output, "");
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        }
    }

    public String getPropertyByKey(String uuid, PropertyKey key) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        String result = "";

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            result = properties.getProperty(key.name());
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        } finally {
            return result;
        }
    }

    public void changeStateProperty(String uuid, ImportState state) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(PropertyKey.state.name(), state.name());
                properties.store(output, "");
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        }
    }

    public ImportState getStateProperty(String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        String result = "";

        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            result = properties.getProperty(PropertyKey.state.name());
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        } finally {
            return ImportState.valueOf(result);
        }
    }


    public String getScriptValueByKey(String name_script, ScriptKey key) {
        String path_script = Paths.get(prefs.get(PreferenceKey.importScriptPath), name_script).toString();
        String line, line_key;
        String result = "";
        try (BufferedReader br = new BufferedReader(new FileReader(path_script))) {
            for (int i = 0; i < 15; i++) {
                line = br.readLine();
                if (line != null && line.startsWith("#") && line.contains("@") && line.contains("=")) {
                    line_key = line.substring(line.indexOf('@') + 1, line.indexOf('='));
                    if (line_key != null && line_key.equals(key.name())) {
                        result = line.substring(line.indexOf('=') + 1);
                    }
                }
            }
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to read found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to read line found", e);
        } finally {
            return result;
        }
    }

}