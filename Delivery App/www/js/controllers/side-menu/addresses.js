angular.module('delivery.controllers')

.controller('AddressesCtrl', function ($scope, $rootScope, $http, $ionicLoading, $timeout, $ionicPopup, $ionicModal, storageUtilityFactory, customerFactory, deliveryLoader) {

    $scope.customerAddress = {};
    $scope.customerAddressess = {};

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

    $ionicModal.fromTemplateUrl('createAddress-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.addressCreateModal = modal;
    });

    $rootScope.getCustomerAddress = function () {
        deliveryLoader.showLoading('Loading Addressess...');
        customerFactory.getCustomerAddressess().success(function (data) {
            $scope.customerAddressess = data;
            storageUtilityFactory.setCustomerAddresses(data);
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(statusCode + ": " + err);
        });
    };

    

    $scope.showEditAddressModal = function (customerAddress) {
        $scope.customerAddress = customerAddress;
        $scope.addressEditModal.show();
    };

    $scope.closeEditAddressModal = function () {
        $scope.addressEditModal.hide();
    };

    $scope.closeCreateAddressModal = function () {
        $scope.addressCreateModal.hide();
    };
    
    $scope.showCreateAddressModal = function () {
        $scope.addressCreateModal.show();
    };

    $scope.createAddress = function () {
        deliveryLoader.showLoading('create Address...');
        $scope.customerAddress.city_id = $rootScope.selectedCity.id;
        $scope.customerAddress.area_id= $rootScope.selectedArea.id;
        $scope.customerAddress.latitude= 0;
        $scope.customerAddress.longitude= 0;
        $scope.customerAddress.is_default = false;
        customerFactory.createCustomerAddress($scope.customerAddress).success(function (data) {
            $scope.closeCreateAddressModal();
            deliveryLoader.hideLoading();
            $scope.getCustomerAddress();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(statusCode + ": " + err);
        });
    };
    $scope.updateAddress = function () {
        deliveryLoader.showLoading('update Address...');
        customerFactory.updateCustomerAddress($scope.customerAddress).success(function (data) {
            $scope.closeEditAddressModal();
            deliveryLoader.hideLoading();
            $scope.getCustomerAddress();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(statusCode + ": " + err);
        });
    };
    $scope.deleteAddress = function (customerAddressId) {
        deliveryLoader.showLoading('delete Address...');
        customerFactory.deleteCustomerAddress(customerAddressId).success(function (data) {
            deliveryLoader.hideLoading();
            $scope.getCustomerAddress();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(statusCode + ": " + err);
        });
    };

    $scope.deleteAddressPopup = function (customerAddressId) {
        // Show a confirmation popup
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete',
            template: 'Are you sure you want to delete this Address?',
            cancelText: 'No',
            okText: 'Yes'
        });

        // Resolve the promise returned by the popup, then logout the user if user confirm
        confirmPopup.then(function (res) {
            if (res) {
                $scope.deleteAddress(customerAddressId);
            }
        });
    };
    
});