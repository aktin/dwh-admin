package org.aktin.dwh.admin.optin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.val;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.text.MessageFormat;

@Getter
@AllArgsConstructor
public class OptInError {
    public int status;
    public String message;
    public ErrorType type;

    /**
     * Build a web application exception with the given error type and message for front end processing
     * @param status http status code
     * @param type error type enum for machine processing
     * @param message human readable error message
     * @return the built exception
     */
    public static WebApplicationException buildError(Response.Status status, ErrorType type, String message) {
        val response = Response.status(status).entity(new OptInError(status.getStatusCode(), message, type)).build();
        return new WebApplicationException(message, response);
    }

    /**
     * Build a web application exception with the given error type and message.
     * @param status http status code
     * @param type error type enum for machine processing
     * @param message human readable error message
     * @param params variable parameters for the message (see {@link MessageFormat})
     * @return the built exception
     */
    public static WebApplicationException buildError(Response.Status status, ErrorType type, String message, Object... params) {
        message = MessageFormat.format(message, params);
        return buildError(status, type, message);
    }
}
