package org.aktin.dwh.admin.p21;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipException;

/**
 * TODO Comments
 *
 */
@Path("file")
public class FileUploadEndpoint {

    private static final Logger LOGGER = Logger.getLogger(FileUploadEndpoint.class.getName());
    private static String UPLOAD_PATH = "/var/lib/aktin/";

    @Context
    private SecurityContext security;

    /**
     * checks if uploaded file is a zip file
     * if yes, saves file to UPLOAD_PATH with additional .zip ending
     *
     * @param file: uploaded zip object to save in UPLOAD_PATH
     * @return Response with status 'created' if successfully saved, otherwise 500, or 415 if file was not a zip file
     * @throws IOException
     */
    @Path("upload")
    @POST
    public Response uploadFile(File file) {
        try {
            RandomAccessFile raf = new RandomAccessFile(file, "r");
            int fileSignature = raf.readInt();
            if (! (fileSignature == 0x504B0304 || fileSignature == 0x504B0506 || fileSignature == 0x504B0708))
                throw new ZipException();

            java.nio.file.Path oldFile = Paths.get(file.getAbsolutePath());
            java.nio.file.Path newFile = Paths.get(UPLOAD_PATH, file.getName() + ".zip");

            // additional try block as context manager
            try (OutputStream os = new FileOutputStream(newFile.toFile())) { Files.copy(oldFile, os); }

            LOGGER.log(Level.INFO, "Saved ZIP file to " + newFile.toString());
            return Response.status(Response.Status.CREATED).entity(newFile.toString()).build();
        } catch (ZipException e) {
            LOGGER.log(Level.SEVERE, "MEDIA_TYPE is not ZIP", e);
            return Response.status(Response.Status.UNSUPPORTED_MEDIA_TYPE).entity("UPLOAD FAILED").build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("UPLOAD FAILED").build();
        }
    }


}