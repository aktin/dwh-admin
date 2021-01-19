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

    private HashMap<String, HashMap<String, String>> operationLock_script = new HashMap<>();

    // only integrated properties in operationLock
    @PostConstruct
    public void initOperationLock() {
        HashMap<String, String> hashMap_tmp;
        for (String script : getScriptIDs()) {
            hashMap_tmp = checkScriptFileForIntegrity(script);
            if (hashMap_tmp != null && !hashMap_tmp.isEmpty())
                operationLock_script.put(script, hashMap_tmp);
            else
                LOGGER.log(Level.INFO, "{0} misses some keys", script);
        }
    }

    // files.walk -> IOExveption
    private ArrayList<String> getScriptIDs() {
        String path = preferences.get(PreferenceKey.importScriptPath);
        ArrayList<String> list_scripts = new ArrayList<>();
        try (Stream<Path> walk = Files.walk(Paths.get(path))) {
            walk.filter(Files::isRegularFile)
                    .map(java.nio.file.Path::getFileName)
                    .map(java.nio.file.Path::toString)
                    .forEach(list_scripts::add);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "No file to walk found", e);
        }
        return list_scripts;
    }

    // WIE SCHÖNER MACHEN MIT "ID"??
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
        }
        return result;
    }

    public String[] getKeys() {
        synchronized (operationLock_script) {
            return operationLock_script.keySet().toArray(new String[0]);
        }
    }

    public ArrayList<HashMap<String, String>> getValues() {
        synchronized (operationLock_script) {
            return operationLock_script.values().stream().collect(Collectors.toCollection(ArrayList::new));
        }
    }

    public HashMap<String, String> getScriptHashMap(String name_script) {
        synchronized (operationLock_script.get(name_script)) {
            HashMap<String, String> result = new HashMap<>();
            try {
                result = operationLock_script.get(name_script);
            } catch (NullPointerException e) {
                LOGGER.log(Level.SEVERE, "{0} misses some keys. Check integrity", name_script);
            }
            return result;
        }
    }

    public String getScriptValueByKey(String name_script, ScriptKey key) {
        HashMap<String, String> hashmap_tmp = getScriptHashMap(name_script);
        return hashmap_tmp.get(key.name());
    }

    public ScriptFilePOJO createScriptPOJO(HashMap<String, String> map) {
        ScriptFilePOJO pojo_script;
        String viewname = map.get(ScriptKey.VIEWNAME.name());
        String version = map.get(ScriptKey.VERSION.name());
        String name_script = map.get("id");
        pojo_script = new ScriptFilePOJO(name_script, viewname, version);
        return pojo_script;
    }

    public String getScriptPath(String name_script) {
        return Paths.get(preferences.get(PreferenceKey.importScriptPath), name_script).toString();
    }
}
