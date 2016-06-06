(function() {
    var app = angular.module('aktin.home', []);

    app.controller('HomeController', [function($http){
        var app = this;
        app.properties = {
        	routing : 'properties',
        	name : 'Properties',
        };

    }]);

})();