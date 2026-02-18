package org.aktin.dwh.admin.optin;

import lombok.val;
import org.aktin.dwh.admin.optin.model.OptInErrorType;

import javax.ws.rs.ClientErrorException;
import javax.ws.rs.core.Response;

public class ErrorUtils {
    /**
     * Build a web application exception with the given error type and message for front end processing
     * @param status http status code
     * @param type error type enum for machine processing
     * @param message human readable error message
     * @return the built exception
     */
    public static ClientErrorException buildError(Response.Status status, OptInErrorType type, String message) {
        val response = Response.status(status).entity(type).build();
        return new ClientErrorException(message, response);
    }
}
