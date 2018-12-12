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
        description : 'i2b2 Einstellungen',
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
        description : 'Bericht Ablage',
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
        description : 'Wildlfy Konfiguration',
    },
    {
        value : 'broker',
        name : 'Broker',
        description : 'Broker Einstellungen',
    },
    {
        value : '',
        name : 'Sonstige',
        description : 'nicht zugeordnete Einstellungen',
    },
];

export const predefinedPreferences = {
    'local.ou': 'Abteilungsname',
    'local.o': 'Klinikname',
    'local.c': 'Staat',
    'local.s': 'Bundesland',
    'local.l': 'Ort',
    'local.cn': 'DWH Instanz Name',
    'local.tz': 'Zeitzone',
    'local.email': 'Empfänger-E-Mail für Berichte und Meldungen',


    'report.data.path': 'Ablageort der Berichte',
    'report.temp.path': 'Temporärer Ablageort der Berichte während der Generierung',
    'report.archive.path': 'Ablageort der archivierten Berichte',

    'cda.patient.root.preset': 'Root-Nummer bei Verwendung der Patientennummer (Patient)',
    'cda.encounter.root.preset': 'Root-Nummer bei Verwendung der Episodennummer (Encounter)',
    'cda.billing.root.preset': 'Root-Nummer bei Verwendung der Fallnummer (Billing)',

    'study.id.reference': 'Patientenreferenz, die im Consent-Manager zur Identifizierung von Patienten verwendet wird. Erlaubte Werte: Patient, Encounter, Billing',
    'study.id.patient.label': 'Textfeld-Label im Consent-Manager bei Verwendung der Patientennummer',
    'study.id.encounter.label': 'Textfeld-Label im Consent-Manager bei Verwendung der Episodennummer',
    'study.id.billing.label': 'Textfeld-Label im Consent-Manager bei Verwendung der Fallnummer',
    'study.id.separator': 'Trennzeichen für Root und Extension. Wird verwendet, wenn keine Root hinterlegt ist.',

    'broker.data.path': 'Ablageort der eingegangene Daten vom Broker',
    'broker.uris': 'Aktin Broker Url',
    'broker.intervals': 'Heartbeat Interval',
    'broker.keys': 'Brokerkey zur Indentifizierung',


    'db.datasource': 'Aktin Datasource in Wildfly',


    'email.session': 'Aktin Email Konfigurationen',
    'email.replyto': 'Aktin Berichte Reply to Mail',


    'wildfly.management.url': 'Wildfly Konfigurations URL',
    'wildfly.management.user': 'Wildfly User',
    'wildfly.management.password': 'Wildfly Passwort',


    'i2b2.project': 'I2B2 Projekt ID',
    'i2b2.service.pm': 'I2B2 PMService Lokation',
    'i2b2.service.domain': 'I2B2 Projekt Domaine',
    'i2b2.datasource.crc': 'I2B2 Datasource',
    'i2b2.lastimport': 'Timestamp des letzten Imports',


    'rscript.binary': 'R Skript Binary Link',
};
