package org.aktin.dwh.admin.updater;

/**
 * Represents the status of a DWH update operation, containing information about versions, success status, and timestamps from both result and info
 * property files.
 * The status includes:
 *   - Success status of the update operation
 *   - Timestamp of when the update was performed
 *   - Currently installed version
 *   - Candidate version for update
 *   - Timestamp of version information
 */
public class UpdateStatus {

  private boolean success;
  private String lastUpdateTime;
  private String installedVersion;
  private String candidateVersion;
  private String lastCheckTime;

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setLastUpdateTime(String lastUpdateTime) {
    this.lastUpdateTime = lastUpdateTime;
  }

  public String getLastUpdateTime() {
    return lastUpdateTime;
  }

  public void setInstalledVersion(String installedVersion) {
    this.installedVersion = installedVersion;
  }

  public String getInstalledVersion() {
    return installedVersion;
  }

  public void setCandidateVersion(String candidateVersion) {
    this.candidateVersion = candidateVersion;
  }

  public String getCandidateVersion() {
    return candidateVersion;
  }

  public void setLastCheckTime(String lastCheckTime) {
    this.lastCheckTime = lastCheckTime;
  }

  public String getLastCheckTime() {
    return lastCheckTime;
  }
}
