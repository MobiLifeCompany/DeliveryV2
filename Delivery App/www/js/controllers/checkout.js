angular.module('delivery.controllers')

.controller('CheckoutCtrl', function ($scope, $rootScope, $state, $ionicLoading, $timeout, $translate, $ionicPlatform, ionicMaterialInk, shopDetailsFactory, customerFactory, deliveryLoader, storageUtilityFactory, authFactory) {

    $scope.$on('$ionicView.enter', function () {
        $scope.submitOrder();
    });

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

});