angular.module('appDashboard').controller('PlanController', ['$rootScope', '$scope', '$timeout', '$state', '$stateParams', '$location', 'Application', 'ServantAngularService',
    function($rootScope, $scope, $timeout, $state, $stateParams, $location, Application, ServantAngularService) {
        // Defaults
        $scope.newPlan = 'plan1';
        if ($rootScope.s.servants[$rootScope.servant_index].servant_pay.subscription_plan_id) $scope.newPlan = $rootScope.s.servants[$rootScope.servant_index].servant_pay.subscription_plan_id;
        $scope.plans = [{
            label: 'Plan 1 for $12/Month',
            plan_id: 'plan1'
        }, {
            label: 'Plan 2 for $24/Month',
            plan_id: 'plan2'
        }, {
            label: 'Plan 3 for $36/Month',
            plan_id: 'plan3'
        }, {
            label: 'Plan 4 for $48/Month',
            plan_id: 'plan4'
        }, {
            label: 'Plan 5 for $60/Month',
            plan_id: 'plan5'
        }];

        $scope.initialize = function() {};

        $scope.subscribe = function() {
            $scope.subscribing = true;
            // Check Subscription Status
            if ($rootScope.s.servants[$rootScope.servant_index].servant_pay.subscription_status === 'active') {
                // Make Sure Not Resubscribed To Same Plan
                if ($scope.newPlan === $rootScope.s.servants[$rootScope.servant_index].servant_pay.subscription_plan_id) return false;
                // Update
                ServantAngularService.servantpaySubscriptionUpdate($scope.newPlan).then(function(response) {
                    // Refresh User And Servant Data
                    $rootScope.s.loadUserAndServants(function(error, response) {
                        $scope.subscribing = false;
                        $scope.subscribed = true;
                        $timeout(function() {
                            $scope.subscribed = false;
                        }, 2000);
                    });
                }, function(error) {
                    $scope.subscribing = false;
                    $scope.error = error.message;
                    console.log(error);
                });
            } else {
                // Create
                ServantAngularService.servantpaySubscriptionCreate($scope.newPlan).then(function(response) {
                    // Refresh User And Servant Data
                    $rootScope.s.loadUserAndServants(function(error, response) {
                        $scope.subscribing = false;
                        $scope.subscribed = true;
                        $timeout(function() {
                            $scope.subscribed = false;
                        }, 2000);
                    });
                }, function(error) {
                    $scope.subscribing = false;
                    $scope.error = error.message;
                    console.log(error)
                });
            }
        };

        $scope.cancelPlan = function() {
            $scope.canceling = true;
            ServantAngularService.servantpaySubscriptionCancel().then(function(response) {
                console.log(response);
                // Refresh User And Servant Data
                $rootScope.s.loadUserAndServants(function(error, response) {
                    $scope.canceling = false;
                });
            }, function(error) {
                $scope.canceling = false;
                $scope.error = error.message;
                console.log(error)
            });
        };

    }
]);