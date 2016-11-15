(function() {
    var usersApp = angular.module('aktin.users', [
    	]);

    var getUserNumber = 6;

    usersApp.factory('userFactory', ['$http', 'storageHelper',
        function($http, storageHelper) {

            var curUser = {};

            userHasRole = function (user, requiredRoles) {
                // console.log(user, requiredRoles)
            	if (requiredRoles.length === 0) return true;
            	if (!user) 
                    /*/ @@DEBUG@@ 
                    return true;
                    /*/
                    return false;
                    //*/
	        	return _.every(requiredRoles, function (role) {
	        		return _.contains(user.roles, role);
	        	});
            };

            userLogin = function (loginData, callback) {
                // login to the server
                if (!loginData.username || !loginData.password) // data obj null or no username or password
                    return false;

                curUser.username = loginData.username;
                storageHelper.to('user.username', loginData.username);

                $http.post(getUrl("/auth/login"), {
                    username : loginData.username,
                    password : loginData.password,
                }).then(function (response) {
                    storageHelper.to('user.token', response.data);
                    curUser.token = response.data;

                    $http.get(getUrl("/auth/has/admin")).then(function (response) {
                        curUser.isAdmin = response.data;
                        if (!curUser.roles)
                            curUser.roles = [];
                        curUser.roles.push("admin");

                        callback();
                    })
                });

            }

            userLogout = function (userData) {
                curUser = {};
                storageHelper.delete('user.token');
            	return false;
            };

    		getUser = function () {
                return curUser;
            };

            hasUser = function () {
                return Object.prototype.hasOwnProperty(curUser);
            }

            return {
            	login : userLogin,
            	logout : userLogout, 
                checkRole: userHasRole, 
                user: getUser, 
                hasUser : hasUser,
            };
        }
    ]);

    usersApp.controller('UsersController', ['$http', '$state', '$filter', 'userFactory', function($http, $state, $filter, userFactory){
        var usersApp = this;

        usersApp.loginUsername = "i2b2";
        usersApp.loginPassword = "demouser";

        // login
        usersApp.login = function ($event) {
        	userFactory.login(
                {username : usersApp.loginUsername, password : usersApp.loginPassword},
                function () {
                    $state.reload();
                }
            )
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
