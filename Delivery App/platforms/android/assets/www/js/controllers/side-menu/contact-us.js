angular.module('delivery.controllers')

.controller('ContactUsCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

    /// <summary>closeContactUs: Close the contactus modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.contactUsModal.hide();
    };
});