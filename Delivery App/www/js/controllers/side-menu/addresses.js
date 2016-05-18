angular.module('delivery.controllers')

.controller('AddressesCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $ionicModal) {

    /// <summary>closeAddresses: Close the addresses modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.addressesModal.hide();
    };

    $ionicModal.fromTemplateUrl('editAddress-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.addressEditModal = modal;
    });

    $scope.showAddressModal = function () {
        $scope.addressEditModal.show();
    };

    $scope.closeAddressModal = function () {
        $scope.addressEditModal.hide();
    };
});