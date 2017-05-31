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

- Container anpassen und Design erzeugen
- Use loshdash instead of underscore
- use webpack instead of systemjs
- use ahead of time compilation

- locale anfragen verwaltung


-- breadcrumbs


Reports:
New Report als Formular mit anfang und end datumsfelder [als popup]
    [default letzten Monat wenn es klappt] mit zeitspann von letzter monat
    oder letzter monat button wenn nicht

    template auswahl mit rest call von allen templates [default monatsbericht (aktuell einziger)]


5. Wenn man angemeldet ist, dann ist der Reiter "Status" leer. Hier kannst du den Inhalt von /aktin/admin/rest/import-summary anzeigen.
6. Konfiguration wird nicht angezeigt. Fehler: aktinPropFile undefined. 
Der REST-Aufruf im Hintergrund ist aber erfolgreich.
7. Benutzerverwaltung sehe ich auch nichts.






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


