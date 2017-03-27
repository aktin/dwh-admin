(function() {
	var commApp = angular.module('aktin.communicate', []);

	commApp.factory('CommServer', ['$q', '$timeout', '$rootScope', '$state', '$http', 
		function ($q, $timeout, $rootScope, $state, $http) {
			// communication service to the server. 
			var send2server = function (method, url, dataObj, callback) {
				// full url bsp http://localhost:8080/aktin/admin/auth/login
				// login example 
				// curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"xyz"}' http://localhost:8080/aktin/admin/auth/login
				/**
				 * token=`curl -H "Content-Type: application/json" -s -X POST -d '{"username":"i2b2","password":"demouser"}' http://localhost:8080/aktin/admin/auth/login`
				 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users
				 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users/roles
				 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users/demo/roles
				 * curl -s -H "Authorization: Bearer $token" -X DELETE http://localhost:8080/aktin/admin/users/demo/roles/Bamboo
				 * curl -s -H "Authorization: Bearer $token" -X PUT http://localhost:8080/aktin/admin/users/demo/roles/Super
				 * curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users/demo/roles
				 */

				var fullUrl = getUrl(url);

				//return true;

				var requestObj = {
					method: method,
					url : fullUrl,
					data : dataObj,
				}
				console.log(method, url, fullUrl, dataObj, requestObj, callback);

				$http(requestObj).then(function(response) { 
						console.log("response: ", response); 
						callback(response)
					}
				);
				var isAdmin;
				//$http.get("/aktin/admin/auth/has/admin").then(function(response){ isAdmin = response.data; })
				//$http.delete("/aktin/admin/users/demo")
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
						// curl -H "Content-Type: application/json" -s -X POST -d '{"username":"i2b2","password":"demouser"}' http://localhost:8080/aktin/admin/auth/login
						// returns token 
						console.log("commserver user auth with ", data);
						var url = "login";
						if (!data || !data.username || !data.password) // data obj null or no username or password
							return false;

						// link aktin/admin/auth/login
						// {"username":"admin","password":"xyz"}
						return send2server(
							'POST',
							url, 
							{
								username : data.username,
								password : data.password,
							},
							function (response) {
								console.log('this is in auth callback, ', response);
							});
					},
					// logout user
					// logout : function (data) {

					// 	console.log("commserver user logout with ", data);
					// 	var url = "/auth/logout";
					// 	if (!data)
					// 		data = {};

					// 	return send2server(url, {
					// 			username : data.username,
					// 			token : data.token,
					// 		});
					// },
					// list users
					list : function () {
						// curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users
						// getUsers
					},
					// check the users auth and roles
					check : function (data) {
						console.log("commserver user check roles with ", data);
						var url = "userCheck";
						return send2server (url, {
							username : data.username,
							token : data.token,
							requiredRoles : data.requiredRoles,
						});
					},
					// change user
					update : function () {
						console.log("commserver user update userdata with ", data);
						var url = "userUpdate";
						return send2server (url, {
							username : data.username,
							token : data.token,
							requiredRoles : data.requiredRoles,
						});
						// setUser

					},
					// new user
					create : function () {
						// setUser
					},
					delete : function () {
						// deleteUser
					},
					// list all roles of the user
					getRoles : function (data) {
						// getRoles (user)
						// curl -s -H "Authorization: Bearer $token" http://localhost:8080/aktin/admin/users/demo/roles
					},
					// list all roles of all user (overview)
					getAllRoles : function () {
						// getRoles ()
					},
					// add a role to a user project id will be appended
					addRole : function () {
						// setRole(user, role)
					},
					// remove a role to a user 
					removeRole : function () {
						// deleteRole(user, role)
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
