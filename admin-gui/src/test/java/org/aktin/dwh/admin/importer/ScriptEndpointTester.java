package org.aktin.dwh.admin.importer;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.aktin.dwh.admin.importer.enums.PropertyKey;
import org.aktin.dwh.admin.importer.enums.ScriptKey;
import org.aktin.dwh.admin.importer.pojos.PropertiesFilePOJO;
import org.junit.Test;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

//TODO implement integration tests
public class ScriptEndpointTester {

    public void testGetImportScripts() {
        // POSTMAN
    }

    public void testQueueFileVerification() {

    }

    public void testQueueFileImport() {

    }

    public void testCancelFileProcessing() {

    }

    public void testGetFileProcessingStatus() {

    }
}
