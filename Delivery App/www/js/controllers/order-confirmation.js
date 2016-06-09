angular.module('delivery.controllers')

.controller('orderConfirmationCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicNavBarDelegate, $timeout, $http, $translate, $ionicPlatform, $ionicHistory, $ionicFilterBar, $ionicActionSheet, connectionFactory, ionicMaterialInk, shopDetailsFactory, customerFactory, deliveryLoader, storageUtilityFactory, authFactory) {

    $scope.orderSubmittedSuccessfully = false;
    $scope.showSubmissionResult = false;
    $scope.appRating = 0;
    var customerOrder = {};
    $scope.orderInfo = {};

    $scope.$on('$ionicView.enter', function () {
        connectionFactory.testConnection().success(function (data) {
            $scope.submitOrder();
        }).error(function (err, statusCode) {
            connectionFactory.exitApplication();
        })
    });

    $scope.$on('$ionicView.leave', function () {
        $ionicNavBarDelegate.showBackButton(true);
    });

    $scope.submitOrder = function () {
        //// Todo: place backend API call here to submit the order
        customerOrder.items = $rootScope.cartItems;
        for (i = 0; i < $rootScope.cartItems.length; i++) {
            customerOrder.items[i].total = Number(customerOrder.items[i].quantity) * Number(customerOrder.items[i].price);
            customerOrder.items[i].qty = Number(customerOrder.items[i].quantity);
            customerOrder.items[i].price = Number(customerOrder.items[i].price);
        }
        customerOrder.items = $rootScope.cartItems;
        customerOrder.note = $rootScope.cartNote.text;
        customerOrder.shop_id = $rootScope.cartShop.id;
        customerOrder.customer_address_id = $rootScope.selectedAddressId;
        customerOrder.delivery_charge = $rootScope.cartShop.delivery_charge;

        deliveryLoader.showLoading($translate.instant('LOADING'));
        customerFactory.createCustomerOrder(customerOrder).success(function (data) {
            try {
                deliveryLoader.hideLoading();
                // On success:
                $scope.orderInfo.shopId = $rootScope.cartShop.id;
                $scope.orderInfo.order_id = data.id;
                $scope.showSubmissionResult = true;
                $scope.orderSubmittedSuccessfully = true;
                //clear cache of the entire ionicHistory stack views, used to set the app to start state and ready to another new order
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache()
                    .then(function () {
                        // initiat the user current perefernces to load the shop list when navigating back to home screen, without requiring the user to choose them again
                        $rootScope.selectedCategory = storageUtilityFactory.getSelectedCategory();
                        $rootScope.selectedCity = storageUtilityFactory.getSelectedCity();
                        $rootScope.selectedArea = storageUtilityFactory.getSelectedArea();
                        $rootScope.showCartFabButton = false;
                        $rootScope.cartItems = [];
                        $rootScope.cartShop = null;
                        $rootScope.cartAddress = null;
                        $rootScope.cartNote = { text: "" };
                        $rootScope.fullName = authFactory.getCustomer().full_name;
                    });
                $ionicNavBarDelegate.showBackButton(false);
            } catch (e) {
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(404, 'ORDER'));
            }
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            $scope.showSubmissionResult = true;
            $scope.orderSubmittedSuccessfully = false;
            connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(statusCode, 'ORDER'));
        });
    };

    $scope.sendRating = function (appRating) {
        connectionFactory.testConnection().success(function (data) {
            $scope.orderInfo.rate = appRating;
            deliveryLoader.showLoading($translate.instant('LOADING'));
            customerFactory.sendCustomerRating($scope.orderInfo).success(function (data) {
                try {
                    deliveryLoader.hideLoading();
                    connectionFactory.showAlertPopup($translate.instant('RATE'), $translate.instant('RATING_SUCCESS_MSG'));
                    $rootScope.showMainView = true;

                } catch (e) {
                    deliveryLoader.hideLoading();
                    connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(404, 'ORDER'));
                }
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), statusCode);
            });
        }).error(function (err, statusCode) {
            connectionFactory.exitApplication();
        })

    }
});