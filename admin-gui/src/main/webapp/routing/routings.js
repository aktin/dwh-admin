(function() {
    var app = angular.module('aktin.routing', [
        'ui.router',
        'aktin.helpers',
        'aktin.home',
        'aktin.logs',
        'aktin.users',
        'aktin.reports',
    ]);
    app.factory('authorization', ['$q', '$timeout', '$rootScope', '$state', 'userFactory',
        function($q, $timeout, $rootScope, $state, userFactory) {
            function authorize ( ) {
                var curUser = userFactory.user();
                console.log('rout check', $rootScope.toState, curUser, $rootScope.toState.data.roles, userFactory.checkRole(curUser, $rootScope.toState.data.roles))

                // is there a user?
                if (userFactory.hasUser()) {
                    // does the user have enough right?
                    if (userFactory.checkRole(curUser, $rootScope.toState.data.roles)) { 
                        // yes
                        console.log('user, has rights', $rootScope.toState.name);
                        if (_.contains(['login'], $rootScope.toState.name))                            
                            $timeout(function() {
                                console.log('going to home')
                                return $state.go('home');
                            })
                        return true;
                    } else {
                        // no
                        console.log('user, no rights', $rootScope.toState.name);
                        $timeout(function() {
                            return $state.go('accessdenied', $rootScope.toState.name);
                        })
                    }
                } else {
                    // there is no user. does the site need a user?
                    if (userFactory.checkRole(curUser, $rootScope.toState.data.roles)) { 
                        // no
                        console.log('no user, no rights needed', $rootScope.toState.name);
                        return true;
                    } else {
                        console.log('no user, rights needed', $rootScope.toState.name);                             
                        $timeout(function() {
                                console.log('going to login')
                            return $state.go('login');
                        })
                    }
                }


                // if (!userFactory.checkRole(curUser, $rootScope.toState.data.roles)) { 
                //     if (curUser) {
                //         $timeout(function() {
                //             return $state.go('accessdenied');
                //         })
                //     } else { // there is no current user so go to login / home                              
                //         $timeout(function() {
                //             return $state.go('login');
                //         })
                //     }
                //     return false;
                // } else {
                //     if (_.contains(['login'/*, 'accessdenied', 'restricted'*/], $rootScope.toState.name))                            
                //         $timeout(function() {
                //             console.log('going to home', userFactory.checkRole(curUser, $rootScope.toState.data.roles), curUser, $rootScope.toState.data.roles)
                //             return $state.go('home');
                //         })
                // }
                // user rights / access rights check out. load page
                return true;
            };
            return {
                authorize: authorize, 
            };
        }
    ]);
    app.factory('BearerAuthInterceptor', function ($window, $q, storageHelper) {
        return {
            request: function(config) {
                if (isServerUrl(config.url)) {
                    config.headers = config.headers || {};
                    console.log(config);
                    // exclude login link
                    if (storageHelper.from('user.token') /* && config.url === getUrl("/auth/login") */ ) {
                        config.headers.Authorization = 'Bearer ' + storageHelper.from('user.token');
                    }
                }
                return config || $q.when(config);
            },
            response: function(response) {
                console.log('resp', response);

                if (isServerUrl(response.config.url)) {
                    console.log('resp server', response);
                    if (response.status === 401) {
                        //  Redirect user to login page / signup Page.
                    }
                }
                return response || $q.when(response);
            }
        };
    });

    // Register the previously created AuthInterceptor.
    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('BearerAuthInterceptor');
    });

    // HEADER 
    app.directive('headerPanel', function () {
        return {
            restrict: 'E', 
            templateUrl: 'layout/header.html',
        }
    });
    app.controller('HeaderController', ['$state', 'number2word', 'userFactory', function($state, number2word, userFactory){
        var app = this;
        app.navigations = function () {
            return _.filter(navigations, function (nav) {
                return userFactory.checkRole(userFactory.user(), nav.roles);
            });
        }
        //navigations;
        app.navLength = function () {
            // return number2word(navigations.length) + " item";
        }
        app.active = function (nav) {
            if ($state.$current,$state.$current.self.name === nav.routing) {
                return 'active';
            }
        }

    }]);

    // FOOTER
    app.directive('footerPanel', function () {
        return {
            restrict: 'E', 
            templateUrl: 'layout/footer.html',
        }
    });

    // ROUTING and STATEMACHINE
    var navigations = [
        {
            name: 'Home',
            routing: 'home',
            parent: 'site',
            url: "/",
            templateUrl: 'home/home.html',
            controller: 'HomeController',
            controllerAs: 'home', 
            roles : [
                'USER',
            ]
        },
        {
            name: 'Konfiguration', 
            routing: 'properties',
            parent: 'site',
            url: "/properties/",
            templateUrl: 'properties/properties.html',
            controller: 'PropertiesController',
            controllerAs: 'properties',
            roles : [
                'admin',
            ]
        },
        {
            name: 'Logs',
            routing: 'logs',
            parent: 'site',
            url: "/logs/",
            templateUrl: 'logs/logs.html',
            controller: 'LogsController',
            controllerAs: 'logs',
            roles : [
                'admin',
            ]
        },
        {
            name: 'Benutzeradministration',
            routing: 'users',
            parent: 'site',
            url: "/users/",
            templateUrl: 'users/users.html',
            controller: 'UsersController',
            controllerAs: 'users',
            roles : [
                'admin',
            ]
        },
        {
            name: 'Zentrale Abfragen',
            routing: 'querying',
            parent: 'site',
            url: "/querying/",
            templateUrl: 'querying/querying.html',
            controller: 'QueryController',
            controllerAs: 'query',
            roles : [
                'admin',
            ]
        },
        {
            name: 'Berichtswesen',
            routing: 'reports',
            parent: 'site',
            url: "/reports/",
            templateUrl: 'reports/reports.html',
            controller: 'ReportsController',
            controllerAs: 'reports',
            roles : [
                'admin',
            ]
        },
    ];

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        // For any unmatched url, redirect to home state
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('site', {
                abstract: true,
                data: {
                },
                template: "<ui-view/>",
                resolve: {
                    authorize: ['authorization',
                        function(authorization) {
                            return authorization.authorize();
                        }
                    ]
                }
            });
            
        var makeState = function (elem) {
            if (elem.routing) {
                var state = {
                    name : elem.routing,
                    parent : elem.parent,
                    url : elem.url,
                    data : {
                        roles : elem.roles
                    },
                    controller : elem.controller,
                    controllerAs : elem.controllerAs,
                    templateUrl : elem.templateUrl,
                };
                $stateProvider.state(state);
            }
        };

        _.each (navigations, function (elem, ind, list) {
            makeState(elem);
        });


        $stateProvider
            .state('restricted', {
                parent: 'site',
                url: '/restricted',
                data: {
                    roles : []
                },
                templateUrl: 'layout/restricted.html'
            })
            .state('accessdenied', {
                parent: 'site',
                url: '/denied',
                data: {
                    roles : []
                },
                templateUrl: 'layout/denied.html',
            })
            .state('login', {
                name: 'Login',
                routing: 'login',
                url: "/login",
                templateUrl: 'users/login.html',
                controller: 'UsersController',
                controllerAs: 'users',
                data: {
                    roles : []
                },
            });
    }])
    .config(['$locationProvider',
     function ($locationProvider) {
        $locationProvider.html5Mode(false);
    }
    ]); 
    app.run(['$rootScope', '$state', '$stateParams', 'authorization', 
        function($rootScope, $state, $stateParams, authorization) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                if (typeof toState.data === "undefined") {
                    toState.data = {};
                }
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                if (!authorization.authorize()) event.preventDefault();
            });
        }
    ]);


})();