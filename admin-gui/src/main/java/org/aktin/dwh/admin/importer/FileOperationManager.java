package org.aktin.dwh.admin.importer;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.importer.enums.ImportOperation;
import org.aktin.dwh.admin.importer.enums.ImportState;
import org.aktin.dwh.admin.importer.enums.PropertyKey;
import org.aktin.dwh.admin.importer.enums.ScriptKey;
import org.aktin.dwh.admin.importer.pojos.PropertiesFilePOJO;
import org.aktin.dwh.admin.importer.pojos.ScriptFilePOJO;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// TODO COMMENTS + JAVA DOC
// TODO synchronized

@Singleton
public class FileOperationManager {

    private static final Logger LOGGER = Logger.getLogger(FileOperationManager.class.getName());
    private final PropertyKey[] DEFAULT_PROPERTIES = {PropertyKey.id, PropertyKey.filename, PropertyKey.size, PropertyKey.script, PropertyKey.operation, PropertyKey.state};

    @Inject
    private Preferences prefs;

    //TODO hat ALLE lese/schreib operationen

    //TODO INIT get all scripts und files in /var/lib/aktin -> HashMap mit UUID


    // Exception by createDirecotries
    public String createUploadFileFolder(String uuid) throws IOException {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid).toString();
        Files.createDirectories(Paths.get(path));
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

    public void writePropertyToFile(String uuid, PropertyKey key, String value) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(key.name(), value);
                properties.store(output, "");
            }
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to stream found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to process found", e);
        }
    }

    public String getPropertyByKey(String uuid, PropertyKey key) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        Properties properties = new Properties();
        String result = "";
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            result = properties.getProperty(key.name());
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to stream found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to read found", e);
        } finally {
            return result;
        }
    }

    public void changeOperationStateProperty(String uuid, ImportOperation operation, ImportState state) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(PropertyKey.operation.name(), operation.name());
                properties.setProperty(PropertyKey.state.name(), state.name());
                properties.store(output, "");
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
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

    public HashMap<String, String> checkPropertiesFileForIntegrity(String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        Properties properties = new Properties();
        HashMap<String, String> result = new HashMap<>();
        try (FileInputStream input = new FileInputStream(path)) {
            properties.load(input);
            for (PropertyKey key : DEFAULT_PROPERTIES) {
                if (properties.containsKey(key.name())) {
                    result.put(key.name(), properties.getProperty(key.name()));
                }
            }
            if (DEFAULT_PROPERTIES.length != result.keySet().size())
                result = new HashMap<>();
        } catch (java.io.FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to stream found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to load found", e);
        } finally {
            return result;
        }
    }

    public PropertiesFilePOJO createPropertiesPOJO(HashMap<String, String> map) {
        PropertiesFilePOJO pojo_properties = null;
        String id = map.get(PropertyKey.id.name());
        String filename = map.get(PropertyKey.filename.name());
        String size = map.get(PropertyKey.size.name());
        String script = map.get(PropertyKey.script.name());
        String operation = map.get(PropertyKey.operation.name());
        String state = map.get(PropertyKey.state.name());
        pojo_properties = new PropertiesFilePOJO(id, filename, script, size, operation, state);
        return pojo_properties;
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

    public String getScriptValueByKey(String name_script, ScriptKey search_key) {
        String path = Paths.get(prefs.get(PreferenceKey.importScriptPath), name_script).toString();
        String line, key;
        String result = "";
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            for (int i = 0; i < 15; i++) {
                line = br.readLine();
                if (line != null && line.startsWith("#") && line.contains("@") && line.contains("=")) {
                    key = line.substring(line.indexOf('@') + 1, line.indexOf('='));
                    if (key != null && key.equals(search_key.name())) {
                        result = line.substring(line.indexOf('=') + 1);
                    }
                }
            }
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to read found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No line to read found", e);
        } finally {
            return result;
        }
    }

    public ArrayList<String> getScriptIDs() throws IOException {
        String path = prefs.get(PreferenceKey.importScriptPath);
        ArrayList<String> list_scripts = new ArrayList<>();
        try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
            walk.filter(Files::isRegularFile)
                    .map(java.nio.file.Path::getFileName)
                    .map(java.nio.file.Path::toString)
                    .forEach(list_scripts::add);
        }
        return list_scripts;
    }

    // WIE SCHÖNER MACHEN MIT "ID"??
    public HashMap<String, String> checkScriptFileForIntegrity(String name_script) {
        String path = Paths.get(prefs.get(PreferenceKey.importScriptPath), name_script).toString();
        String line, key, value;
        HashMap<String, String> result = new HashMap<>();
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            List<String> list = Stream.of(ScriptKey.values()).map(Enum::name).collect(Collectors.toList());
            for (int i = 0; i < 15; i++) {
                line = br.readLine();
                if (line != null && line.startsWith("#") && line.contains("@") && line.contains("=")) {
                    key = line.substring(line.indexOf('@') + 1, line.indexOf('='));
                    if (key != null && list.contains(key)) {
                        list.remove(key);
                        value = line.substring(line.indexOf('=') + 1);
                        result.put(key, value);
                    }
                }
            }
            if (!list.isEmpty())
                result = new HashMap<>();
            else
                result.put("id", name_script);
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to read found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No line to read found", e);
        } finally {
            return result;
        }
    }

    public ScriptFilePOJO createScriptPOJO(HashMap<String, String> map) {
        ScriptFilePOJO pojo_script = null;
        String viewname = map.get(ScriptKey.VIEWNAME.name());
        String version = map.get(ScriptKey.VERSION.name());
        String name_script = map.get("id");
        pojo_script = new ScriptFilePOJO(name_script, viewname, version);
        return pojo_script;
    }
}