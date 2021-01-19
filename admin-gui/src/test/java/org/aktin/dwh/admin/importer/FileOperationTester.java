package org.aktin.dwh.admin.importer;

import org.junit.Test;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.concurrent.locks.ReentrantLock;

public class FileOperationTester {

    @Test
    public void testLocks() throws InterruptedException {
        System.out.println("main started");

        HashMap<String, String> map = new HashMap<>();
        map.put("A", "1");
        map.put("B", "2");
        map.put("C", "3");
        System.out.println(map.toString());

        TestThread test = new TestThread(map);
        synchronized (map.get("A")) {
            System.out.println("MAIN HAS A");
            new Thread(test).start();
            Thread.sleep(2000);
        }
        System.out.println("MAIN LOST A");


        while (!test.exit) {
            Thread.sleep(1000);
            System.out.println("A sleeps");
        }
        System.out.println(map.toString());
        System.out.println("main finished");
    }
}
