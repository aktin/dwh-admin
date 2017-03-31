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
        propApp.aktinPropFile = "/opt/wildlfy/standalone/configuration/aktin.properties";
        $http.get(getUrl("prefs")).then(function (response) {
            parseDataObj(response.data, '/opt/wildlfy/standalone/configuration/aktin.properties');
            // console.log(response.data, propApp.properties)
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
                    propApp.properties[cat].props = {};
                } 
                propApp.properties[cat].props[propObj.name] = propObj;
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
            }
            parseDataObj (dataObj, location);
            return dataObj;
        }
    }]);


    var predefinedCategories = {
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

        "rscript" : {
            value : "rscript",
            name : "R",
            descr : "R Installation",
            location : "",
        },        
        "report" : {
            value : "report",
            name : "Report",
            descr : "Bericht Ablage",
            location : "",
        },   
        "wildfly" : {
            value : "wildfly",
            name : "Wildfly",
            descr : "Wildlfy Konfiguration",
            location : "",
        },   
        "broker" : {
            value : "broker",
            name : "Broker",
            descr : "Broker Einstellungen",
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

        "local.ou" : 
        {
            name : "local.ou",
            descr : "Abteilungsname",
        },
        "local.o" : 
        {
            name : "local.o",
            descr : "Klinikname",
        },
        "local.c" : 
        {
            name : "local.c",
            descr : "Staat",
        },
        "local.s" : 
        {
            name : "local.s",
            descr : "Bundesland",
        },
        "local.l" : 
        {
            name : "local.l",
            descr : "Ort",
        },
        "local.cn" : 
        {
            name : "local.cn",
            descr : "DWH Instanz Name",
        },
        "local.tz" : 
        {
            name : "local.tz",
            descr : "Zeitzone",
        },
        "local.email" : 
        {
            name : "local.email",
            descr : "Empfänger-E-Mail für Berichte und Meldungen",
        },


        "report.data.path" : 
        {
            name : "report.data.path",
            descr : "Ablageort der Berichte",
        },
        "report.temp.path" : 
        {
            name : "report.temp.path",
            descr : "Temporärer Ablageort der Berichte während der Generierung",
        },
        "report.archive.path" : 
        {
            name : "report.archive.path",
            descr : "Ablageort der archivierten Berichte",
        },


        "broker.data.path" : 
        {
            name : "broker.data.path",
            descr : "Ablageort der eingegangene Daten vom Broker",
        },
        "broker.archive.path" : 
        {
            name : "broker.data.path",
            descr : "Ablageort der archivierten Daten vom Broker",
        },
        "broker.uris" : 
        {
            name : "broker.uris",
            descr : "Aktin Broker Url",
        },
        "broker.intervals" : 
        {
            name : "broker.intervals",
            descr : "Heartbeat Interval",
        },
        "broker.keys" : 
        {
            name : "broker.keys",
            descr : "Brokerkey zur Indentifizierung",
        },


        "db.datasource" : 
        {
            name : "db.datasource",
            descr : "Aktin Datasource in Wildfly",
        },


        "email.session" : 
        {
            name : "email.session",
            descr : "Aktin Email Konfigurationen",
        },
        "email.replyto" : 
        {
            name : "email.replyto",
            descr : "Aktin Berichte Reply to Mail",
        },


        "wildfly.management.url" : 
        {
            name : "wildfly.management.url",
            descr : "Wildfly Konfigurations URL",
        },
        "wildfly.management.user" : 
        {
            name : "wildfly.management.user",
            descr : "Wildfly User",
        },
        "wildfly.management.password" : 
        {
            name : "wildfly.management.password",
            descr : "Wildfly Passwort",
        },


        "i2b2.project" : 
        {
            name : "i2b2.project",
            descr : "I2B2 Projekt ID",
        },
        "i2b2.service.pm" : 
        {
            name : "i2b2.service.pm",
            descr : "I2B2 PMService Lokation",
        },
        "i2b2.service.domain" : 
        {
            name : "i2b2.service.domain",
            descr : "I2B2 Projekt Domaine",
        },
        "i2b2.datasource.crc" : 
        {
            name : "i2b2.datasource.crc",
            descr : "I2B2 Datasource",
        },
        "i2b2.lastimport" : 
        {
            name : "i2b2.lastimport",
            descr : "Timestamp des letzten Imports",
        },


        "rscript.binary" : 
        {
            name : "rscript.binary",
            descr : "R Skript Binary Link",
        },




    }

})();
