package org.aktin.dwh.admin.updater;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import javax.inject.Qualifier;

/**
 * <p>This annotation helps CDI/injection container to distinguish beans.
 * A bean using this annotation is marked as EnvironmentSpecific and can
 * be later autowired with every other EnvironmentSpecific-bean.</p>
 */
@Qualifier
@Retention(RUNTIME)
@Target({TYPE, FIELD, PARAMETER})
public @interface EnvironmentSpecific {
}