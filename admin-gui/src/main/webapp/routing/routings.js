(function() {
    var app = angular.module('aktin.routing', [
        'ui.router',
        'aktin.home',
        'aktin.logs',
        'aktin.users',
    ]);

    // HEADER 
    app.directive('headerPanel', function () {
        return {
            restrict: 'E', 
            templateUrl: 'layout/header.html',
        }
    });
    app.controller('HeaderController', ['$state', function($state){
        var app = this;
        app.navigations = navigations;
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
        },
        {
            name: 'Properties',
            routing: 'properties',
            url: "/properties/",
            templateUrl: 'properties/properties.html',
            controller: 'PropertiesController',
            controllerAs: 'properties',
        },
        {
            name: 'Logs',
            routing: 'logs',
            url: "/logs/",
            templateUrl: 'logs/logs.html',
            controller: 'LogsController',
            controllerAs: 'logs',
        },
        {
            name: 'Users',
            routing: 'users',
            url: "/users/",
            templateUrl: 'users/users.html',
            controller: 'UsersController',
            controllerAs: 'users',
        },
        {
            name: 'Login',
            routing: 'login',
            url: "/users/login",
            templateUrl: 'users/login.html',
            controller: 'UsersController',
            controllerAs: 'users',
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
                    
                }
            });

            _.each (navigations, function (elem, ind, list) {
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
                makeState(elem);
            });


        $stateProvider
            .state('restricted', {
                parent: 'site',
                url: '/restricted',
                data: {
                    roles : []
                },
                templateUrl: 'client/restricted.html'
            })
            .state('accessdenied', {
                parent: 'site',
                url: '/denied',
                data: {
                    roles : []
                },
                templateUrl: 'client/denied.html',
            });
    }])
    .config(['$locationProvider',
     function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }
    ]); 
    app.run(['$rootScope', '$state', '$stateParams', 
        function($rootScope, $state, $stateParams) {
            $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                if (typeof toState.data === "undefined") {
                    toState.data = {};
                }
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
            });
        }
    ]);

})();