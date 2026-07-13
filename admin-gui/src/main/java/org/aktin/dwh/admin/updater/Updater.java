package org.aktin.dwh.admin.updater;

/**
 * Interface defining the contract for DWH update management operations.
 *
 * <p>Implementations of this interface encapsulate the environment-specific
 * details of how updates are triggered and monitored (e.g. Debian host vs.
 * Docker container), while exposing a stable API that {@link UpdateEndpoint}
 * and other callers depend on.</p>
 *
 * <p>Follows the Dependency Inversion Principle: high-level components such as
 * {@link UpdateEndpoint} depend on this abstraction rather than on any concrete
 * implementation.</p>
 */
interface Updater {

    void initialize();

    /**
     * Returns whether this implementation is responsible for the current runtime
     * environment.
     *
     * <p>This method is used by {@link UpdaterManager} to select the
     * correct implementation at application startup.</p>
     *
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
     * Retrieves the textual content of the update operation log.
     *
     * @return the log as a {@link String}, or {@code null} if no log exists
     */
    String getUpdateLog();

    /**
     * Compares installed application version with latest available version.
     *
     * @return - {@code true} if check operation was successful. Does not mean a update is available.
     *         - {@code false} if check operation could not be executed. Does not mean installed version is latest available.
     */
    boolean refreshUpdateStatus();

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
