angular.module('delivery.controllers')

.controller('ResetPasswordCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

    /// <summary>close: Close the reset password modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.resetPasswordModal.hide();
    };
});