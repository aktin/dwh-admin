package org.aktin.dwh.admin.importer;

import java.util.HashMap;

public class TestThread implements Runnable {

    private HashMap<String, String> map;
    public boolean exit = false;

    public TestThread(HashMap<String, String> map) {
        this.map = map;
    }

    @Override
    public void run() {
        System.out.println("thread started");
        synchronized (map.get("A")) {
            System.out.println("THREAD HAS A");
            map.remove("A");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            exit = true;
        }
        System.out.println("THREAD LOST A");
        System.out.println("thread finished");
    }
}
