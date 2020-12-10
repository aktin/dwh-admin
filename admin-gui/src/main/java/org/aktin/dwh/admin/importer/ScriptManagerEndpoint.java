package org.aktin.dwh.admin.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

import javax.inject.Inject;
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
 */

@Path("script")
public class ScriptManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(ScriptManagerEndpoint.class.getName());
    private static final List<String> LIST_KEYS = new LinkedList<String>(Arrays.asList("VIEWNAME", "VERSION"));

    @Inject
    private Preferences prefs;

    @Context
    private SecurityContext security;

    /**
     * GET request for a list of import scripts
     * iterates recursively through directory {importScriptPath} to catch all regular files
     * iterates through the first three lines of each file (first one is skipped) to extract the keys "DESC" and "VERSION"
     * Example: #@DESC=TEST TEST -> { "DESC":"TEST TEST" }
     * identifier of DESC and VERSION is the name of the script i.e. "script.py"
     * writes values in a json in format { NAME_OF_SCRIPT : { DESC, VERSION } } and returns it
     *
     * both keys are mandatory, if one key is missing, whole element is skipped
     * if no files exist, empty json is returned
     * if directory {importScriptPath} does not exists (noSuchFileException), empty json is returned
     * TODO make POJOs
     * @return Response object with list of meta-data as json
     */
    @Path("get")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getImportScripts() {
        try {
            String path = prefs.get(PreferenceKey.importScriptPath);
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode scripts = mapper.createObjectNode();

            try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
                walk.filter(Files::isRegularFile)
                        .map(java.nio.file.Path::toFile)
                        .forEach(file -> {
                            try (BufferedReader br = new BufferedReader(new FileReader(file))) {
                                ObjectNode script = mapper.createObjectNode();
                                List<String>list = new LinkedList<>();
                                list.addAll(LIST_KEYS);

                                String line, key, value;
                                br.readLine();

                                for (int i = 0; i < 6; i++) {
                                    line = br.readLine();
                                    if(line.startsWith("#") && line.contains("@") && line.contains("=")) {
                                        key = line.substring(line.indexOf('@') + 1, line.indexOf('='));
                                        value = line.substring(line.indexOf('=') + 1);
                                        if (list.contains(key)) {
                                            list.remove(key);
                                            script.put(key, value);
                                        }
                                    } else {
                                        break;
                                    }
                                }
                                if (list.isEmpty())
                                    scripts.set(file.getName(), script);

                            } catch (FileNotFoundException e) {
                                LOGGER.log(Level.SEVERE, "File could not be found", e);
                            } catch (IOException e) {
                                LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
                            }
                        });
            }

            return Response.status(Response.Status.OK).entity(scripts).build();
        } catch (java.nio.file.NoSuchFileException e) {
            LOGGER.log(Level.SEVERE, "Directory does not exist", e);
            return Response.status(Response.Status.OK).entity("[]").build();
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e).build();
        }
    }

    /**
     * POST request to verify uploaded file using an extern script
     *
     * TODO
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     */
    @Path("{uuid}/verify")
    @POST
    public Response verifyFile(@PathParam("uuid") String uuid) {
        try {
            String path = prefs.get(PreferenceKey.importDataPath) + "/" + uuid + "/properties";

            //get script from properties
            //run magic

            LOGGER.log(Level.INFO, "Started file verification at {0}", path);
            return Response.status(Response.Status.ACCEPTED).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    /**
     * POST request to import uploaded file using an extern script
     *
     * TODO
     *
     * @param uuid: uuid of file to verify
     * @return Response with status 200
     */
    @Path("{uuid}/import")
    @POST
    public Response importFile(@PathParam("uuid") String uuid) {
        try {
            String path = prefs.get(PreferenceKey.importDataPath) + "/" + uuid + "/properties";

            //get script from properties
            //run magic

            LOGGER.log(Level.INFO, "Started file import at {0}", path);
            return Response.status(Response.Status.ACCEPTED).build();
        } catch (Exception e) {
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
                properties.store(output, "");
            }

*/