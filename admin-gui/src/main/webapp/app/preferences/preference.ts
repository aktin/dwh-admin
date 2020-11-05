/**
 * Created by Xu on 18.05.2017.
 */

export interface PreferenceCategory {
    value: string,
    name: string,
    description: string,
    preferences?: Preference[],
    location?: string,
}
export interface Preference {
    key: string,
    value: string,
    description?: string,
}

export const predefinedPreferenceCategories: PreferenceCategory[] = [
    {
        value : 'i2b2',
        name : 'I2B2',
        description : 'Einstellungen i2b2',
    },
    {
        value : 'local',
        name : 'Lokal',
        description : 'Lokale Einstellungen über den Standort',
    },
    {
        value : 'rscript',
        name : 'R',
        description : 'R Installation',
    },
    {
        value : 'report',
        name : 'Report',
        description : 'Berichtablage',
    },
    {
        value : 'cda',
        name : 'CDA-IDs',
        description : 'Einstellungen der CDA-IDs',
    },
    {
        value : 'study',
        name : 'Studienspezifische Einstellungen',
        description : 'Studienspezifische Einstellungen',
    },
    {
        value : 'wildfly',
        name : 'Wildfly',
        description : 'Konfiguration Wildlfy',
    },
    {
        value : 'broker',
        name : 'Broker',
        description : 'Einstellungen Broker',
    },
    {
        value : '',
        name : 'Sonstige',
        description : 'nicht zugeordnete Einstellungen',
    },
];

export const predefinedPreferences = {
    'local.ou': 'Name der Abteilung',
    'local.o': 'Name des Klinikums',
    'local.c': 'Staat',
    'local.s': 'Bundesland',
    'local.l': 'Ort',
    'local.cn': 'Name der DWH Instanz',
    'local.tz': 'Zeitzone',
    'local.email': 'Empfänger-E-Mail für Berichte und Meldungen',


    'report.data.path': 'Ablageort der Berichte',
    'report.temp.path': 'Temporärer Ablageort der Berichte während der Generierung',
    'report.archive.path': 'Ablageort der archivierten Berichte',

    'cda.patient.root.preset': 'Root-Nummer bei Verwendung der Patientennummer (Patient)',
    'cda.encounter.root.preset': 'Root-Nummer bei Verwendung der Episodennummer (Encounter)',
    'cda.billing.root.preset': 'Root-Nummer bei Verwendung der Fallnummer (Billing)',

    'study.id.reference': 'Patientenreferenz, die im Consent-Manager zur Identifizierung von Patienten verwendet wird (Patient, Encounter oder Billing)',
    'study.id.patient.label': 'Textfeld-Label im Consent-Manager bei Verwendung der Patientennummer',
    'study.id.encounter.label': 'Textfeld-Label im Consent-Manager bei Verwendung der Episodennummer',
    'study.id.billing.label': 'Textfeld-Label im Consent-Manager bei Verwendung der Fallnummer',
    'study.id.separator': 'Trennzeichen für Root-Nummer und Erweiterung (wird verwendet, wenn keine Root-Nummer hinterlegt ist)',

    'broker.data.path': 'Ablageort der eingegangenen Daten vom Broker',
    'broker.uris': 'AKTIN Broker Url',
    'broker.intervals': 'Heartbeat Update Interval',
    'broker.keys': 'Broker-Key zur Identifizierung',


    'db.datasource': 'AKTIN Datasource im Wildfly-Server',


    'email.session': 'Konfigurationen der AKTIN Email',
    'email.replyto': 'Rückantwort für AKTIN Berichte',


    'wildfly.management.url': 'URL der Wildfly-Konfiguration',
    'wildfly.management.user': 'Wildfly Nutzer',
    'wildfly.management.password': 'Wildfly Passwort',


    'i2b2.project': 'i2b2 Projekt ID',
    'i2b2.service.pm': 'i2b2 PM-Service',
    'i2b2.service.domain': 'i2b2 Projekt Domäne',
    'i2b2.datasource.crc': 'i2b2 Datasource',
    'i2b2.lastimport': 'Zeitstempel des letzten Imports',


    'rscript.binary': 'Link zum R-Script Binary',
};
