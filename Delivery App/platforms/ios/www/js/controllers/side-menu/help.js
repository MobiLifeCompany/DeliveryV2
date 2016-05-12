angular.module('delivery.controllers')

.controller('HelpCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

    /// <summary>close: Close the addresses modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.helpModal.hide();
    };
});