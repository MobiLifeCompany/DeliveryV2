angular.module('delivery.controllers')

.controller('CartCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicLoading, $ionicModal, $timeout, $http, $ionicPlatform, $ionicPopup, $ionicHistory, $ionicFilterBar, $ionicActionSheet, $translate, ionicMaterialInk, shopDetailsFactory, customerFactory, connectionFactory, deliveryLoader) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.showCartFabButton = false; //hide the cart button while in cart screen
    })

    $scope.data = {
        showEdit: false
    };

    $scope.isLogin = $rootScope.isUserLoggedin;

    $scope.changeStatus = function (){
        $scope.data.showEdit = !$scope.data.showEdit;
        return $scope.data.showEdit;
    }
    
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

    $scope.notifyShop = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));
        customerFactory.notifyShopFunction($rootScope.cartShop.id).success(function () {
            try {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('NOTIFY'), $translate.instant('NOTIFY_SUCCESS_MSG'));
            } catch (e) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(500, ''));
            }
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
        });

    }

    $scope.cancelOrder = function () {
        // Show a confirmation popup
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('CANCEL_ORDER'),
            template: $translate.instant('CANCEL_ORDER_MSG'),
            cancelText: $translate.instant('NO'),
            okText: $translate.instant('YES')
        });

        // Resolve the promise returned by the popup, then cancel the order if user confirm
        confirmPopup.then(function (res) {
            if (res) {
                $rootScope.showCartFabButton = false;
                $rootScope.cartItems = [];
                $rootScope.cartShop = null;
                $rootScope.cartAddress = null;
                $rootScope.cartNote = { text: "" };
                $state.go('app.shops'); //go back to start view 'shops'
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
            }
        });
        
    };

    $scope.confirmOrder = function () {
        // Check if the shop is subscribed
        if (!$rootScope.cartShop.subscribed) {
            var notSubscribedPopup = $ionicPopup.show({
                template: '<div style="width: 100%; border-top: 1px solid silver; padding-top: 5px;"><p><strong class="assertive-900">{{cartShop.name}}</strong></br><strong>{{\'ADDRESSES\' | translate}}: </strong>{{cartShop.address}}</br><strong>{{\'PHONE\' | translate}}: </strong>{{cartShop.phone}}</p><a href="tel:{{cartShop.phone}}" class="button button-balanced" style="width: 100%;" translate="CALL_NOW"></a><br/><br/><a ng-show="isLogin" ng-click="notifyShop()" class="button button-assertive" style="width: 100%;" translate="NOTIFY_SHOP_TO_SUBSCRIBE"></a></div>',
                title: $translate.instant('SHOP_NOT_SUBSCRIBED'),
                subTitle: $translate.instant('SHOP_NOT_SUBSCRIBED_MSG'),
                scope: $scope,
                buttons: [
                  { text: 'Cancel' },
                ]
            });
        }
        else {
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
                if ($rootScope.isUserLoggedin)
                    $state.go('app.cart-addresses');
                else
                    $state.go('app.cart-login');
            }
        }
    };
});