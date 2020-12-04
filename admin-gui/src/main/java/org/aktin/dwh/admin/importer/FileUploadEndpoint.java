package org.aktin.dwh.admin.importer;

import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.apache.tika.Tika;

import javax.activation.MimetypesFileTypeMap;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.Comparator;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;
import java.util.zip.ZipException;

/**
 * TODO Comments
 *
 */

// TODO DO NOT FORGET DWH-API:0.7-SNAPSHOT
@Path("file")
public class FileUploadEndpoint {

    private static final Logger LOGGER = Logger.getLogger(FileUploadEndpoint.class.getName());
    private static final Tika tika = new Tika();

    @Inject
    private Preferences prefs;

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
            String uuid = UUID.randomUUID().toString();

            Properties properties = new Properties();
            properties.setProperty("ID", uuid);
            properties.setProperty("SIZE", String.valueOf(file.length()));
            properties.setProperty(String.valueOf(ImportState.UPLOADED), String.valueOf(System.currentTimeMillis()));

            String newPath = prefs.get(PreferenceKey.importDataPath) + "/" + uuid;
            Files.createDirectories(Paths.get(newPath));

            java.nio.file.Path oldFile = Paths.get(file.getAbsolutePath());
            java.nio.file.Path newFile = Paths.get(newPath, file.getName());
            Files.move(oldFile, newFile);

            properties.setProperty("PATH", newFile.toString());
            properties.setProperty("TYPE", tika.detect(newFile));



            File file_properties = new File(newPath + "/properties");
            try (FileOutputStream fileOut = new FileOutputStream(file_properties)) {
                properties.store(fileOut, "");
            }

            LOGGER.log(Level.INFO, "Moved uploaded file to " + newFile.toString());
            return Response.status(Response.Status.CREATED).entity(uuid).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

    @Path("delete/{uuid}")
    @DELETE
    public Response deleteFile(@PathParam("uuid") String uuid) {
        try{
            String path = prefs.get(PreferenceKey.importDataPath) + "/" + uuid;
            try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
                    walk.sorted(Comparator.reverseOrder())
                        .map(java.nio.file.Path::toFile)
                        .forEach(File::delete);
            }

            LOGGER.log(Level.INFO, "Deleted file at " + path);
            return Response.status(Response.Status.ACCEPTED).build();
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.CONFLICT).entity(e.toString()).build();
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
}