package org.aktin.dwh.admin.importer;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.tika.Tika;
import org.junit.Assert;
import org.junit.Test;
import sun.applet.Main;


import javax.ws.rs.core.Response;

public class ImportEndpointTester {


    public void testUpload() throws Exception {
        URL goodUrl = Main.class.getResource("/folder1/folder2/p21testdata");
        File goodFile = new File(goodUrl.toURI());

        FileImportEndpoint fue = new FileImportEndpoint();

        Response r = fue.uploadFile("goodFile", goodFile);
        Assert.assertEquals(500, r.getStatus());
    }

    public void testDelete() throws Exception {
        URL url = Main.class.getResource("/folder1/folder2/p21testdata");
        File file = new File(url.toURI());

        Integer i = file.getPath().lastIndexOf("\\");
        String path = file.getPath().substring(0,i);

        java.nio.file.Path oldFile = Paths.get(file.getAbsolutePath());
        java.nio.file.Path copiedFile = Paths.get(path, file.getName() + "2");
        // additional try block as context manager
        try (OutputStream os = new FileOutputStream(copiedFile.toFile())) { Files.copy(oldFile, os); }

        FileImportEndpoint fue = new FileImportEndpoint();
        Response r = fue.deleteFile(copiedFile.toString());
        Assert.assertEquals(202, r.getStatus());
        r = fue.deleteFile("nopath");
        Assert.assertEquals(409,r.getStatus());
    }

    @Test
    public void testVerify() throws Exception {
        URL url = Main.class.getResource("/folder1/folder3/script.py");
        File file = new File(url.toURI());

        Tika tika = new Tika();
        if (tika.detect(file).contains("python"))
            System.out.println("is a python file!");

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode scripts = mapper.createObjectNode();
        try(BufferedReader br = new BufferedReader(new FileReader(file))) {
            ObjectNode script = mapper.createObjectNode();


            List<String> list = new LinkedList<String>(Arrays.asList("DESC", "VERSION"));


            String line, key, value;
            br.readLine();
            for (int i = 0; i < 2; i++) {
                line = br.readLine();
                key = line.substring(line.indexOf('@') + 1, line.indexOf('='));
                value = line.substring(line.indexOf('=') + 1);

                if (list.contains(key)) {
                    list.remove(key);
                    script.put(key, value);
                }
            }

            System.out.println(list.isEmpty());
            scripts.set(file.getName(), script);

            String path = "C:\\Users\\User\\Desktop";
            try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
                walk.map(java.nio.file.Path::toFile)
                        .sorted(Comparator.reverseOrder())
                        .filter(file1 -> {
                            return file1.getName().contains("a");
                        })
                        .forEach(file1 -> {
                            System.out.println(file1);
                        });
            }
        }
        String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(scripts);
        System.out.println(json);
        Assert.assertEquals(true, true);
    }


    public void testGetFiles() throws Exception {
        String path = "C:\\Users\\User\\IdeaProjects\\dwh-admin\\admin-gui\\src\\test\\resources\\folder1";

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode uploaded_files = mapper.createObjectNode();
        try (Stream<java.nio.file.Path> walk = Files.walk(Paths.get(path))) {
                walk.sorted(Comparator.reverseOrder())
                    .filter(Files::isRegularFile)
                    .map(java.nio.file.Path::toFile)
                    .filter(file -> file.getName().equals("properties"))
                    .forEach(file -> {
                        Properties properties = new Properties();
                        try (FileInputStream input = new FileInputStream(file)) {
                            properties.load(input);
                            ObjectNode uploaded_file = mapper.createObjectNode();

                            System.out.println(properties.containsKey("NAME"));

                            uploaded_file.put("name", properties.getProperty("NAME"));
                            uploaded_file.put("size", properties.getProperty("SIZE"));

                            Set<String> properties_keys = properties.stringPropertyNames();
                            if (properties_keys.contains("IMPORTED"))
                                uploaded_file.put("lastStatus", "import_successful");
                            else if (properties_keys.contains("VERIFIED"))
                                uploaded_file.put("lastStatus", "verification_successful");

                            uploaded_files.set(properties.getProperty("ID"), uploaded_file);
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        }
        String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(uploaded_files);
        System.out.println(json);
        Assert.assertEquals(true, true);
    }

    public void printZip(ZipFile zip) throws IOException {
        Enumeration<? extends ZipEntry> entries = zip.entries();
        while(entries.hasMoreElements()) {
            ZipEntry zipEntry = entries.nextElement();
            System.out.println(zipEntry.getName());
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(zip.getInputStream(zipEntry)));
            String line;
            while((line = bufferedReader.readLine()) != null){
                System.out.println(line);
            }
            bufferedReader.close();
        }
        zip.close();
    }

    public void zipAndSaveFile(File file, String p) throws IOException {
        FileOutputStream fos = new FileOutputStream(p);
        ZipOutputStream zipOut = new ZipOutputStream(fos);
        File fileToZip = file;
        FileInputStream fis = new FileInputStream(file);
        ZipEntry zipEntry = new ZipEntry(fileToZip.getName());
        zipOut.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while((length = fis.read(bytes)) >= 0) {
            zipOut.write(bytes, 0, length);
        }
        zipOut.close();
        fis.close();
        fos.close();
    }
}
