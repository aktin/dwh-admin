package org.aktin.dwh.admin.importer;

import org.aktin.dwh.admin.importer.enums.ScriptKey;
import org.aktin.dwh.admin.importer.enums.ScriptMimeValue;

import javax.inject.Inject;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * TODO Comments
 * TODO DO NOT FORGET DWH-API:0.7-SNAPSHOT
 */

@Path("file")
public class FileManagerEndpoint {

    private static final Logger LOGGER = Logger.getLogger(FileManagerEndpoint.class.getName());

    @Inject
    private FileOperationManager fileOperationManager;

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
     * läuft es auch wenn properties file fehlt? -> ja, exception wird geloggt aber flow wird nicht unterbrochen
     *
     * @return Response object with list of meta-data as json
     */

    @Path("get")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<PropertiesFilePOJO> getUploadedFiles() throws IOException {
        ArrayList<PropertiesFilePOJO> list_propertiesPOJOs = new ArrayList<>();
        ArrayList<String> list_uuids = fileOperationManager.getUploadedFileIDs();
        for (String uuid : list_uuids) {
            if (fileOperationManager.checkPropertyFileForIntegrity(uuid)) {
                PropertiesFilePOJO pojo_properties = fileOperationManager.createPropertyPOJO(uuid);
                list_propertiesPOJOs.add(pojo_properties);
            } else {
                LOGGER.log(Level.INFO, "{0} misses some keys", uuid);
            }
        }
        return list_propertiesPOJOs;
    }


    /**
     * POST request for a new file
     * creates a new uuid for the file
     * creates a new folder named {uuid} in directory {importDataPath}
     * moves uploaded file from /tmp to new folder
     * creates a new properties file in folder with id, filepath, filename, filesize, used script and filestate
     * Meilenstein state wird hinzugefügt "uploaded"
     *
     * @param file:        uploaded binary file
     * @param file_name:   name of uploaded file on the client's computer (filename cant be extracted from binary?)
     * @param script_name: name (id) of script to run verification/import with
     * @return Response with status 201 and uuid of uploaded file
     * <p>
     * EXCEPTION for Files.createDirectories and Files.move and Files.size
     */
    @Path("upload")
    @POST
    public Response uploadFile(@NotNull @QueryParam("script") String script_name, @NotNull @QueryParam("filename") String file_name, @NotNull File file) throws IOException {
        if (doesContentTypeMatchScript(file, script_name)) {
            String uuid = UUID.randomUUID().toString();
            String path_newFolder = fileOperationManager.createUploadFileFolder(uuid);
            fileOperationManager.moveUploadFile(file.getAbsolutePath(), path_newFolder, file_name);
            java.nio.file.Path newFile = Paths.get(path_newFolder, file_name);
            fileOperationManager.createUploadFileProperty(uuid, file_name, Files.size(newFile), script_name);

            LOGGER.log(Level.INFO, "Uploaded file to {0}", newFile.toString());
            return Response.status(Response.Status.CREATED).entity(uuid).build();
        } else {
            LOGGER.log(Level.SEVERE, "Type of {0} does not match {1}", new Object[]{file_name, script_name});
            return Response.status(Response.Status.UNSUPPORTED_MEDIA_TYPE).build();
        }
    }

    private boolean doesContentTypeMatchScript(File file, String script_name) throws IOException {
        String script_mime = fileOperationManager.getScriptValueByKey(script_name, ScriptKey.MIMETYPE);
        switch (ScriptMimeValue.valueOf(script_mime)) {
            case zip:
                int[] bytesArray_header = new int[]{0x504B0304, 0x504B0506, 0x504B0708};
                return compareContentBytes(file, bytesArray_header);
            default:
                return false;
        }
    }

    private boolean compareContentBytes(File file, int[] bytesArray) throws IOException {
        RandomAccessFile raf = new RandomAccessFile(file, "r");
        int fileSignature = raf.readInt();
        for (int bytes : bytesArray) {
            if (fileSignature == bytes)
                return true;
        }
        return false;
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
    public Response deleteFile(@NotNull @PathParam("uuid") String uuid) throws IOException {
        String path_deletedFolder = fileOperationManager.deleteUploadFileFolder(uuid);
        LOGGER.log(Level.INFO, "Deleted file at {0}", path_deletedFolder);
        return Response.status(Response.Status.OK).build();
    }
}
