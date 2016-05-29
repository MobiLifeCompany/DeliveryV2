angular.module('delivery.controllers')

.controller('orderConfirmationCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicNavBarDelegate, $timeout, $http, $translate, $ionicPlatform, $ionicHistory, $ionicFilterBar, $ionicActionSheet, ionicMaterialInk, shopDetailsFactory, customerFactory, deliveryLoader, storageUtilityFactory, authFactory) {

    $scope.orderSubmittedSuccessfully = false;
    $scope.showSubmissionResult = false;
    $scope.appRating = 0;
    var customerOrder = {};

    $scope.$on('$ionicView.enter', function () {
        $scope.submitOrder();
    });

    $scope.$on('$ionicView.leave', function () {
        $ionicNavBarDelegate.showBackButton(true);
    });

    $scope.submitOrder = function(){
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
        
        deliveryLoader.showLoading($translate.instant('LOADING'));
        customerFactory.createCustomerOrder(customerOrder).success(function (data) {
         try {
                deliveryLoader.hideLoading();
                // On success:
                $scope.orderSubmittedSuccessfully = true;
                //clear history and cache of the entire ionicHistory stack views, used to set the app to start state and ready to another new order
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
                deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(404, 'ORDER'));
            }
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            $scope.orderSubmittedSuccessfully = false;
            deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(statusCode, 'ORDER'));
        });
       

        // On fail:
        //$scope.orderSubmittedSuccessfully = false;


        $scope.showSubmissionResult = true;
    };

});