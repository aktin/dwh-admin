package org.aktin.dwh.admin.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.Preferences;
import org.aktin.dwh.PreferenceKey;
import org.apache.tika.Tika;

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
public class FileImportEndpoint {

    private static final Logger LOGGER = Logger.getLogger(FileImportEndpoint.class.getName());
    private static final Tika tika = new Tika();

    @Inject
    private Preferences prefs;

    @Context
    private SecurityContext security;

    /**
     * POST request for a new file
     * creates a new uuid for the file
     * creates a new folder named {uuid} in directory {importDataPath}
     * creates a new properties file in folder with ID, SIZE, IMPORTSTATE, NAME, PATH and TYPE
     * moves uploaded file from /tmp to new folder
     *
     * @param file: uploaded file to save
     * @param name: name of uploaded to file (to avoid using formParam)
     * @return Response with status 201 and uuid of uploaded file
     */
    @Path("upload/{name}")
    @POST
    public Response uploadFile(@PathParam("name") String name, File file) {
        try {
            String uuid = UUID.randomUUID().toString();

            Properties properties = new Properties();
            properties.setProperty("SIZE", String.valueOf(file.length()));

            String newPath = prefs.get(PreferenceKey.importDataPath) + "/" + uuid;
            Files.createDirectories(Paths.get(newPath));

            java.nio.file.Path oldFile = Paths.get(file.getAbsolutePath());
            java.nio.file.Path newFile = Paths.get(newPath, file.getName());
            Files.move(oldFile, newFile);

            properties.setProperty(String.valueOf(ImportState.UPLOADED), String.valueOf(System.currentTimeMillis()));
            properties.setProperty("ID", uuid);
            properties.setProperty("NAME", name);
            properties.setProperty("PATH", newFile.toString());
            properties.setProperty("TYPE", tika.detect(newFile));

            File file_properties = new File(newPath + "/properties");
            try (FileOutputStream fileOut = new FileOutputStream(file_properties)) {
                properties.store(fileOut, "");
            }

            LOGGER.log(Level.INFO, "Uploaded file to " + newFile.toString());
            return Response.status(Response.Status.CREATED).entity(uuid).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
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
    @Path("verify/{uuid}")
    @POST
    public Response verifyFile(@PathParam("uuid") String uuid) {
        try {
            String path = prefs.get(PreferenceKey.importDataPath) + "/" + uuid + "/properties";

            Properties properties = new Properties();
            try (FileInputStream input = new FileInputStream(path)) {
                properties.load(input);
            }
            try (FileOutputStream output = new FileOutputStream(path)) {
                properties.setProperty(String.valueOf(ImportState.VERIFIED), String.valueOf(System.currentTimeMillis()));
                properties.store(output, "");
            }

            LOGGER.log(Level.INFO, "Verified file at " + path);
            return Response.status(Response.Status.OK).build();
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "File could not be found", e);
            return Response.status(Response.Status.CONFLICT).entity(e.toString()).build();
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
    @Path("delete/{uuid}")
    @DELETE
    public Response deleteFile(@PathParam("uuid") String uuid) {
        try {
            String path = prefs.get(PreferenceKey.importDataPath) + "/" + uuid;
            try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
                    walk.sorted(Comparator.reverseOrder())
                        .map(java.nio.file.Path::toFile)
                        .forEach(File::delete);
            }

            LOGGER.log(Level.INFO, "Deleted file at " + path);
            return Response.status(Response.Status.OK).build();
        } catch (FileNotFoundException e) {
            LOGGER.log(Level.SEVERE, "File could not be found", e);
            return Response.status(Response.Status.CONFLICT).entity(e.toString()).build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
        }
    }

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
     *
     * @return Response object with list of meta-data as json
     */
    @Path("import/scripts")
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
                                List<String> list = new LinkedList<String>(Arrays.asList("DESC", "VERSION"));
                                ObjectNode script = mapper.createObjectNode();

                                String line, key, value;
                                br.readLine();
                                for (int i = 0; i < 2; i++) {
                                    try {
                                        line = br.readLine();
                                        key = line.substring(line.indexOf('@') + 1, line.indexOf('='));
                                        value = line.substring(line.indexOf('=') + 1);
                                        if (list.contains(key)) {
                                            list.remove(key);
                                            script.put(key, value);
                                        }
                                    } catch (StringIndexOutOfBoundsException e) {
                                        break;
                                    } catch (NullPointerException e) {
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
                return Response.status(Response.Status.OK).build();
            } catch (IOException e) {
                LOGGER.log(Level.SEVERE, "An Exception was thrown", e);
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.toString()).build();
            }
    }

    /**
     * GET request for a list of uploaded files
     * iterates recursively through directory {importDataPath} to catch all regular files named 'properties'
     * extracts keys named "ID", "NAME", "SIZE" and "IMPORTED"/"VERIFIED"
     * writes values in a json in format { ID : { NAME, SIZE, IMPORTED/VERIFIED } } and returns it
     *
     * all keys are mandatory, if one key is missing, whole element is skipped
     * if no files named 'properties' exist, empty json is returned
     * if directory [importDataPath} does not exists (noSuchFileException), empty json is returned
     *
     * @return Response object with list of meta-data as json
     */
    @Path("upload/files")
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

                                if( properties.containsKey("ID") &&
                                    properties.containsKey("NAME") &&
                                    properties.containsKey("SIZE") &&
                                    ( properties.containsKey("IMPORTED") || properties.containsKey("VERIFIED") )) {

                                    ObjectNode uploaded_file = mapper.createObjectNode();
                                    Set<String> properties_keys = properties.stringPropertyNames();
                                    uploaded_file.put("name", properties.getProperty("NAME"));
                                    uploaded_file.put("size", properties.getProperty("SIZE"));
                                    if (properties_keys.contains("IMPORTED"))
                                        uploaded_file.put("lastState", "import_successful");
                                    else if (properties_keys.contains("VERIFIED"))
                                        uploaded_file.put("lastState", "verification_successful");
                                    uploaded_files.set(properties.getProperty("ID"), uploaded_file);
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
            return Response.status(Response.Status.OK).build();
        } catch (IOException e) {
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
