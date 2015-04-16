angular.module('appDashboard').controller('DashboardController', ['$rootScope', '$scope', '$timeout', '$state', 'Application', 'ServantAngularService',
    function($rootScope, $scope, $timeout, $state, Application, ServantAngularService) {

        $scope.showModal = function(view) {
            // Show Modal Overlay & Box
            document.getElementById("modal-overlay").style.display = 'block';
            document.getElementById("modal-box").style.display = 'block';
            // Change View Back
            $rootScope.view = view;
        };

        $scope.hideModal = function() {
            // Show Modal Overlay & Box
            document.getElementById("modal-overlay").style.display = 'none';
            document.getElementById("modal-box").style.display = 'none';
            // Change View Back
            $rootScope.view = 'dashboard';
        };

    }
]);