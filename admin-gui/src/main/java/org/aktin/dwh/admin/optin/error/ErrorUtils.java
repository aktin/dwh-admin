package org.aktin.dwh.admin.optin.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.logging.Logger;

public class ErrorUtils {
    public static Logger log = Logger.getLogger(ErrorUtils.class.getName());

    /**
     * Build a web application exception with the given error type and message for front end processing
     * @param status http status code
     * @param type error type enum for machine processing
     * @param message human readable error message
     * @return the built exception
     */
    public static Response buildErrorResponse(Response.Status status, OptInErrorType type, String message) {
        log.warning(message);

        return Response.status(status).type(MediaType.APPLICATION_JSON_TYPE).entity(new ErrorModel(type)).build();
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    private static class ErrorModel {
        private OptInErrorType detail;
    }
}
