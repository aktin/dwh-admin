package org.aktin.dwh.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

/**
 * Registers Jackson's {@link JavaTimeModule} to ensure stable JSON serialization of Java time types
 * (e.g. {@link java.time.Instant}).
 *
 * <p>Without this provider, {@code Instant} may be serialized as a structured object, e.g.
 * {@code {"timestamp":{"epochSecond":1772184155,"nano":153000000}}}.
 *
 * <p>With this provider, {@code Instant} is serialized as a single scalar value, e.g.
 * {@code {"timestamp":1772184155.153000000}}.
 */
@Provider
public class JavaTimeMapperProvider implements ContextResolver<ObjectMapper> {
    private final ObjectMapper mapper;

    public JavaTimeMapperProvider() {
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return mapper;
    }
}
