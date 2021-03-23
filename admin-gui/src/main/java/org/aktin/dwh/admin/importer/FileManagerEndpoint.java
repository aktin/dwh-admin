package org.aktin.dwh.admin.importer;

import org.aktin.dwh.admin.auth.Secured;
import org.aktin.importer.FileOperationManager;
import org.aktin.importer.ImportDeleteManager;
import org.aktin.importer.ScriptOperationManager;
import org.aktin.importer.pojos.ScriptLog;

import javax.inject.Inject;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Properties;
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

    @Inject
    private ImportDeleteManager importDeleteManager;

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
    public List<Properties> getUploadedFiles() {
        return fileOperationManager.getPropertiesFiles();
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
    public Properties getUploadedFile(@NotNull @PathParam("uuid") String uuid) {
        return fileOperationManager.getPropertiesFile(uuid);
    }

    /**
     * POST request for a new file
     * creates a new uuid for the file
     * creates a new folder named {uuid} in directory {importDataPath}
     * moves uploaded file from /tmp to new folder
     * creates a new properties file in folder
     *
     * @param id_script id of corresponding processing script
     * @param name_file original name of file
     * @param file      binary file to upload
     * @return Response with status 201 and uri of uploaded file
     * @throws IOException if error occurs during creation of directory, moving of file or Files.size(newFile)
     */
    @Secured
    @POST
    public Response uploadFile(@NotNull @QueryParam("scriptId") String id_script, @NotNull @QueryParam("filename") String name_file, @NotNull File file) throws IOException {
        String uuid = UUID.randomUUID().toString();
        String path_newFolder = fileOperationManager.createUploadFileFolder(uuid);
        fileOperationManager.moveUploadFile(file.getAbsolutePath(), path_newFolder, name_file);
        java.nio.file.Path newFile = Paths.get(path_newFolder, name_file);
        fileOperationManager.createNewPropertiesFile(uuid, name_file, Files.size(newFile), id_script);
        fileOperationManager.createScriptLogsInCache(uuid);
        LOGGER.log(Level.INFO, "Uploaded file to {0}", newFile.toString());
        return Response.status(Response.Status.CREATED).entity(uuid).build();
    }

    /**
     * DELETE request for an uploaded file
     * deletes all files inside folder named {uuid} in directory {importDataPath} and then the folder itself
     * if file was previously imported into database, all imported data is also deleted
     *
     * @param uuid universally unique id of file to delete
     * @throws IOException for errors during Files.walk and Files.delete operation
     */
    @Secured
    @Path("{uuid}")
    @DELETE
    public void deleteFile(@NotNull @PathParam("uuid") String uuid) throws IOException {
        importDeleteManager.deleteImportedDataFromDB(uuid);
        fileOperationManager.removeScriptLogs(uuid);
        String path_deletedFolder = fileOperationManager.deleteUploadFileFolder(uuid);
        LOGGER.log(Level.INFO, "Deleted files of {0}", path_deletedFolder);
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
}
