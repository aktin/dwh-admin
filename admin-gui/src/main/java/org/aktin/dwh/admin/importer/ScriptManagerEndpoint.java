package org.aktin.dwh.admin.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

/**
 * TODO Comments
 * TODO DO NOT FORGET DWH-API:0.7-SNAPSHOT
 * TODO Aufräumen?
 */

@Path("script")
public class ScriptManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(ScriptManagerEndpoint.class.getName());
    private final ScriptKey[] SCRIPT_KEYS = {ScriptKey.VIEWNAME, ScriptKey.VERSION};

    @Inject
    private Preferences prefs;

    @Inject
    private ImportStateManager importStateManager;

    @Context
    private SecurityContext security;

    /**
     * GET request for a list of import scripts
     * iterates recursively through directory {importScriptPath} to catch all regular files
     * iterates through the first fifteen lines of each file (first one is skipped) to extract the keys "DESC" and "VERSION"
     * Example: #@DESC=TEST TEST -> { "DESC":"TEST TEST" }
     * identifier of DESC and VERSION is the name of the script i.e. "script.py"
     * writes values in a json in format { NAME_OF_SCRIPT : { DESC, VERSION } } and returns it
     * <p>
     * both keys are mandatory, if one key is missing, whole element is skipped
     * if no files exist, empty json is returned
     * if directory {importScriptPath} does not exists (noSuchFileException), empty json is returned
     * TODO make POJOs
     *
     * @return Response object with list of meta-data as json
     */
    @Path("get")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getImportScripts() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode scripts = mapper.createObjectNode();

        String path = prefs.get(PreferenceKey.importScriptPath);
        final String[] value = {null};
        try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
            walk.filter(Files::isRegularFile)
                    .map(java.nio.file.Path::toFile)
                    .forEach(file -> {
                        ObjectNode script = mapper.createObjectNode();
                        for (ScriptKey key : SCRIPT_KEYS) {
                            value[0] = getScriptValueByKey(file, key);
                            if (!value[0].isEmpty()) {
                                script.put(key.name(), value[0]);
                            }
                        }
                        if (script.size() == SCRIPT_KEYS.length)
                            scripts.set(file.getName(), script);
                    });

            return Response.status(Response.Status.OK).entity(scripts).build();
        } catch (java.nio.file.NoSuchFileException e) {
            LOGGER.log(Level.SEVERE, "Directory does not exist", e);
            return Response.status(Response.Status.OK).entity("[]").build();
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e).build();
        }
    }

    public String getScriptValueByKey(File script, ScriptKey key) {
        String line, line_key;
        String result = "";
        try (BufferedReader br = new BufferedReader(new FileReader(script))) {
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
            LOGGER.log(Level.SEVERE, "File could not be found", e);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
        } finally {
            return result;
        }
    }

    /**
     * POST request to verify uploaded file using an extern script
     * UNFINISHED
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     */
    @Path("{uuid}/verify")
    @POST
    public Response queueFileVerification(@NotNull @PathParam("uuid") String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        try {

            // get file_path from properties
            // get script from properties
            // PythonScriptExecutor.addTask(String path_file, String name_script, ScriptMethod.verify_file)
            // run magic

            importStateManager.changeStateProperty(uuid, ImportState.verification_queued);
            LOGGER.log(Level.INFO, "Queued file verification of {0}", uuid);
            return Response.status(Response.Status.ACCEPTED).build();
        } catch (ValidationException e) {
            LOGGER.log(Level.SEVERE, "PathParam must not be null", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.toString()).build();
        } catch (Exception e) {
            importStateManager.changeStateProperty(uuid, ImportState.verification_failed);
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    /**
     * POST request to import uploaded file using an extern script
     * UNFINISHED
     *
     * @param uuid: uuid of file to import
     * @return Response with status 200
     */
    @Path("{uuid}/import")
    @POST
    public Response queueFileImport(@NotNull @PathParam("uuid") String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        try {

            // get file_path from properties
            // get script from properties
            // PythonScriptExecutor.addTask(String path_file, String name_script, ScriptMethod.import_file)
            // run magic

            importStateManager.changeStateProperty(uuid, ImportState.importing_queued);
            LOGGER.log(Level.INFO, "Queued file import of {0}", uuid);
            return Response.status(Response.Status.ACCEPTED).build();
        } catch (ValidationException e) {
            LOGGER.log(Level.SEVERE, "PathParam must not be null", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.toString()).build();
        } catch (Exception e) {
            importStateManager.changeStateProperty(uuid, ImportState.import_failed);
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    /**
     * POST request to cancel script processing of uuid
     * UNFINISHED
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     */
    @Path("{uuid}/cancel")
    @POST
    public Response cancelScriptProcessing(@NotNull @PathParam("uuid") String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        try {

            // get state from properties
            // switch state

            // case verify
            importStateManager.changeStateProperty(uuid, ImportState.verification_cancelled);
            LOGGER.log(Level.INFO, "Cancelled file verification of {0}", uuid);

            // case import
            importStateManager.changeStateProperty(uuid, ImportState.import_cancelled);
            LOGGER.log(Level.INFO, "Cancelled file import of {0}", uuid);


            return Response.status(Response.Status.ACCEPTED).build();
        } catch (ValidationException e) {
            LOGGER.log(Level.SEVERE, "PathParam must not be null", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.toString()).build();
        } catch (Exception e) {
            importStateManager.changeStateProperty(uuid, ImportState.import_failed);
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    /**
     * GET request for status of script processing
     * UNFINISHED
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     */
    @Path("{uuid}/status")
    @GET
    public Response getScriptProcessStatus(@NotNull @PathParam("uuid") String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid, "properties").toString();
        try {

            // get status somehow?
            // wird im intervall aufgerufen vom Frontend? -> wenn Status ist queued oder running setze intervall abfrage

            return Response.status(Response.Status.ACCEPTED).build();
        } catch (ValidationException e) {
            LOGGER.log(Level.SEVERE, "PathParam must not be null", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.toString()).build();
        } catch (Exception e) {
            importStateManager.changeStateProperty(uuid, ImportState.import_failed);
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
}


/*
    @Path("{uuid}/status")
    @GET
    public Response getStatus(@PathParam("uuid") String uuid) {
        try {
            String path = prefs.get(PreferenceKey.importDataPath) + "/" + uuid + "/properties";

            Properties properties = new Properties();
            try (FileInputStream input = new FileInputStream(path)) {
                properties.load(input);
            }
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(String.valueOf(ImportState.verified), String.valueOf(System.currentTimeMillis()));
                properties.setProperty("state", String.valueOf(ImportState.upload_successful));
                properties.store(output, "");
            }



            LOGGER.log(Level.INFO, "Verified file at {0}", path);
            return Response.status(Response.Status.OK).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
}


            Properties properties = new Properties();
            try (FileInputStream input = new FileInputStream(path)) {
                properties.load(input);
            }
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(String.valueOf(ImportState.imported), String.valueOf(System.currentTimeMillis()));
                properties.setProperty("state", String.valueOf(ImportState.upload_successful));
                properties.store(output, "");
            }

*/




    