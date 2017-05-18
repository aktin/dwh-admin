/**
 * Created by Xu on 18.05.2017.
 */
export interface PrefCategory {
    value: string,
    name: string,
    descr: string,
    location?: string,
}
export class Preference {
    constructor(
        private name: string,
        private descr?: string,
        private value?: string,
        private category?: PrefCategory,
    ) {}
}

export const predefinedPrefCats: PrefCategory[] = [
    {
        value : 'i2b2',
        name : 'I2B2',
        descr : 'i2b2 Einstellungen',
    },
    {
        value : 'local',
        name : 'Lokal',
        descr : 'Lokale Einstellungen über den Standort',
    },
    {
        value : 'rscript',
        name : 'R',
        descr : 'R Installation',
    },
    {
        value : 'report',
        name : 'Report',
        descr : 'Bericht Ablage',
    },
    {
        value : 'wildfly',
        name : 'Wildfly',
        descr : 'Wildlfy Konfiguration',
    },
    {
        value : 'broker',
        name : 'Broker',
        descr : 'Broker Einstellungen',
    },
    {
        value : '',
        name : 'Sonstige',
        descr : 'nicht zugeordnete Einstellungen',
    },
];

export const predefinedPrefs: Preference[] = [
    new Preference('local.ou', 'Abteilungsname'),
    new Preference('local.o', 'Klinikname'),
    new Preference('local.c', 'Staat'),
    new Preference('local.s', 'Bundesland'),
    new Preference('local.l', 'Ort'),
    new Preference('local.cn', 'DWH Instanz Name'),
    new Preference('local.tz', 'Zeitzone'),
    new Preference('local.email', 'Empfänger-E-Mail für Berichte und Meldungen'),


    new Preference('report.data.path', 'Ablageort der Berichte'),
    new Preference('report.temp.path', 'Temporärer Ablageort der Berichte während der Generierung'),
    new Preference('report.archive.path', 'Ablageort der archivierten Berichte'),


    new Preference('broker.data.path', 'Ablageort der eingegangene Daten vom Broker'),
    new Preference('broker.data.path', 'Ablageort der archivierten Daten vom Broker'),
    new Preference('broker.uris', 'Aktin Broker Url'),
    new Preference('broker.intervals', 'Heartbeat Interval'),
    new Preference('broker.keys', 'Brokerkey zur Indentifizierung'),


    new Preference('db.datasource', 'Aktin Datasource in Wildfly'),


    new Preference('email.session', 'Aktin Email Konfigurationen'),
    new Preference('email.replyto', 'Aktin Berichte Reply to Mail'),


    new Preference('wildfly.management.url', 'Wildfly Konfigurations URL'),
    new Preference('wildfly.management.user', 'Wildfly User'),
    new Preference('wildfly.management.password', 'Wildfly Passwort'),


    new Preference('i2b2.project', 'I2B2 Projekt ID'),
    new Preference('i2b2.service.pm', 'I2B2 PMService Lokation'),
    new Preference('i2b2.service.domain', 'I2B2 Projekt Domaine'),
    new Preference('i2b2.datasource.crc', 'I2B2 Datasource'),
    new Preference('i2b2.lastimport', 'Timestamp des letzten Imports'),


    new Preference('rscript.binary', 'R Skript Binary Link'),
];
