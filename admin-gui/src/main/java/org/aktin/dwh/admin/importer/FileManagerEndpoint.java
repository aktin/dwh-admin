package org.aktin.dwh.admin.importer;

import org.aktin.importer.FileOperationManager;
import org.aktin.importer.ScriptOperationManager;

import javax.inject.Inject;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

@Path("file")
public class FileManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(FileManagerEndpoint.class.getName());

    @Inject
    private FileOperationManager fileOperationManager;

    @Inject
    private ScriptOperationManager scriptOperationManager;

    @Context
    private SecurityContext security;

    /**
     * GET request for "properties"-File of all uploaded files detected by fileOperationManager
     * Each item contains id, name, size in bytes, corresponding script and current state and operation of
     * corresponding file (see PropertiesFile in generic-file-importer)
     *
     * @return List of uploaded file data
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<PropertiesFile> getUploadedFiles() {
        return fileOperationManager.getProperties();
    }

    /**
     * GET request for a single "properties"-File of uploaded file
     *
     * @param uuid universally unique id of uploaded file
     * @return PropertiesFile object with content of corresponding "properties"-File
     */
    @Path("{uuid}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public PropertiesFile getUploadedFile(@NotNull @PathParam("uuid") String uuid) {
        return fileOperationManager.getProperties(uuid);
    }

    /**
     * POST request for a new file
     * creates a new uuid for the file
     * creates a new folder named {uuid} in directory {importDataPath}
     * moves uploaded file from /tmp to new folder
     * creates a new properties file in folder
     *
     * @param script_id id of corresponding processing script
     * @param file_name original name of file
     * @param file      binary file to upload
     * @return Response with status 201 and uri of uploaded file
     * @throws IOException if error occurs during creation of directory, moving of file or Files.size(newFile)
     */
    @POST
    public Response uploadFile(@NotNull @QueryParam("scriptId") String script_id, @NotNull @QueryParam("filename") String file_name, @NotNull File file) throws IOException {
        String uuid = UUID.randomUUID().toString();
        String path_newFolder = fileOperationManager.createUploadFileFolder(uuid);
        java.nio.file.Path newFile = Paths.get(path_newFolder, file_name);
        fileOperationManager.moveUploadFile(file.getAbsolutePath(), path_newFolder, file_name);
        fileOperationManager.createUploadFileProperties(uuid, file_name, Files.size(newFile), script_id);
        LOGGER.log(Level.INFO, "Uploaded file to {0}", newFile.toString());
        return Response.status(Response.Status.CREATED).location(URI.create(uuid)).build();
    }

    /**
     * DELETE request for an uploaded file
     * deletes all files inside folder named {uuid} in directory {importDataPath} and then the folder itself
     *
     * @param uuid universally unique id of file to delete
     * @throws IOException for errors during Files.walk and Files.delete operation
     */
    @Path("{uuid}")
    @DELETE
    public void deleteFile(@NotNull @PathParam("uuid") String uuid) throws IOException {
        String path_deletedFolder = fileOperationManager.deleteUploadFileFolder(uuid);
        LOGGER.log(Level.INFO, "Deleted file at {0}", path_deletedFolder);
    }

    /**
     * GET request for logs created during script processing of uploaded file
     * only two log files exist per file (stdError and stdOutput)
     *
     * @param uuid universally unique id of file
     * @return List with script log objects
     */
    @Path("{uuid}/log")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ScriptLog> getUploadedFileLogs(@NotNull @PathParam("uuid") String uuid) {
        return fileOperationManager.getScriptLogs(uuid);
    }

    /**
     * DELETE request for all script logs of uploaded file
     *
     * @param uuid universally unique id of file
     * @throws IOException for error during delete operation
     */
    @Path("{uuid}/log")
    @DELETE
    public void deleteUploadedFileLog(@NotNull @PathParam("uuid") String uuid) {
        String path_deletedLog = fileOperationManager.deleteScriptLog(uuid);
        LOGGER.log(Level.INFO, "Deleted log file at {0}", path_deletedLog);
    }
}
