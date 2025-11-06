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

    public static WebApplicationException buildError(Response.Status status, ErrorType type, String message) {
        val response = Response.status(status).entity(new OptInError(status.getStatusCode(), message, type)).build();
        return new WebApplicationException(message, response);
    }

    /**
     *
     * @param status
     * @param type
     * @param message
     * @param params
     * @return
     */
    public static WebApplicationException buildError(Response.Status status, ErrorType type, String message, Object... params) {
        message = MessageFormat.format(message, params);
        return buildError(status, type, message);
    }
}
