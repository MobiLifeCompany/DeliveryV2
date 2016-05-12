angular.module('delivery.controllers')

.controller('AddressesCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

    /// <summary>closeAddresses: Close the addresses modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.addressesModal.hide();
    };
});