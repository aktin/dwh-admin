Data Warehouse Administration 
=============================

Eclipse IDE
-----------

To load the project into the Eclipse IDE
the following steps are recommended:

- Get the current `Eclipse IDE for Java Developers` 
  from https://eclipse.org/downloads/ . No need to 
  use the EE version.

- Get the latest AKTIN source code. Get maven.

- In the `aktin` directory run `mvn clean install`

- Then run `mvn eclipse:eclipse`.

- Open Eclipse and specify the `admin/dwh-admin`
  directory as workspace location (and leave the welcome
  screen)

- In the top menu, choose `File/Import../General/Existing Projects into Workspace` 
  and choose the `admin/dwh-api` directory. You should be able to add `dwh-api` to
  the workspace.

- Repeat the previous step and choose the `admin/dwh-admin` directory to import
  the other admin projects.

- Important: To get direct dependencies between the projects, run again 
  `mvn eclipse:eclipse` in the `aktin` folder. Then in Eclipse, right click on 
  each top level project in the package explorer and choose `Refresh`.
  
- You are ready to go!

TODO Unit tests using only JAXRS and CDI:
For Weld-CDI see http://memorynotfound.com/java-se-unit-testing-cdi-junit-jboss-weld-se/
try to combine JAX-RS with above Weld

Additional notes in German
--------------------------

Administrationsoberfläche für Standortkoordinator.

Erste Version:
- Erster Aufruf:
-- Zertifikatserzeugung bei Angabe von C,S,L,O,OE,CN,EMAIL
-- Senden des CSR per Email
-- Integration der Zertifikatsantwort.

- Zeigt Art der Kontaktaufnahme mit Broker an (HTTPS Polling, EMail, HTTPS Push)
- Zeigt Status zu letztem Kontakt mit Broker an.
- Zeigt Zeitpunkt für nächsten planmäßigen Kontakt mit Broker an.

- Zeigt Übersicht/Liste aller Anfragen an (ohne Interaktion).

- Neue Anfragen können genehmigt oder abgelehnt werden per Link aus Email.



Finale Version:
- Alle Informationen zu jeder Anfrage anzeigen.
- Vergangene Anfragen anzeigen.
- Emailadresse für Benachrichtigung ändern.
- Manuelle Kontrolle von Ergebnissen aktivieren (nicht bei geplanten Anfragen)
- Manuelle Kontrolle von Ergebnissen durchführen

