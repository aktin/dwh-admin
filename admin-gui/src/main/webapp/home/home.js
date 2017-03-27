(function() {
    var app = angular.module('aktin.home', [
        'aktin.users',
    ]);

    app.controller('HomeController', ['$http', 'userFactory',
    	function($http, userFactory){
	        var app = this;
	        app.properties = {
	        	routing : 'properties',
	        	name : 'Properties',
	        };

	        var curUser = false;

	        var getUser = function () {
	        	if (! curUser) {
	        		curUser = userFactory.user();
	        	}
	        	return curUser;
	        }

	        app.user = getUser();

        	app.hasUser = function () {
	        	if (userFactory.hasUser() ) {
	        		if (! curUser) 
	        			getUser();
	        		return true;
	        	}
	        	return false;
        	}

        	app.isAdmin = function () {
        		if (userFactory.hasUser() && userFactory.checkRole(curUser, ['admin'])) {
	        		return true;
	        	}
	        	return false;
        	}
    	}
    ]);

})();