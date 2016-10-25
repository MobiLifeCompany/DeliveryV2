angular.module('delivery.controllers')


.controller('AddressesCtrl', function ($scope, $rootScope, $http, $ionicLoading, $timeout, $translate, $ionicPopup, $ionicHistory, $ionicModal, connectionFactory, storageUtilityFactory, customerFactory, deliveryLoader, errorCodeMessageFactory) {

    $scope.customerAddress = {};
    $rootScope.customerAddressess = [];
    $rootScope.selectedAddressId = -1;

    // Will be fired when addresses opened from ion-view
    $scope.$on('$ionicView.enter', function () {
        $scope.getCustomerAddress(); //load customer addresses from server
        // remove the 'login view' from history after user login successfully, so clicking back wouldn't get him back to 'Login' again
        if ($ionicHistory.backTitle() == $translate.instant('LOGIN'))
            $ionicHistory.removeBackView();
    })

    // Will be fired when addresses opened from ion-modal-view
    $rootScope.$on('modal.shown', function (event, modal) {
        if (modal.id == '4')
            $scope.getCustomerAddress(); //load customer addresses from server
    });

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

    $rootScope.getCustomerAddress = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));

        customerFactory.getCustomerAddressess().success(function (data) {
            try {
                var filteredAddresses = [];
                for (i = 0; i < data.length; i++)
                    if (data[i].area.id === storageUtilityFactory.getSelectedArea().id && data[i].city.id === storageUtilityFactory.getSelectedCity().id)
                        filteredAddresses.push(data[i]);

                $rootScope.customerAddressess = filteredAddresses;
                storageUtilityFactory.deleteCustomerAddresses();
                storageUtilityFactory.setCustomerAddresses(data);
                deliveryLoader.hideLoading();
            } catch (e) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(404, 'ADDRESS'));
            }
        }).error(function (err, statusCode) {
            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(statusCode, 'ADDRESS'));
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });           
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
        connectionFactory.testConnection(deliveryLoader).success(function (data) {
            $scope.customerAddress.city_id = $rootScope.selectedCity.id;
            $scope.customerAddress.area_id = $rootScope.selectedArea.id;
            $scope.customerAddress.latitude = 0;
            $scope.customerAddress.longitude = 0;
            $scope.customerAddress.is_default = false;
            customerFactory.createCustomerAddress($scope.customerAddress,deliveryLoader).success(function (data) {
                $scope.closeCreateAddressModal();
                $rootScope.customerAddressess.push($scope.customerAddress);
                deliveryLoader.hideLoading();
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(statusCode, 'ADDRESS'));
            });
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.exitApplication();
        })
    };
    $scope.updateAddress = function () {
        connectionFactory.testConnection(deliveryLoader).success(function (data) {
            customerFactory.updateCustomerAddress($scope.customerAddress,deliveryLoader).success(function (data) {
                $scope.closeEditAddressModal();
                $scope.getCustomerAddress();
                $scope.customerAddress = {};
                deliveryLoader.hideLoading();
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(statusCode, 'ADDRESS'));
            });
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.exitApplication();
        })
    };
    $scope.deleteAddress = function (customerAddressId) {
        deliveryLoader.showLoading($translate.instant('DELETE_ADDRESSES'));
        customerFactory.deleteCustomerAddress(customerAddressId).success(function (data) {
            deliveryLoader.hideLoading();
            $scope.getCustomerAddress();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(statusCode, 'ADDRESS'));
        });
    };

    $scope.deleteAddressPopup = function (customerAddressId) {
        connectionFactory.testConnection(deliveryLoader).success(function (data) {
            // Show a confirmation popup
            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('DELETE'),
                template: $translate.instant('ADDRESS_CONFIRMATION_MSG'),
                cancelText: $translate.instant('NO'),
                okText: $translate.instant('YES')
            });
            // Resolve the promise returned by the popup, then logout the user if user confirm
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.deleteAddress(customerAddressId);
                }
            });
        }).error(function (err, statusCode) {
            connectionFactory.exitApplication();
        })
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

    $scope.selectAddress = function (customerAddress) {
        if ($rootScope.selectedAddressId == customerAddress.id) {
            $rootScope.selectedAddressId = -1; // to unset the checkbox if clicked while it's already checked
            $rootScope.cartAddress = null;
        }
        else {
            $rootScope.selectedAddressId = customerAddress.id;
            $rootScope.cartAddress = customerAddress;
        }
    };

});