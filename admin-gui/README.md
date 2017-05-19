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


- Use loshdash instead of underscore
- use webpack instead of systemjs
- use ahead of time compilation

- server communication
- user authentification
- store token
- locale anfragen verwaltung

- PATH aus der Login Maske ausblenden. (per pfeil aktivieren)

-- breadcrumbs

- prefs : show as table

3. Die URLs werden falsch überschrieben: Wenn ich auf /aktin/admin/ gehe, dann ändert sich die nach dem Laden die URL in /aktin/admin/home was es nicht gibt!
4. In url.service steht eine feste serverUrl=http://134.106.36.86:8087.  Das sollte standardmäßig leer sein bzw. im Frontend versteckt konfigurierbar.
5. Wenn man angemeldet ist, dann ist der Reiter "Status" leer. Hier kannst du den Inhalt von /aktin/admin/rest/import-summary anzeigen.
6. Konfiguration wird nicht angezeigt. Fehler: aktinPropFile undefined. 
Der REST-Aufruf im Hintergrund ist aber erfolgreich.
7. Benutzerverwaltung sehe ich auch nichts.




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


