(function() {
    var commApp = angular.module('aktin.communicate', []);

    commApp.factory('CommServer', ['$q', '$timeout', '$rootScope', '$state', 
    	function ($q, $timeout, $rootScope, $state) {
    		// communication service to the server. 
			var send2server = function (url, dataObj) {
				// full url bsp http://localhost:8080/aktin/admin/auth/login
				// login example 
				// curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"xyz"}' http://localhost:8080/aktin/admin/auth/login

				var baseUrl = "/aktin/admin";
				var baseLink = "http://localhost:8080";

				var fullUrl = baseLink+baseUrl+url;

				console.log(url, fullUrl, dataObj);
				return true;
			}

    		return {
    			// user
			    // -auth
			    // -list
			    // -create
			    // -edit
    			users : {
    				// login user
    				auth : function (data) {
    					console.log("commserver user auth with ", data);
    					var url = "/auth/login";
    					if (!data || !data.username || !data.password) // data obj null or no username or password
    						return false;

    					// link aktin/admin/auth/login
    					// {"username":"admin","password":"xyz"}
    					return send2server(url, {
	    						username : data.username,
	    						password : data.password,
	    					});
	    			},
	    			// logout user
	    			logout : function (data) {

    					console.log("commserver user logout with ", data);
    					var url = "/auth/logout";
    					if (!data)
    						data = {};

    					return send2server(url, {
	    						username : data.username,
	    						token : data.token,
	    					});
	    			},
	    			// check the users auth and roles
	    			check : function (data) {
    					console.log("commserver user check roles with ", data);
    					var url = "/auth/check";
	    				return send2server (url, {
	    					username : data.username,
	    					token : data.token,
	    					requiredRoles : data.requiredRoles,
	    				});
	    			},
	    			// change user
	    			update : function () {
    					console.log("commserver user check roles with ", data);
    					var url = "/auth/check";
	    				return send2server (url, {
	    					username : data.username,
	    					token : data.token,
	    					requiredRoles : data.requiredRoles,
	    				});

	    			},
	    			// list users
	    			list : function () {

	    			},
	    			// new user
	    			create : function () {

	    			},
    			},
    			// logs
			    // -list
			    // -delete
			    logs : {
			    	list : function () {

			    	},
			    	delete : function () {

			    	},
			    },
			    // preferences
			    // -list
			    // -edit
			    // -view
			    preferences : {
			    	// aktin/admin/prefs
			    	list : function () {

			    	},
			    	edit : function () {

			    	},
			    },
    		};
    	}
    ]);

})();
