angular.module('delivery.controllers')

.controller('CheckoutCtrl', function ($scope, $rootScope, $state, $ionicLoading, $ionicNavBarDelegate, $timeout, $http, $ionicPlatform, $ionicHistory, $ionicFilterBar, $ionicActionSheet, ionicMaterialInk, shopDetailsFactory, deliveryLoader, storageUtilityFactory, authFactory) {

    $scope.orderSubmittedSuccessfully = false;
    $scope.showSubmissionResult = false;
    $scope.appRating = 0;

    $scope.$on('$ionicView.enter', function () {
        //// Todo: place backend API call here to submit the order

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
                $rootScope.fullName = authFactory.getCustomer().full_name;
            });
        $ionicNavBarDelegate.showBackButton(false);

        // On fail:
        //$scope.orderSubmittedSuccessfully = false;


        $scope.showSubmissionResult = true;
    });

    $scope.$on('$ionicView.leave', function () {

    });

});