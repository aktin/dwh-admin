package org.aktin.dwh.admin.importer;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.importer.enums.*;
import org.aktin.dwh.admin.importer.pojos.PropertiesFilePOJO;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

// TODO COMMENTS + JAVA DOC
// TODO synchronized

@Singleton
public class FileOperationManager {

    private static final Logger LOGGER = Logger.getLogger(FileOperationManager.class.getName());
    private final PropertyKey[] DEFAULT_PROPERTIES = {PropertyKey.id, PropertyKey.filename, PropertyKey.size, PropertyKey.script, PropertyKey.operation, PropertyKey.state};

    @Inject
    private Preferences preferences;

    private final HashMap<String, PropertiesFilePOJO> operationLock_properties = new HashMap<>();

    // only integrated properties in operationLock
    @PostConstruct
    private void initOperationLock() {
        HashMap<String, String> map;
        PropertiesFilePOJO pojo;
        for (String uuid : getUploadedFileIDs()) {
            map = checkPropertiesFileForIntegrity(uuid);
            if (map != null && !map.isEmpty()) {
                pojo = createPropertiesPOJO(map);
                operationLock_properties.put(uuid, pojo);
            } else
                LOGGER.log(Level.WARNING, "{0} misses some keys", uuid);
        }
    }

    // files.walk -> IOExveption
    private ArrayList<String> getUploadedFileIDs() {
        String path = preferences.get(PreferenceKey.importDataPath);
        ArrayList<String> list_uuid = new ArrayList<>();
        try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
            walk.filter(Files::isDirectory)
                    .filter(path_dir -> !path_dir.equals(Paths.get(path)))
                    .map(java.nio.file.Path::getFileName)
                    .map(java.nio.file.Path::toString)
                    .forEach(list_uuid::add);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to walk found", e);
        }
        return list_uuid;
    }

    private HashMap<String, String> checkPropertiesFileForIntegrity(String uuid) {
        String path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid, "properties").toString();
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
        }
        return result;
    }

    private PropertiesFilePOJO createPropertiesPOJO(HashMap<String, String> map) {
        String id = map.get(PropertyKey.id.name());
        String filename = map.get(PropertyKey.filename.name());
        String size = map.get(PropertyKey.size.name());
        String script = map.get(PropertyKey.script.name());
        String operation = map.get(PropertyKey.operation.name());
        String state = map.get(PropertyKey.state.name());
        return new PropertiesFilePOJO(id, filename, size, script, operation, state);
    }

    // Exception by createDirecotries
    public String createUploadFileFolder(String uuid) throws IOException {
        String path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid).toString();
        Files.createDirectories(Paths.get(path));
        return path;
    }

    //Exception by move
    public void moveUploadFile(String path_old, String path_new, String file_name) throws IOException {
        java.nio.file.Path oldFile = Paths.get(path_old);
        java.nio.file.Path newFile = Paths.get(path_new, file_name);
        Files.move(oldFile, newFile);
    }

    // Exception by createDirecotries
    public String deleteUploadFileFolder(String uuid) throws IOException {
        synchronized (operationLock_properties.get(uuid)) {
            String path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid).toString();
            try (Stream<Path> walk = Files.walk(Paths.get(path))) {
                walk.sorted(Comparator.reverseOrder())
                        .map(java.nio.file.Path::toFile)
                        .forEach(File::delete);
            }
            synchronized (operationLock_properties) {
                operationLock_properties.remove(uuid);
            }
            return path;
        }
    }

    // outputstream -> java.io.FileNotFoundException
    // store -> IOException
    public void createUploadFileProperties(String uuid, String file_name, long file_size, String script_name) {
        String path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid, "properties").toString();
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
            addPropertiesToOperationLock(properties);
        } catch (java.io.FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to stream found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to store found", e);
        }
    }

    // runner uses this
    public void addPropertyToProperties(String uuid, PropertyKey key, String value) {
        synchronized (operationLock_properties.get(uuid)) {
            String path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid, "properties").toString();
            Properties properties = new Properties();
            try (FileInputStream input = new FileInputStream(path)) {
                properties.load(input);
                try (FileOutputStream output = new FileOutputStream(path)) {
                    properties.setProperty(key.name(), value);
                    properties.store(output, "");
                }
                addPropertiesToOperationLock(properties);
            } catch (FileNotFoundException e) {
                LOGGER.log(Level.SEVERE, "No file to stream found", e);
            } catch (IOException e) {
                LOGGER.log(Level.SEVERE, "No file to process found", e);
            }
        }
    }

    private void addPropertiesToOperationLock(Properties properties) {
        HashMap<String, String> map = new HashMap<>();
        PropertyKey key;
        for (Map.Entry<Object, Object> entry : properties.entrySet()) {
            key = PropertyKey.valueOf((String) entry.getKey());
            if (Arrays.asList(DEFAULT_PROPERTIES).contains(key))
                map.put((String) entry.getKey(), (String) entry.getValue());
        }
        PropertiesFilePOJO pojo = createPropertiesPOJO(map);
        synchronized (operationLock_properties) {
            operationLock_properties.put(pojo.getId(), pojo);
        }
    }

    public ArrayList<PropertiesFilePOJO> getPropertiesPOJOs() {
        synchronized (operationLock_properties) {
            return new ArrayList<>(operationLock_properties.values());
        }
    }

    public PropertiesFilePOJO getPropertiesPOJO(String uuid) {
        synchronized (operationLock_properties.get(uuid)) {
            PropertiesFilePOJO result = null;
            try {
                result = operationLock_properties.get(uuid);
            } catch (NullPointerException e) {
                LOGGER.log(Level.SEVERE, "{0} misses some keys. Check integrity", uuid);
            }
            return result;
        }
    }

    public String getUploadFileFolderPath(String uuid) {
        return Paths.get(preferences.get(PreferenceKey.importDataPath), uuid).toString();
    }
}
