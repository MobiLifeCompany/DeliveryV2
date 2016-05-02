angular.module('delivery.controllers')

.controller('AboutCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

    /// <summary>close: Close the about modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.aboutModal.hide();
    };
});