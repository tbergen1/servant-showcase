// Create Angular App
angular.module('appDashboard', ['ngResource', 'ui.router']);

// Universal Functions & Defaults
angular.module('appDashboard').run(['$rootScope', '$timeout', '$interval', '$state', 'ServantAngularService', 'Application',
    function($rootScope, $timeout, $interval, $state, ServantAngularService, Application) {

        // Defaults
        $rootScope.s = {};

        // State Change Error Handler
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            // console.log(event, toState, toParams, fromState, fromParams, error);
            $rootScope.s.loading = false;
            switch (error) {
                case "no_subscription":
                    return $state.go('plan', toParams);
                case "no_number":
                    return $state.go('number', toParams);
                default:
                    return $state.go('servants');
            }
        });

        // Universal Functions

        // Initialize Servant SDK
        $rootScope.s.initializeServantSDK = function(callback) {
            var options = {
                application_client_id: "none",
                token: $rootScope.s.user.servant_access_token_limited,
                protocol: window.location.host.indexOf('localhost') > -1 ? 'http' : 'https',
                image_dropzone_class: 'image-dropzone'
            };
            Servant.initialize(options, function() {
                return callback();
            });
        };

        $rootScope.s.loadUserAndServants = function(callback) {
            Application.loadUserAndServants(null, function(response) {
                $rootScope.s.user = response.user;
                $rootScope.s.servants = response.servants;
                $rootScope.s.user.missing_servants = response.missing_servants;
                return callback(null, response);
            }, function(error) {
                if (error.status === 401) {
                    window.location = '/';
                    return false;
                }
                return callback(error, null);
            });
        };

        // Set Active Servant
        $rootScope.s.setServant = function(servantID, callback) {
            for (i = 0; i < $rootScope.s.servants.length; i++) {
                if ($rootScope.s.servants[i]._id.toString() === servantID) $rootScope.servant_index = i;
            }
            ServantAngularService.setServant($rootScope.s.servants[$rootScope.servant_index]._id);
            return callback();
        };

        // Show Modal
        $rootScope.s.showModal = function(view) {
            // Show Modal Overlay & Box
            document.getElementById("modal-overlay").style.display = 'block';
            document.getElementById("modal-box").style.display = 'block';
            // Change View Back
            $rootScope.view = view;
        };

        // Hide Modal
        $rootScope.s.hideModal = function() {
            // Show Modal Overlay & Box
            document.getElementById("modal-overlay").style.display = 'none';
            document.getElementById("modal-box").style.display = 'none';
            // Change View Back
            $rootScope.view = 'dashboard';
        };


    }
]);