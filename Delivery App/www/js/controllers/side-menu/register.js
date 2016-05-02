angular.module('delivery.controllers')

.controller('RegisterCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

    /// <summary>closeRegister: Close the register modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.registerModal.hide();
    };
});