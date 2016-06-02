DWH Configuration backend
=========================

Stores configuration parameters in relational database tables (SQL).

Other Java modules can use the interface with dependency injection.

Rapid testing using jetty plugin
--------------------------------
Run `mvn -Pjetty jetty:run`. It will then watch src/main/webapp and target/classes for changes. Just modify any source files and any
changes will be integrated within seconds.

Post
```
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "userA", "password": "passwD"}' http://localhost:8080/aktin/admin/auth/login
```

Testing
-------

Test the database scripts with jdbc:hsqldb:mem:tempdb... 
e.g. similar to `http://stackoverflow.com/questions/11396219/init-database-for-test-purpose-during-maven-test-phase`



ADMIN GUI WebApp
----------------

using Angular JS, Semantic UI

AngularJS:
    - with routing via stateprovider,
    - 