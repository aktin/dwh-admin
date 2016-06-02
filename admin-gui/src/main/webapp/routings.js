(function() {
    var app = angular.module('aktin.routing', [
        'ui.router',
        'aktin.home',
    ]);

    app.directive('headerPanel', function () {
        return {
            restrict: 'E', 
            templateUrl: 'home/header.html',
        }
    });
    var navigations = [
        {
            name: 'Home',
            routing: 'home',
            parent: 'site',
            url: "/",
            templateUrl: 'home/home.html',
            controller: 'HomeController',
            controllerAs: 'homeCtrl',
        },
        {
            name: 'Properties',
            routing: 'properties',
            url: "/properties",
            templateUrl: 'properties/properties.html',
            controller: 'PropertiesController',
            controllerAs: 'properties',
        },
    ];
    app.controller('HeaderController', ['$state', function($state){
        var app = this;
        app.navigations = navigations;
        app.active = function (nav) {
            if ($state.$current,$state.$current.self.name === nav.routing) {
                return 'active';
            }
        }

    }]);

    app.directive('footerPanel', function () {
        return {
            restrict: 'E', 
            templateUrl: 'home/footer.html',
        }
    });
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
        // $stateProvider
        //     .state('home', {
        //         name: 'home',
        //         parent: 'site',
        //         url: "/",
        //         data: {
        //             roles : []
        //         },
        //         templateUrl: 'home/home.html',
        //         controller: 'HomeController',
        //         controllerAs: 'home',
        //     })
        //     .state('properties', {
        //         name: 'properties',
        //         url: "/properties",
        //         data: {
        //             roles : []
        //         },
        //         templateUrl: 'properties/properties.html',
        //         controller: 'PropertiesController',
        //         controllerAs: 'properties',
        //     });

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