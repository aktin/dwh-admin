(function() {
    var propApp = angular.module('aktin.properties', []);

    propApp.controller('PropertiesController', ['$http', '$scope', function($http, $scope){
        var propApp = this;
        propApp.properties = _.map(properties, function (prop, index, properties){
            prop.inputField = prop.field;
            if (prop.type && prop.type === "timestamp") {
                prop.inputField = "date";
                if (prop.value)
                    prop.value = new Date(+prop.value);
            }
            if (prop.inputField === "number") {
                prop.value = parseInt(prop.value);
            }
            if (prop.valueset) {
                prop.inputField = "select";
            }
            prop.fieldClass = "prpoperty-input-" + prop.name.split('.').join('-');
            prop.template = "layout/input_" + prop.inputField + "_template.html";

            // if (prop.valueset) {
            //     console.log(prop.valueset);
            //     $('.top-'+prop.fieldClass).search({
            //         source: _.map(prop.valueset, function (item, index, list) {
            //             return {title : item};
            //         } ),
            //     });
            // }
            console.log(prop)
            return prop;
        });

        propApp.setValue = function (prop, value) {
            prop.value = value;
        }

        propApp.isSelected = function (prop, value) {
            console.log(value, prop.value === value);
            return prop.value === value;
        }

        propApp.isWriteOnly = function (prop) {
            return prop.right === propertyRights.WO;
        };



    }]);



    var propertyRights = {
        NONE : 0,
        R : 1,
        WO : 2,
        W : 3,
    }

    var properties = [
        {
            name : "tls.keystore.path",
            descr : "Keystore für Key und Zertifikate für TLS",
            field : "text",
            value : "local/secure",
            right : propertyRights.R,
        },
        {
            name : "local.name",
            descr : "Klinikname",
            field : "text",
            value : "Klinikum Oldenburg",
            right : propertyRights.W,
        },
        {
            name : "local.contact.name",
            descr : "Kontaktperson",
            field : "text",
            value : "Herr Oberarzt",
            right : propertyRights.W,
        },
        {
            name : "contact.email",
            descr : "Kontaktemail",
            field : "email",
            value : "oberarzt@oldenburg.de",
            right : propertyRights.W,
        },
        {
            name : "i2b2.project",
            descr : "I2B2 Projekt ID",
            field : "text",
            value : "Demo",
            right : propertyRights.R,
        },
        {
            name : "i2b2.crc.ds",
            descr : "I2B2 Datasource",
            field : "text",
            value : "java:/QueryToolDemoDS",
            right : propertyRights.R,
        },
        {
            name : "i2b2.lastimport",
            descr : "Timestamp des letzten Imports",
            field : "text",
            type : "timestamp",
            value : "1463134191370",
            right : propertyRights.R,
        },
        {
            name : "smtp.server",
            descr : "SMTP Server Adresse",
            field : "text",
            value : "smtp.oldenburg.de",
            right : propertyRights.W,
        },
        {
            name : "smtp.port",
            descr : "SMTP Server Port",
            field : "number",
            value : "495",
            right : propertyRights.W,
        },
        {
            name : "smtp.user",
            descr : "SMTP Server Username",
            field : "text",
            value : "aktinOldb",
            right : propertyRights.W,
        },
        {
            name : "smtp.password",
            descr : "SMTP Server Passwort",
            field : "password",
            value : "securepassword223",
            right : propertyRights.WO,
        },
        {
            name : "smtp.auth",
            descr : "SMTP Server Authentifizierung",
            field : "select",
            right : propertyRights.W,
            valueset : ['SSL', 'Plain', 'TLS', ], // and more
        },
        {
            name : "query.notification.email",
            descr : "Anfrage für eingegangene Queries",
            field : "email",
            value : "oberarzt@oldenburg.de",
            right : propertyRights.W,
        },
        {
            name : "query.result.dir",
            descr : "Ordner für ausgeführten Anfragen",
            field : "text",
            value : "/var/results/",
            right : propertyRights.R,
        },
        {
            name : "exchange.lastcontact",
            descr : "timestamp of last contact to broker via direct connection or received email timestamp",
            field : "text",
            type : "timestamp",
            value : "1463134191370",
            right : propertyRights.R,
        },
        {
            name : "exchange.method",
            descr : "method of contact",
            field : "text",
            value : "https",
            right : propertyRights.W,
            valueset : ['https', 'email'], 
        },
        {
            name : "exchange.https.interval",
            descr : "interval in hours between polling connections to broker",
            field : "text",
            value : "5",
            right : propertyRights.W,
        },
        {
            name : "exchange.https.broker",
            descr : "server name of the AKTIN broker",
            field : "text",
            value : "broker.aktin.uni-oldenburg.de",
            right : propertyRights.W,
        },
        {
            name : "exchange.https.pool",
            descr : "server name of AKTIN pool",
            field : "text",
            value : "pool.aktin.uni-oldenburg.de",
            right : propertyRights.W,
        },
        {
            name : "exchange.inbox.address",
            descr : "email address to receive queries",
            field : "email",
            value : "oberarzt@oldenburg.de",
            right : propertyRights.W,
        },
        {
            name : "exchange.inbox.interval",
            descr : "interval in hours between checking for new emails",
            field : "text",
            value : "oberarzt@oldenburg.de",
            right : propertyRights.W,
        },
        {
            name : "exchange.inbox.port",
            descr : "Exchange Server port",
            field : "number",
            value : "143",
            right : propertyRights.W,
        },
        {
            name : "exchange.inbox.protocol",
            descr : "Exchange Server protocol",
            field : "text",
            value : "imap",
            right : propertyRights.W,
            valueset : ['imap', 'pop3'], 
        },
        {
            name : "exchange.inbox.user",
            descr : "Exchange Server user name",
            field : "text",
            value : "oberarzt",
            right : propertyRights.W,
        },
        {
            name : "exchange.inbox.password",
            descr : "Exchange Server Passwort",
            field : "password",
            value : "securepassword223",
            right : propertyRights.WO,
        },
    ];

})();
