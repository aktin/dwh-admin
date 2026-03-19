package org.aktin.dwh.admin.optin.validation;

/**
 * Marker interface used to distinguish validation groups for creating or updating
 * patient entries or related data in a system.
 *
 * This interface is intended for use with validation annotations where different
 * groups are specified to apply context-specific validation rules. It is commonly
 * utilized in conjunction with javax.validation annotations and the ConvertGroup
 * mechanism.
 */
public interface CreateOrUpdateGroup {
}
