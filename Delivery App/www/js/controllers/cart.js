angular.module('delivery.controllers')

.controller('CartCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicLoading, $ionicModal, $timeout, $http, $ionicPlatform, $ionicPopup, $ionicHistory, $ionicFilterBar, $ionicActionSheet, $translate, ionicMaterialInk, shopDetailsFactory, deliveryLoader) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.showCartFabButton = false; //hide the cart button while in cart screen
    })

    $scope.data = {
        showEdit: false
    };
    
    //increaseAmount: increase the item quantity counter label when click on '+' button
    $scope.increaseAmount = function (item) {
        item.quantity++;
    };

    //decreseAmount: decrease the item quantity counter label when click on '-' button
    $scope.decreseAmount = function (item) {
        if (item.quantity > 1) {
            item.quantity--;
        }
    };

    $scope.removeItem = function (item) {
        $rootScope.cartItems.splice($rootScope.cartItems.indexOf(item), 1);
        if ($rootScope.cartItems.length == 0) {
            $rootScope.showCartFabButton = false;
            $rootScope.cartShop = null;
            $scope.data.showEdit = false;
        }
    };

    $scope.calculatePrice = function (item) {
        return parseFloat(item.price) * parseInt(item.quantity);
    };

    $scope.calculateSubtotal = function () {
        var subtotal = 0;
        for (i = 0; i < $rootScope.cartItems.length; i++) {
            subtotal += parseFloat($rootScope.cartItems[i].price) * parseInt($rootScope.cartItems[i].quantity);
        }
        $scope.subtotal = subtotal;
        return subtotal;
    };

    $scope.calculateTotal = function () {
        var total = $scope.subtotal + parseFloat($rootScope.cartShop.delivery_charge);
        $scope.total = total;
        return total;
    };

    $scope.goBackHome = function () {
        $ionicHistory.goBack(-100); //go back to start view 'shops', use this method instead of 'ui-serf' to clear the ionic view history and show the side menu icon on nav-bar
    };

    $scope.confirmOrder = function () {
        if ($scope.subtotal < $rootScope.cartShop.min_amount) {
            
            // Show a warning popup if subtotal is less than shop's min_delivery_amount
            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('MIN_AMOUNT_REQUIRED'),
                template: $translate.instant('MIN_AMOUNT_REQUIRED_MSG'),
                okText: $translate.instant('CONTINUE')
            });

            // Resolve the promise returned by the popup. if user click continue, navigate back to shop-details
            alertPopup.then(function (res) {
                if (res) {
                    $ionicHistory.goBack(-1);
                }
            });
        }
        else {
            if($rootScope.isUserLoggedin)
                $state.go('app.cart-addresses');
        else
            $state.go('app.cart-login');
        }
    };


});