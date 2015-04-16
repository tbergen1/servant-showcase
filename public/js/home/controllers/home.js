angular.module('appHome').controller('HomeController', ['$scope', '$timeout', function ($scope, $timeout) {
    
    $scope.initialize = function() {
        // Defaults
        $scope.connecting = false;
    };

    $scope.connect = function() {
    	$scope.connecting = true;
    };

}]);