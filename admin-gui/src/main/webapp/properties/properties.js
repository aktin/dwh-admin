(function() {
    var propApp = angular.module('aktin.properties', []);


    propApp.controller('PropertiesController', ['$http', '$scope', '$filter', '$timeout', function($http, $scope, $filter, $timeout){
        var propApp = this;

        propApp.debugout = "";

        var filename = "properties/testprops.properties";

        // TODO get smtp from standalone.xml!!
        // propertyrights : PROPERTY

        propApp.properties=predefinedCategories;
        propApp.flatProps={};
        // $http.get(filename) 
        //     .then(
        //         function (data) {
        //             propApp.debugout += data.data;
        //             //propApp.flatProps = parseData(data.data, filename);
        //             // console.log(data.data, propApp.properties)
        //         }, function (error) {
        //             alert('error');
        //     });

        $http.get(getUrl("prefs")).then(function (response) {
            parseDataObj(response.data, '/opt/wildlfy/standalone/configuration/aktin.properties');
            console.log(response.data, propApp.properties)
        });

        // zum ändern in opt wildlfy ansagen

        var parseDataObj = function (dataObj, location) {
            var keys = Object.keys(dataObj);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = dataObj[key];

                var cat = key.split('.')[0];

                var propObj = {}

                if (key in predifnedProperties) {
                    propObj = predifnedProperties[key];
                } else {
                    propObj.name = key;
                }
                propObj.value = value;
                propObj.location = location;

                if (! (cat in predefinedCategories)) {
                    cat = "";
                } else {
                    predefinedCategories[cat].location = location;
                }

                if (! ('props' in propApp.properties[cat])) {
                    propApp.properties[cat].props = [];
                } 
                propApp.properties[cat].props.push(propObj);
            }
        }
        var parseData = function (dataString, location) {
            var dataObj = {};
            var dataLines = dataString.split('\n');

            for (var i = 0; i < dataLines.length; i++) {
                if (dataLines[i].charAt(0) === '#' || dataLines[i].indexOf('=') < 0)
                    continue;
                var num = dataLines[i].indexOf('=');
                var key = dataLines[i].slice(0,num);
                var value = dataLines[i].slice(num+1);
                dataObj[key]=value;

                var cat = key.split('.')[0];

                var propObj = {}

                if (key in predifnedProperties) {
                    propObj = predifnedProperties[key];
                } else {
                    propObj.name = key;
                }
                propObj.value = value;
                propObj.location = location;

                if (! (cat in predefinedCategories)) {
                    cat = "";
                } else {
                    predefinedCategories[cat].location = location;
                }

                if (! ('props' in propApp.properties[cat])) {
                    propApp.properties[cat].props = [];
                } 
                propApp.properties[cat].props.push(propObj);
            }

            return dataObj;
        }



    }]);


    var predefinedCategories = {
        "tls" : {
            value : "tls",
            name : "TLS",
            descr : "",
            location : "",
        }, 
        "i2b2" : {
            value : "i2b2",
            name : "I2B2",
            descr : "i2b2 Einstellungen",
            location : "",
        }, 
        "local" : {
            value : "local",
            name : "Lokal",
            descr : "Lokale Einstellungen über den Standort",
            location : "",
        }, 
        "smtp" : {
            value : "smtp",
            name : "SMTP",
            descr : "EMail Einstellungen",
            location : "",
        }, 
        "query" : {
            value : "query",
            name : "Anfragen",
            descr : "Einstellungen für zentrale Anfragen",
            location : "",
        }, 
        "exchange" : {
            value : "exchange",
            name : "Exchange",
            descr : "",
            location : "",
        }, 
        "rscript" : {
            value : "rscript",
            name : "R",
            descr : "R Installation",
            location : "",
        },
        "" : {
            value : "",
            name : "Sonstige",
            descr : "nicht zugeordnete Einstellungen",
            location : "",
        }, 
    };

    var predifnedProperties = {
        "tls.keystore.path" : 
        {
            name : "tls.keystore.path",
            descr : "Keystore für Key und Zertifikate für TLS",
        },
        "local.name" : 
        {
            name : "local.name",
            descr : "Klinikname",
        },
        "local.contact.name" : 
        {
            name : "local.contact.name",
            descr : "Kontaktperson",
        },
        "local.contact.email" : 
        {
            name : "local.contact.email",
            descr : "Kontaktemail",
        },
        "i2b2.project" : 
        {
            name : "i2b2.project",
            descr : "I2B2 Projekt ID",
        },
        "i2b2.crc.ds" : 
        {
            name : "i2b2.crc.ds",
            descr : "I2B2 Datasource",
        },
        "i2b2.lastimport" : 
        {
            name : "i2b2.lastimport",
            descr : "Timestamp des letzten Imports",
        },
        "smtp.server" : 
        {
            name : "smtp.server",
            descr : "SMTP Server Adresse",
        },
        "smtp.port" : 
        {
            name : "smtp.port",
            descr : "SMTP Server Port",
        },
        "smtp.user" : 
        {
            name : "smtp.user",
            descr : "SMTP Server Username",
        },
        "smtp.password" : 
        {
            name : "smtp.password",
            descr : "SMTP Server Passwort",
        },
        "smtp.auth" : 
        {
            name : "smtp.auth",
            descr : "SMTP Server Authentifizierung",
        },
        "query.notification.email" : 
        {
            name : "query.notification.email",
            descr : "Anfrage für eingegangene Queries",
        },
        "query.result.dir" : 
        {
            name : "query.result.dir",
            descr : "Ordner für ausgeführten Anfragen",
        },
        "exchange.lastcontact" : 
        {
            name : "exchange.lastcontact",
            descr : "timestamp of last contact to broker via direct connection or received email timestamp",
        },
        "exchange.method" : 
        {
            name : "exchange.method",
            descr : "method of contact",
        },
        "exchange.https.interval" : 
        {
            name : "exchange.https.interval",
            descr : "interval in hours between polling connections to broker",
        },
        "exchange.https.broker" : 
        {
            name : "exchange.https.broker",
            descr : "server name of the AKTIN broker",
        },
        "exchange.https.pool" : 
        {
            name : "exchange.https.pool",
            descr : "server name of AKTIN pool",
        },
        "exchange.inbox.address" : 
        {
            name : "exchange.inbox.address",
            descr : "email address to receive queries",
        },
        "exchange.inbox.interval" : 
        {
            name : "exchange.inbox.interval",
            descr : "interval in hours between checking for new emails",
        },
        "exchange.inbox.port" : 
        {
            name : "exchange.inbox.port",
            descr : "Exchange Server port",
        },
        "exchange.inbox.protocol" : 
        {
            name : "exchange.inbox.protocol",
            descr : "Exchange Server protocol",
        },
        "exchange.inbox.user" : 
        {
            name : "exchange.inbox.user",
            descr : "Exchange Server user name",
        },
        "exchange.inbox.password" : 
        {
            name : "exchange.inbox.password",
            descr : "Exchange Server Passwort",
        },
    }

})();
