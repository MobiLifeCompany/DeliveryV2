angular.module('delivery.controllers')

.controller('AddressesCtrl', function ($scope, $rootScope, $http, $ionicLoading, $timeout, $ionicPopup, $ionicModal, $ionicHistory, $translate, storageUtilityFactory, customerFactory, deliveryLoader) {

    $scope.customerAddress = {};
    $scope.customerAddressess = [];
    $scope.selectedAddressId = -1;

    $scope.$on('$ionicView.enter', function () {
        $scope.getCustomerAddress(); //load customer addresses from server
        // remove the 'login view' from history after user login successfully, so clicking back wouldn't get him back to 'Login' again
        if($ionicHistory.backTitle() == $translate.instant('LOGIN'))
            $ionicHistory.removeBackView();
    })

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

    //Create 'map' modal to display map of the selected address
    $ionicModal.fromTemplateUrl('map-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.mapModal = modal;
    });

    $scope.showMapModal = function (customerAddress) {
        $scope.mapModal.show();
        $scope.showMap(customerAddress);
    };

    $scope.closeMapModal = function () {
        $scope.mapModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.mapModal.remove();
    });
    $scope.$on('modal.hidden', function () {
        $scope.$on('$destroy', function () {
            $scope.map = null;
        });
    });

    $scope.getCustomerAddress = function () {
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
            $scope.customerAddressess.push($scope.customerAddress);
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

    //showMap: Show a map of the selected address with position marker, will be called from the 'mapModal' when it's shown
    $scope.showMap = function (customerAddress) {
        var latLng = new google.maps.LatLng(customerAddress.longitude, customerAddress.latitude);
        var mapOptions = {
            center: latLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(customerAddress.longitude, customerAddress.latitude),
            map: map,
            title: customerAddress.street
        });

        $scope.map = map;
    };

    $scope.selectAddress = function (customerAddressId) {
        if ($scope.selectedAddressId == customerAddressId) {
            $scope.selectedAddressId = -1; // to unset the checkbox if clicked while it's already checked
        }
        else
            $scope.selectedAddressId = customerAddressId;
    };
 
});