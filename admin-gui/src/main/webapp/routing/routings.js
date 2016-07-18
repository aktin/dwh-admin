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

                if (!userFactory.checkRole(curUser, $rootScope.toState.data.roles)) { 
                    if (curUser) {
                        $timeout(function() {
                            return $state.go('accessdenied');
                        })
                    } else { // there is no current user so go to login / home                              
                        $timeout(function() {
                            return $state.go('login');
                        })
                    }
                    return false;
                } else {
                    if (_.contains(['login'/*, 'accessdenied', 'restricted'*/], $rootScope.toState.name))                            
                    $timeout(function() {
                        return $state.go('home');
                    })
                }
                // user rights / access rights check out. load page
                return true;
            };
            return {
                authorize: authorize, 
            };
        }
    ]);

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
            url: "/properties/",
            templateUrl: 'properties/properties.html',
            controller: 'PropertiesController',
            controllerAs: 'properties',
            roles : [
                'ADMIN',
            ]
        },
        {
            name: 'Logs',
            routing: 'logs',
            url: "/logs/",
            templateUrl: 'logs/logs.html',
            controller: 'LogsController',
            controllerAs: 'logs',
            roles : [
                'ADMIN',
            ]
        },
        {
            name: 'Benutzeradministration',
            routing: 'users',
            url: "/users/",
            templateUrl: 'users/users.html',
            controller: 'UsersController',
            controllerAs: 'users',
            roles : [
                'ADMIN',
            ]
        },
        {
            name: 'Zentrale Abfragen',
            routing: 'querying',
            url: "/querying/",
            templateUrl: 'querying/querying.html',
            controller: 'QueryController',
            controllerAs: 'query',
            roles : [
                'ADMIN',
            ]
        },
        {
            name: 'Berichtswesen',
            routing: 'reports',
            url: "/reports/",
            templateUrl: 'reports/reports.html',
            controller: 'ReportsController',
            controllerAs: 'reports',
            roles : [
                'ADMIN',
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
        $locationProvider.html5Mode(true);
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