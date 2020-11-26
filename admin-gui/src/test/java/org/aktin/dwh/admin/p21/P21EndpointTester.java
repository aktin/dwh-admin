package org.aktin.dwh.admin.p21;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import org.junit.Assert;
import org.junit.Test;
import sun.applet.Main;


import javax.ws.rs.core.Response;

public class P21EndpointTester {

    @Test
    public void testUpload() throws Exception {
        URL goodUrl = Main.class.getResource("/p21testdata");
        File goodFile = new File(goodUrl.toURI());

        FileUploadEndpoint fue = new FileUploadEndpoint();

        Response r = fue.uploadFile(goodFile);
        Assert.assertEquals(500, r.getStatus());
    }

    @Test
    public void testDelete() throws Exception {
        URL url = Main.class.getResource("/p21testdata");
        File file = new File(url.toURI());

        Integer i = file.getPath().lastIndexOf("\\");
        String path = file.getPath().substring(0,i);

        java.nio.file.Path oldFile = Paths.get(file.getAbsolutePath());
        java.nio.file.Path copiedFile = Paths.get(path, file.getName() + "2");
        // additional try block as context manager
        try (OutputStream os = new FileOutputStream(copiedFile.toFile())) { Files.copy(oldFile, os); }

        FileUploadEndpoint fue = new FileUploadEndpoint();
        Response r = fue.deleteFile(copiedFile.toString());
        Assert.assertEquals(202, r.getStatus());
        r = fue.deleteFile("nopath");
        Assert.assertEquals(409,r.getStatus());
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
