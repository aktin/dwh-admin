package org.aktin.dwh.admin.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;

import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.validation.constraints.NotNull;
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
 * TODO Aufräumen?
 */

@Path("file")
public class FileManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(FileManagerEndpoint.class.getName());

    @Inject
    private Preferences prefs;

    @Inject
    private ImportStateManager importStateManager;

    @Context
    private SecurityContext security;

    /**
     * GET request for a list of uploaded files
     * iteriert durch alle ordner in importDataPath
     * ordnername = uuid
     * nutzt uuid, um properties zu öffnen
     * checkt if properties vollständig ist
     * extrahiert keys "filename". "size", "script", "state" und "id" aus properties
     * schreibt value in json objekt
     * all keys are mandatory, if one key is missing, whole element is skipped
     * if no files named 'properties' exist, empty json is returned
     * if directory [importDataPath} does not exists (noSuchFileException), empty json is returned
     * TODO make POJOs
     * TODO läuft es auch wenn properties file fehlt?
     *
     * @return Response object with list of meta-data as json
     */
    @Path("get")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUploadedFiles() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode uploaded_files = mapper.createObjectNode();

        String path = prefs.get(PreferenceKey.importDataPath);
        try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
            walk.filter(Files::isDirectory)
                    .filter(path_dir -> !path_dir.equals(Paths.get(path)))
                    .map(java.nio.file.Path::getFileName)
                    .map(java.nio.file.Path::toString)
                    .forEach(name_dir -> {
                        if (importStateManager.checkPropertyFileForIntegrity(name_dir)) {
                            ObjectNode uploaded_file = mapper.createObjectNode();
                            uploaded_file.put(PropertyKey.filename.name(),
                                    importStateManager.getPropertyByKey(name_dir, PropertyKey.filename));
                            uploaded_file.put(PropertyKey.size.name(),
                                    importStateManager.getPropertyByKey(name_dir, PropertyKey.size));
                            uploaded_file.put(PropertyKey.script.name(),
                                    importStateManager.getPropertyByKey(name_dir, PropertyKey.script));
                            uploaded_file.put(PropertyKey.state.name(),
                                    importStateManager.getPropertyByKey(name_dir, PropertyKey.state));
                            uploaded_files.set(importStateManager.getPropertyByKey(name_dir, PropertyKey.id), uploaded_file);
                        }
                    });

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
     * moves uploaded file from /tmp to new folder
     * creates a new properties file in folder with id, filepath, filename, filesize, used script and filestate
     * Meilenstein state wird hinzugefügt "uploaded"
     *
     * @param file:     uploaded binary file
     * @param filename: name of uploaded file (filename cant be extracted from binary?)
     * @param script:   name (id) of script to run verification/import with
     * @return Response with status 201 and uuid of uploaded file
     */
    @Path("upload")
    @POST
    public Response uploadFile(@NotNull @QueryParam("script") String script, @NotNull @QueryParam("filename") String filename, @NotNull File file) {
        try {
            String uuid = UUID.randomUUID().toString();
            String newPath = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid).toString();
            Files.createDirectories(Paths.get(newPath));

            java.nio.file.Path oldFile = Paths.get(file.getAbsolutePath());
            java.nio.file.Path newFile = Paths.get(newPath, filename);
            Files.move(oldFile, newFile);

            importStateManager.createPropertyFile(uuid);
            importStateManager.writePropertyToFile(uuid, PropertyKey.id, uuid);
            importStateManager.writePropertyToFile(uuid, PropertyKey.path, String.valueOf(newFile));
            importStateManager.writePropertyToFile(uuid, PropertyKey.filename, filename);
            importStateManager.writePropertyToFile(uuid, PropertyKey.size, String.valueOf(Files.size(newFile)));
            importStateManager.writePropertyToFile(uuid, PropertyKey.script, script);
            importStateManager.writePropertyToFile(uuid, PropertyKey.uploaded, String.valueOf(System.currentTimeMillis()));
            importStateManager.writePropertyToFile(uuid, PropertyKey.state, ImportState.upload_successful.name());

            LOGGER.log(Level.INFO, "Uploaded file to {0}", newFile.toString());
            return Response.status(Response.Status.CREATED).entity(uuid).build();
        } catch (ValidationException e) {
            LOGGER.log(Level.SEVERE, "QueryParam must not be null", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.toString()).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    /**
     * DELETE request for an uploaded file
     * deletes all files of folder named {uuid} in directory {importDataPath} and then the folder itself
     *
     * @param uuid: uuid of file to delete (corresponds to folder name)
     * @return Response with status 200
     */
    @Path("{uuid}/delete")
    @DELETE
    public Response deleteFile(@NotNull @PathParam("uuid") String uuid) {
        String path = Paths.get(prefs.get(PreferenceKey.importDataPath), uuid).toString();
        try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
            walk.sorted(Comparator.reverseOrder())
                    .map(java.nio.file.Path::toFile)
                    .forEach(File::delete);

            LOGGER.log(Level.INFO, "Deleted file at {0}", path);
            return Response.status(Response.Status.OK).build();
        } catch (ValidationException e) {
            LOGGER.log(Level.SEVERE, "PathParam must not be null", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.toString()).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }
}
