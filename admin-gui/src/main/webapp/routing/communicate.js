(function() {
    var commApp = angular.module('aktin.communicate', []);

    commApp.factory('CommServer', ['$q', '$timeout', '$rootScope', '$state', 
    	function ($q, $timeout, $rootScope, $state) {
    		// communication service to the server. 
			var send2server = function () {

			}

    		return {
    			// user
			    // -auth
			    // -list
			    // -create
			    // -edit
    			users : {
    				// login user
    				auth : function () {

	    			},
	    			// check the users auth and roles
	    			check : function () {

	    			},
	    			// change user
	    			update : function () {

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
			    	list : function () {

			    	},
			    	edit : function () {

			    	},
			    },
    		};
    	}
    ]);