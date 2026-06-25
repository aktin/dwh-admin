package org.aktin.dwh.admin.updater;

/**
 * Interface defining the contract for DWH update management operations.
 *
 * <p>Implementations of this interface encapsulate the environment-specific
 * details of how updates are triggered and monitored,
 * while exposing a stable API that {@link UpdateEndpoint}
 * and other callers depend on.</p>
 */
public interface IUpdateManager {

    void initialize();

    /**
     * Returns whether this implementation is responsible for the current runtime
     * environment.
     * @return {@code true} if this manager should handle updates in the current
     *         environment
     */
    boolean supportsCurrentSystem();

    /**
     * Checks whether the update agent is installed and available in the
     * current environment.
     *
     * @return {@code true} if the update agent is present and operational
     */
    boolean isUpdateAgentInstalled();

    /**
     * Retrieves the current update status, combining version information and
     * the result of the last update attempt.
     *
     * @return an {@link UpdateStatus} object, or {@code null} if no status
     *         information is available yet
     */
    UpdateStatus getUpdateStatus();

    /**
     * Retrieves the update log as text
     *
     * @return the log as a {@link String}, or {@code null} if no log exists
     */
    String getUpdateLog();

    /**
     * Triggers a reload of APT package lists (equivalent to {@code apt-get update}).
     *
     * @return {@code true} if the reload was initiated successfully
     */
    boolean reloadAptPackageLists();

    /**
     * Triggers an upgrade of the DWH Debian package
     * (equivalent to {@code apt-get install <dwh-package>}).
     *
     * @return {@code true} if the update was initiated successfully
     */
    boolean executeDwhUpdate();

    /**
     * Returns whether an update operation is currently running.
     *
     * @return {@code true} if an update is in progress
     */
    boolean isUpdateInProgress();

}
