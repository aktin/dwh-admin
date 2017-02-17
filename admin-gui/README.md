DWH Admin User Interface
========================


No access to secured resources without access token. The call
```
curl http://localhost:8080/aktin/admin/auth/test/secured
```
will return error status 403 unauthorized.

Login to get a security token:
```
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "userA", "password": "passwD"}' http://localhost:8080/aktin/admin/auth/login
```
Remember the returned token UUID.

Use the token to access secured areas:
```
curl -H "Authorization: Bearer fe4798-1d90-41d4-a228-21e891d2bb65" http://localhost:8080/aktin/admin/auth/test/secured
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