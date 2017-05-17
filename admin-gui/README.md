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



TODO Webapp
====

jquery needed?

- server communication
- user authentification
- store token
- locale anfragen verwaltung


- PATH aus der Login Maske ausblenden. (per pfeil aktivieren)

-- breadcrumbs


Berichte: Vereinfachen

AKTIN-Monatsbericht März 2017 
Datenstand[Erzeugt]: 2017-04-05 
Zeitraum: 2017-03-01 bis 2017-04-01 
Status: Completed  -- deutsch (Status verstecken bei erfolgreich -- mit download austauschen)
Download: [DownloadIcon]/aktin/admin/rest/report/archive/5

vllt - <a download="something.txt" href="link.txt">asdf</a>​​​​​​​​​​​​​​​​​​​​​​​​​​​

---

Neues Bericht zum Button umziehen, form button für später auch template auswahl



Konfigurationen: 
Beschreibung zum ändern 

properties in tabellenform
3 spalten: Beschreibung - id - wert


------

Anfragen: 

ToDos (aktions required) [standard]
Waiting for user interaction

Übersicht (alle) (aktuelle anfragen) [filter, ...]
currently queued anfragen (requests for later)

Detailansicht einer anfrage


Farbkodierung (grau, rot)

list:
Kurztitel,
Eingang(szeit),
status (eingegangen, Freigabe erforderlich, abgelehnt, wartet auf Auführung, wird ausgeführt, fehlgeschlagen, Freigabe erforderlich, abgelehnt, wird gesendet, abgeschlossen, ... ),
Name + Organization des Erstellers
ist das eine Serie? 


detail view: [bearbeiten nur mit Rechte] 
Abfrageergebnis Anzeigen / Download button (Das Ergebnis der Anfragen können Sie hier herunterladen)
--> action Freigeben (action box)
---- Checkbox Ergebnis der Abfrage vor dem Versenden erneut manuell prüfen und versenden
---- Checkbox (periodisch) Weitere Anfragen aus dieser Serie erneugt zur Freigabe vorlegen 
--> action Ablehnen
---- Textfeld Grund
Kurztitel,
Eingang(szeit),
Zeitraum (scheduled)
Deadline
status 
name / Orga des erstellers
Beschreibung
(periodisch) Weitere Anfragen aus der Serie
request quell text [on request as overlay or second page] 
actionLog der Anfrage (wann angenommen von wem)
passende regeln (Serie) <--- Sliderbutton für abbruch der Serie


actionbox: 
+Freigeben------------------+
| 						  	|
| O Ergebnis ...			|
|							|
| O Serie					|
| 						  	|
| Freigeben				  	|
| 						  	|
+---------------------------+



URLs - REST endpoint in admin gui - request manager (interface, inject) - retrieved request 
/requests/


