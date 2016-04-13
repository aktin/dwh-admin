DWH Configuration backend
=========================

Stores configuration parameters in relational database tables (SQL).

Other Java modules can use the interface with dependency injection.

Rapid testing using jetty plugin
--------------------------------
Run `mvn jetty:run`. It will then watch src/main/webapp and target/classes for changes.

Testing
-------

Test the database scripts with jdbc:hsqldb:mem:tempdb... 
e.g. similar to `http://stackoverflow.com/questions/11396219/init-database-for-test-purpose-during-maven-test-phase`

