// Application Router
angular.module('appDashboard').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to '/'
        $urlRouterProvider.otherwise('/');
        // Now set up the states
        $stateProvider
            .state('servants', {
                url: '/',
                templateUrl: 'views/dashboard/servants.html',
                resolve: {
                    initializeView: initializeView
                }
            })
            .state('plan', {
                url: '/:servantID/plan',
                templateUrl: 'views/dashboard/plan.html',
                resolve: {
                    initializeView: initializeView
                }
            })
            .state('menu', {
                url: '/:servantID/menu',
                templateUrl: 'views/dashboard/menu.html',
                resolve: {
                    initializeView: initializeView
                }
            })
    }
]);

// Resolves initializeView – Initialize The View
var initializeView = ['$q', '$rootScope', '$state', '$stateParams', 'Application', 'ServantAngularService',
    function($q, $rootScope, $state, $stateParams, Application, ServantAngularService) {
        // Defaults
        var deferView = $q.defer();

        // If User Is Loaded, Skip
        if (!$rootScope.s.user || !$rootScope.s.servants.length) {

            // If User Isn't Loaded, Load User
            $rootScope.s.loading = true;

            // Load Local User Record
            $rootScope.s.loadUserAndServants(function(error, response) {

                console.log("User and Servant Data Loaded: ", $rootScope.s.user);

                $rootScope.s.initializeServantSDK(function() {
                    $rootScope.s.loading = false;
                    if ($stateParams.servantID) {
                        return $rootScope.s.setServant($stateParams.servantID, function() {
                            $rootScope.s.loading = false;
                            return deferView.resolve();
                        });
                    } else {
                        return deferView.resolve();
                    }
                });
            });
            return deferView.promise;
        } else if ($rootScope.s.user && $stateParams.servantID) {
            return $rootScope.s.setServant($stateParams.servantID, function() {
                $rootScope.s.loading = false;
                return deferView.resolve();
            });
            return deferView.promise;
        } else {
            return true;
        }
    }
];


// Setting HTML5 Location Mode
angular.module('appDashboard').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);