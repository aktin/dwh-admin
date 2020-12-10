package org.aktin.dwh.admin.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

/**
 * TODO Comments
 * TODO DO NOT FORGET DWH-API:0.7-SNAPSHOT
 */

@Path("file")
public class FileManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(FileManagerEndpoint.class.getName());

    @Inject
    private Preferences prefs;

    @Context
    private SecurityContext security;

    /**
     * GET request for a list of uploaded files
     * iterates recursively through directory {importDataPath} to catch all regular files named 'properties'
     * extracts keys named "ID", "NAME", "SIZE" and "IMPORTED"/"VERIFIED"
     * writes values in a json in format { ID : { NAME, SIZE, IMPORTED/VERIFIED } } and returns it
     *
     * all keys are mandatory, if one key is missing, whole element is skipped
     * if no files named 'properties' exist, empty json is returned
     * if directory [importDataPath} does not exists (noSuchFileException), empty json is returned
     * TODO make POJOs
     * @return Response object with list of meta-data as json
     */
    @Path("get")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUploadedFiles() {
        try {
            String path = prefs.get(PreferenceKey.importDataPath);
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode uploaded_files = mapper.createObjectNode();

            try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
                walk.filter(Files::isRegularFile)
                        .map(java.nio.file.Path::toFile)
                        .filter(file -> file.getName().equals("properties"))
                        .forEach(file -> {
                            Properties properties = new Properties();
                            try (FileInputStream input = new FileInputStream(file)) {
                                properties.load(input);

                                if( properties.containsKey("id") &&
                                    properties.containsKey("filename") &&
                                    properties.containsKey("size") &&
                                    properties.containsKey("script") &&
                                    ( properties.containsKey("imported") || properties.containsKey("verified") || properties.containsKey("uploaded") )) {

                                    ObjectNode uploaded_file = mapper.createObjectNode();
                                    Set<String> properties_keys = properties.stringPropertyNames();
                                    uploaded_file.put("filename", properties.getProperty("filename"));
                                    uploaded_file.put("size", properties.getProperty("size"));
                                    uploaded_file.put("script", properties.getProperty("script"));
                                    if (properties_keys.contains("imported"))
                                        uploaded_file.put("lastState", "import_successful");
                                    else if (properties_keys.contains("verified"))
                                        uploaded_file.put("lastState", "verification_successful");
                                    else if (properties_keys.contains("uploaded"))
                                        uploaded_file.put("lastState", "upload_successful");
                                    uploaded_files.set(properties.getProperty("id"), uploaded_file);
                                }
                            } catch (FileNotFoundException e) {
                                LOGGER.log(Level.SEVERE, "File could not be found", e);
                            } catch (IOException e) {
                                LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
                            }
                        });
            }

            return Response.status(Response.Status.OK).entity(uploaded_files).build();
        } catch (java.nio.file.NoSuchFileException e) {
            LOGGER.log(Level.SEVERE, "Directory does not exist", e);
            return Response.status(Response.Status.OK).entity("[]").build();
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    /**
     * POST request for a new file
     * creates a new uuid for the file
     * creates a new folder named {uuid} in directory {importDataPath}
     * creates a new properties file in folder with ID, SIZE, IMPORTSTATE, NAME, PATH and TYPE
     * moves uploaded file from /tmp to new folder
     *
     * @param file: uploaded file to save
     * @param filename: name of uploaded file (to upload filename and avoid using formParam)
     * @param script: name (id) of script to run verification/import with
     * @return Response with status 201 and uuid of uploaded file
     */
    @Path("upload")
    @POST
    public Response uploadFile(@QueryParam("script") String script, @QueryParam("filename") String filename, File file) {
        try {
            String uuid = UUID.randomUUID().toString();

            Properties properties = new Properties();
            properties.setProperty("size", String.valueOf(file.length()));

            String newPath = prefs.get(PreferenceKey.importDataPath) + "/" + uuid;
            Files.createDirectories(Paths.get(newPath));

            java.nio.file.Path oldFile = Paths.get(file.getAbsolutePath());
            java.nio.file.Path newFile = Paths.get(newPath, filename);
            Files.move(oldFile, newFile);

            properties.setProperty(String.valueOf(ImportState.uploaded), String.valueOf(System.currentTimeMillis()));
            properties.setProperty("id", uuid);
            properties.setProperty("path", newFile.toString());
            properties.setProperty("filename", filename);
            properties.setProperty("script", script);

            File file_properties = new File(newPath + "/properties");
            try (FileOutputStream fileOut = new FileOutputStream(file_properties)) {
                properties.store(fileOut, "");
            }

            LOGGER.log(Level.INFO, "Uploaded file to {0}", newFile.toString());
            return Response.status(Response.Status.CREATED).entity(uuid).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    /**
     * DELETE request for an uploaded file
     * deletes recursively folder named {uuid} in directory {importDataPath}
     *
     * @param uuid: uuid of file to delete
     * @return Response with status 200
     */
    @Path("{uuid}/delete")
    @DELETE
    public Response deleteFile(@PathParam("uuid") String uuid) {
        try {
            String path = prefs.get(PreferenceKey.importDataPath) + "/" + uuid;
            try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
                    walk.sorted(Comparator.reverseOrder())
                        .map(java.nio.file.Path::toFile)
                        .forEach(File::delete);
            }

            LOGGER.log(Level.INFO, "Deleted file at {0}", path);
            return Response.status(Response.Status.OK).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
}



    /*
    MOVE TO VERIFICATION
                RandomAccessFile raf = new RandomAccessFile(file, "r");
            int fileSignature = raf.readInt();
            if (! (fileSignature == 0x504B0304 || fileSignature == 0x504B0506 || fileSignature == 0x504B0708))
                throw new ZipException();
                 } catch (ZipException e) {
            LOGGER.log(Level.SEVERE, "MEDIA_TYPE is not ZIP", e);
            return Response.status(Response.Status.UNSUPPORTED_MEDIA_TYPE).entity(e.toString()).build();

     */
