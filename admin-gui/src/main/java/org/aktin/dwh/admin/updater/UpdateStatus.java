package org.aktin.dwh.admin.updater;

import lombok.Data;

/**
 * Represents the status of a DWH update operation, containing information about versions, success status, and timestamps from both result and info
 * property files.
 * <p>
 * The status includes:
 * <ul>
 *   <li>Success status of the update operation</li>
 *   <li>Timestamp of when the update was performed</li>
 *   <li>Currently installed version</li>
 *   <li>Candidate version for update</li>
 *   <li>Timestamp of version information</li>
 * </ul>
 */
@Data
public class UpdateStatus {

    private boolean success;
    private String lastUpdateTime;
    private String installedVersion;
    private String candidateVersion;
    private String lastCheckTime;

}
