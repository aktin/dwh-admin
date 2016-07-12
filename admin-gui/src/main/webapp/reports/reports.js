(function() {
    var reportApp = angular.module('aktin.reports', []);

    reportApp.controller('ReportsController', ['$http', '$scope', '$filter', '$timeout', function($http, $scope, $filter, $timeout){
        var reportApp = this;

        reportApp.reports = dummyreports;



    }]);

    dummyreports = [
        {
            name : "Beschreibung der Patienten",
            svg : "geschlecht.png",
            description : "Geschlechtsverteilung",
        },
        {
            name : "Beschreibung der Patienten",
            svg : "age.svg",
            description : "Altersverteilung",
        },
        {
            name : "Fallzahlen",
            svg : "admit.wd.svg",
            description : "Fallzahlen nach Wochentag",
        },
        {
            name : "Fallzahlen",
            svg : "admit.h.svg",
            description : "Fallzahlen nach Aufnahme-Uhrzeit",
        },
        {
            name : "Fallzahlen",
            svg : "admit.hwd.svg",
            description : "Fallzahlen nach Wochentag und Aufnahmezeit",
        },
    ]

})();
