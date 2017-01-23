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
                curUser.isLogin = true;
                storageHelper.to('user.username', loginData.username);

                $http.post(getUrl("/auth/login"), {
                    username : loginData.username,
                    password : loginData.password,
                }).then(function (response) {
                    storageHelper.to('user.token', response.data);
                    curUser.token = response.data;
                    delete curUser.isLogin;
                    userAddRole ('USER');
                    userIsAdmin(callback);
                    
                });

            }
            // USER, admin, REPORT, LOGS, QUERIES, PROPERTIES
            userAddRole = function (role) {
                if (!curUser.roles)
                    curUser.roles = [];
                if (curUser.roles.indexOf(role) < 0)
                    curUser.roles.push(role);
            }

            userIsAdmin = function (callback) {
                $http.get(getUrl("/auth/has/admin")).then(function (response) {
                    curUser.isAdmin = response.data;
                    
                    userAddRole ('admin');
                    console.log(curUser)
                    if (callback) {
                        callback();
                    }
                })
            }

            /*            
            userCheckRole = function (role, callback) {
                $http.get(getUrl("/auth/has/"+role)).then(function (response) {
                    if (role === "admin")
                        curUser.isAdmin = response.data;
                    userAddRole (role);
                    console.log(curUser)
                    if (callback) {
                        callback();
                    }
                })
            }*/


            userLogout = function (userData) {
                curUser = {};
                console.log('logout clear user')
                storageHelper.delete('user.username');
                storageHelper.delete('user.token');
            	return false;
            };


            hasUser = function () {
                // console.log(curUser, !curUser.token , curUser.token !== null , curUser.token !== "")
                if ( (curUser.token && curUser.token !== null && curUser.token !== "")
                    && (curUser.username && curUser.username !== null && curUser.username !== "") ) {
                    console.log('has user')
                    return true;
                }
                console.log('no user')
                return false;
            };

            getUser = _.throttle(function () {
                if (!hasUser()) {

                    // there is no user available. get user from localstorage if there is one stored.userFactory
                    if (storageHelper.from('user.token') && storageHelper.from('user.username')) {
                        curUser.token = storageHelper.from('user.token');
                        curUser.username = storageHelper.from('user.username');
                        console.log("get user from storage", curUser)
                        // can user login? get user right USER
                        
                        curUser.isLogin = true;
                        $http.get(getUrl("/auth/check/")).then(function success(response) {
                            delete curUser.isLogin;
                            userAddRole ('USER');
                            userIsAdmin();
                        },
                        function error(response) {
                            delete curUser.isLogin;
                            curUser = {};
                            console.log('outdated clear user')
                            storageHelper.delete('user.username');
                            storageHelper.delete('user.token');

                            console.log(response)
                        })
                    } else {
                        if (! curUser.isLogin) {
                            console.log('clear user', curUser)
                            curUser = {};
                            storageHelper.delete('user.username');
                            storageHelper.delete('user.token');
                        } else {
                            console.log('wait for login');
                        }
                    }
                }
                return curUser;
            }, 300);

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
