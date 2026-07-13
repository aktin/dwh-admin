package org.aktin.dwh.admin.helper;

import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TcpHelper {

    private static final Logger LOGGER = Logger.getLogger(TcpHelper.class.getName());

    private static final int SOCKET_TIMEOUT = 5000;

    /**
     * This method connects to a tcp port without sending content or keeping the connection alive.
     * @param host: target's network address
     * @param port: target's port to connect to
     * @return operation success status:
     *      - true: successful connection
     *      - 1: thread was interrupted before finishing
     *      - 2: no connection to host, port is not open, connection refused
     */

    // todo: return boolean values instead of int
    public static boolean touch(String host, int port) {
        try (Socket socket = new Socket(host, port)) {
            socket.setSoTimeout(SOCKET_TIMEOUT);
            OutputStream out = socket.getOutputStream();
            out.flush();
            LOGGER.log(Level.INFO, "Socket operation completed on {0}:{1}", new Object[]{host, port});
            return true;
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "I/O error during socket operation on port: " + port, e);
            return false;
        }
    }

}
