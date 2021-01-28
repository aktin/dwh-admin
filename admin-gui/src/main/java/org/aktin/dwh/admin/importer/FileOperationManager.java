package org.aktin.dwh.admin.importer;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.importer.enums.ImportOperation;
import org.aktin.dwh.admin.importer.enums.ImportState;
import org.aktin.dwh.admin.importer.enums.LogType;
import org.aktin.dwh.admin.importer.enums.PropertyKey;
import org.aktin.dwh.admin.importer.pojos.PropertiesFilePOJO;
import org.aktin.dwh.admin.importer.pojos.ScriptLogPOJO;

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
import java.util.stream.Collectors;
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
    private final HashMap<String, ArrayList<ScriptLogPOJO>> operationLock_scriptLog = new HashMap<>();

    // only integrated properties in operationLock
    @PostConstruct
    private void initOperationLock() {
        HashMap<String, String> map;
        PropertiesFilePOJO pojo_properties;
        ArrayList<ScriptLogPOJO> list_scriptLog;
        for (String uuid : getUploadedFileIDs()) {
            synchronized (operationLock_properties) {
                map = checkPropertiesFileForIntegrity(uuid);
                if (map != null && !map.isEmpty()) {
                    pojo_properties = createPropertiesPOJO(map);
                    operationLock_properties.put(uuid, pojo_properties);
                } else
                    LOGGER.log(Level.WARNING, "{0} misses some keys", uuid);
            }

            synchronized (operationLock_scriptLog) {
                list_scriptLog = createScriptLogList(uuid);
                operationLock_scriptLog.put(uuid, list_scriptLog);
            }
        }

        System.out.println(operationLock_scriptLog.keySet());
        for (String key : operationLock_scriptLog.keySet()) {
            System.out.println(operationLock_scriptLog.get(key).size());
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
        Path path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid);
        Files.createDirectories(path);
        return path.toString();
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
            Path path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid);
            try (Stream<Path> walk = Files.walk(path)) {
                walk.sorted(Comparator.reverseOrder())
                        .map(java.nio.file.Path::toFile)
                        .forEach(File::delete);
            }
            synchronized (operationLock_properties) {
                operationLock_properties.remove(uuid);
            }
            return path.toString();
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


    private ArrayList<ScriptLogPOJO> createScriptLogList(String uuid) {
        ArrayList<ScriptLogPOJO> list_scriptLog = new ArrayList<>();
        ScriptLogPOJO pojo;
        for (LogType logType : LogType.values()) {
            pojo = createScriptLogPOJO(uuid, logType);
            if (pojo != null)
                list_scriptLog.add(pojo);
        }
        return list_scriptLog;
    }

    // readAllLines
    private ScriptLogPOJO createScriptLogPOJO(String uuid, LogType logType) {
        Path path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid, logType.name());
        ScriptLogPOJO pojo = null;
        if (Files.exists(path)) {
            try {
                String content = Files.readAllLines(path).stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining("\n"));
                if (!content.isEmpty())
                    pojo = new ScriptLogPOJO(uuid, logType, content);
            } catch (IOException e) {
                LOGGER.log(Level.SEVERE, "No file to read found", e);
            }
        }
        return pojo;
    }

    // only for python runner
    //TODO make better??
    public void reloadScriptLogList(String uuid) {
        ArrayList<ScriptLogPOJO> list_scriptLog = createScriptLogList(uuid);
        updateScriptLogList(uuid, list_scriptLog);
    }

    //deleteIfExists
    public String deleteScriptLog(String uuid, LogType logType) throws IOException {
        synchronized (operationLock_scriptLog.get(uuid)) {
            Path path = Paths.get(preferences.get(PreferenceKey.importDataPath), uuid, logType.name());
            Files.deleteIfExists(path);
            ArrayList<ScriptLogPOJO> list_scriptLog = operationLock_scriptLog.get(uuid);
            list_scriptLog.removeIf(scriptLog -> scriptLog.getType().equals(logType));
            updateScriptLogList(uuid, list_scriptLog);
            return path.toString();
        }
    }

    private void updateScriptLogList(String uuid, ArrayList<ScriptLogPOJO> list) {
        synchronized (operationLock_scriptLog) {
            operationLock_scriptLog.put(uuid, list);
        }
    }

    public ArrayList<ScriptLogPOJO> getScriptLogList(String uuid) {
        synchronized (operationLock_scriptLog) {
            return operationLock_scriptLog.get(uuid);
        }

    }
}
