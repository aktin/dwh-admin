package org.aktin.dwh.admin.helper;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TcpHelper {

    private static final Logger LOGGER = Logger.getLogger(TcpHelper.class.getName());

    private static final int CONNECT_TIMEOUT_MS = 5000;

    /**
     * Opens and immediately closes a TCP connection to signal the target, without sending content.
     * @param host target's network address
     * @param port target's port to connect to
     * @return - {@code true} if the connection was established,
     *         - {@code false} if the host is unknown, the connection was refused or timed out
     */
    public static boolean touch(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), CONNECT_TIMEOUT_MS);
            LOGGER.log(Level.INFO, "Socket operation completed on {0}:{1}", new Object[]{host, port});
            return true;
        } catch (IOException e) {
            LOGGER.log(Level.WARNING, "I/O error during socket operation on " + host + ":" + port, e);
            return false;
        }
    }

}
