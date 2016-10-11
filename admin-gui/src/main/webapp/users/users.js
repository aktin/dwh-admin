(function() {
    var usersApp = angular.module('aktin.users', [
    		'aktin.communicate'
    	]);

    var getUserNumber = 6;

    usersApp.factory('userFactory', [ 'CommServer',
        function(CommServer) {

            userHasRole = function (user, roles) {
            	// some or every?
            	if (roles.length === 0) return true;
            	if (!user) 
                    //*/ @@DEBUG@@ 
                    return true;
                    /*/
                    return false;
                    //*/
	        	return _.every(roles, function (role) {
	        		return _.contains(user.roles, role);
	        	});
            };

            userDummyCheckLogin = function (loginData) {
            	CommServer.users.auth(loginData);
            	if (!loginData || ! loginData.username || ! loginData.password)
            		return false;
            	getUserNumber = _.findIndex (dummyUsers, function (user) {
            		return user.username == loginData.username && user.password == loginData.password;
            	});
            	if (typeof getUserNumber === "undefined")
            		return false;
            	return true;
            };

            userLogout = function (userData) {
            	return CommServer.users.logout(userData);
            };

    		getdummyuser = function () {
    			var param = getUserNumber;
    			if (param < dummyUsers.length && param >= 0) 
    				return dummyUsers[param];
    			return null;
            };

            return {
            	login : userDummyCheckLogin,
            	logout : userLogout, 
                checkRole: userHasRole, 
                user: getdummyuser, 
            };
        }
    ]);

    usersApp.controller('UsersController', ['$http', '$state', '$filter', 'userFactory', function($http, $state, $filter, userFactory){
        var usersApp = this;

        usersApp.loginUsername = "i2b2";
        usersApp.loginPassword = "demouser";

        // login
        usersApp.login = function ($event) {
        	if (userFactory.login({username : usersApp.loginUsername, password : usersApp.loginPassword})) {
        		$state.reload();
        	};

        };


        // user untermenu 
        usersApp.currentSubmenu = "";

        usersApp.setSubMenu = function (sub) {
        	// $scope.$apply(function(){ //let angular know the changes   
            	usersApp.currentSubmenu = sub.value;
            // });
            
        };

        usersApp.isSet = function (val) {
        	if (val === "all")
        		return true;
        	if (_.indexOf(subMenuVals, val) >= 0) {
        		return val === usersApp.currentSubmenu;
        	}
        	return usersApp.currentSubmenu === "";
        }

	    usersApp.subMenus = [
	    	{
	    		name : "Alle Nutzer",
	    		value : "",
	    	},
	    	{
	    		name : "Profil",
	    		value : "profile",
	    	},
	    	{
	    		name : "Neuer User",
	    		value : "new",
	    	},
	    ];
	    var subMenuVals = _.map(usersApp.subMenus, function (sub) {
	    	return sub.value;
	    });

	    usersApp.users = dummyUsers;

    }]);

    var dummyUsers = [
    	{
    		_id : "0110100",
    		username : "admin",
    		password : "adminsecure",
    		roles : [
    			'ADMIN',
				'AKTIN_A',
				'USER',
				'MANAGER',
				'DATA_OBFSC',
				'DATA_AGG',
				'DATA_PROT',
				'DATA_DEID',
				'DATA_LDS',
				'EDITOR',
    		],
    	},
    	{
    		_id : "0110101",
    		username : "i2b2",
    		password : "demouser",
    		roles : [
    			'ADMIN',
				'USER',
				'MANAGER',
				'DATA_OBFSC',
				'DATA_AGG',
				'DATA_PROT',
				'DATA_DEID',
				'DATA_LDS',
				'EDITOR',
    		],
    	},
    	{
    		_id : "0110102",
    		username : "demo",
    		password : "demouser",
    		roles : [
				'USER',
				'DATA_AGG',
				'AKTIN_A',
    		],
    	},
    	{
    		_id : "0110103",
    		username : "demo0",
    		password : "demouser",
    		roles : [
    		],
    	},
    ];


})();
