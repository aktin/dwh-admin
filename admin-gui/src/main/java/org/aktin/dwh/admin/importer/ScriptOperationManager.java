package org.aktin.dwh.admin.importer;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.aktin.dwh.admin.importer.enums.ScriptKey;
import org.aktin.dwh.admin.importer.pojos.ScriptFilePOJO;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// TODO COMMENTS + JAVA DOC
// TODO synchronized

@Singleton
public class ScriptOperationManager {

    private static final Logger LOGGER = Logger.getLogger(ScriptOperationManager.class.getName());

    @Inject
    private Preferences preferences;

    private final HashMap<String, ScriptFilePOJO> operationLock_script = new HashMap<>();

    // only scripts with all keys in operationLock
    @PostConstruct
    public void initOperationLock() {
        HashMap<String, String> map;
        ScriptFilePOJO pojo;
        for (String script : getScriptIDs()) {
            map = checkScriptFileForIntegrity(script);
            if (map != null && !map.isEmpty()) {
                pojo = createScriptPOJO(map);
                operationLock_script.put(script, pojo);
            } else
                LOGGER.log(Level.WARNING, "{0} misses some keys", script);
        }
    }

    // files.walk -> IOExveption
    private ArrayList<String> getScriptIDs() {
        Path path = Paths.get(preferences.get(PreferenceKey.importScriptPath));
        ArrayList<String> list_scripts = new ArrayList<>();
        try (Stream<Path> walk = Files.walk(path)) {
            walk.filter(Files::isRegularFile)
                    .map(java.nio.file.Path::getFileName)
                    .map(java.nio.file.Path::toString)
                    .forEach(list_scripts::add);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to walk found", e);
        }
        return list_scripts;
    }

    private HashMap<String, String> checkScriptFileForIntegrity(String name_script) {
        String path = Paths.get(preferences.get(PreferenceKey.importScriptPath), name_script).toString();
        String line, key, value;
        HashMap<String, String> result = new HashMap<>();
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            List<String> list = Stream.of(ScriptKey.values()).map(Enum::name).collect(Collectors.toList());
            for (int i = 0; i < 15; i++) {
                line = br.readLine();
                if (line != null && line.startsWith("#") && line.contains("@") && line.contains("=")) {
                    key = line.substring(line.indexOf('@') + 1, line.indexOf('='));
                    value = line.substring(line.indexOf('=') + 1);
                    if (list.contains(key) && !value.isEmpty()) {
                        list.remove(key);
                        result.put(key, value);
                    }
                }
            }
            if (!list.isEmpty())
                result = new HashMap<>();
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "No file to read found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No line to read found", e);
        }
        return result;
    }

    private ScriptFilePOJO createScriptPOJO(HashMap<String, String> map) {
        String id = map.get(ScriptKey.ID.name());
        String viewname = map.get(ScriptKey.VIEWNAME.name());
        String version = map.get(ScriptKey.VERSION.name());
        String mimetype = map.get(ScriptKey.MIMETYPE.name());
        return new ScriptFilePOJO(id, viewname, version, mimetype);
    }

    public ArrayList<ScriptFilePOJO> getScriptPOJOs() {
        synchronized (operationLock_script) {
            return new ArrayList<>(operationLock_script.values());
        }
    }

    public ScriptFilePOJO getScriptPOJO(String name_script) {
        synchronized (operationLock_script.get(name_script)) {
            ScriptFilePOJO result = null;
            try {
                result = operationLock_script.get(name_script);
            } catch (NullPointerException e) {
                LOGGER.log(Level.SEVERE, "{0} misses some keys. Check integrity", name_script);
            }
            return result;
        }
    }

    public String getScriptPath(String name_script) {
        return Paths.get(preferences.get(PreferenceKey.importScriptPath), name_script).toString();
    }
}
