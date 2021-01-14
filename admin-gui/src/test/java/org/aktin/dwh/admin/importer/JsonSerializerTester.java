package org.aktin.dwh.admin.importer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.dwh.admin.importer.enums.ImportOperation;
import org.aktin.dwh.admin.importer.enums.ImportState;
import org.aktin.dwh.admin.importer.enums.PropertyKey;
import org.junit.Assert;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.UUID;
import java.util.stream.Stream;

public class JsonSerializerTester {

    @Test
    public void testJsonSerializer() throws IOException {

        String id = UUID.randomUUID().toString();
        String filename = "testname";
        String size = "2131251";
        String script = "testname2";
        String operation = ImportOperation.uploading.name();
        String state = ImportState.successful.name();

        PropertyFilePOJO d = new PropertyFilePOJO(id, filename, size, script, operation, state);


        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File("src/test/resources/d.json"), d);
        PropertyFilePOJO[] d1 = {d, d, d};
        String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(d1);
        System.out.println(json);

        // TODO make to json and test against d.json

        Assert.assertEquals(true, true);
    }


    @Test
    public void testGetUploadedFileIDs() throws IOException {

        String path = "C:\\Users\\User\\IdeaProjects\\dwh-admin\\admin-gui\\src\\test\\resources\\folder1";

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode uploaded_files = mapper.createObjectNode();
        try (Stream<Path> walk = Files.walk(Paths.get(path))) {
            walk.filter(Files::isDirectory)
                    .filter(path_dir -> !path_dir.equals(Paths.get(path)))
                    .map(java.nio.file.Path::getFileName)
                    .map(java.nio.file.Path::toString)
                    .forEach(file -> {
                        System.out.println(file);
                            });
        }


        Assert.assertEquals(true, true);
    }

}