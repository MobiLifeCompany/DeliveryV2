angular.module('delivery.controllers')

.controller('OldOrdersCtrl', function ($scope, $rootScope, $ionicPopup, $translate, $state, deliveryLoader, shopDetailsFactory, customerFactory) {

    $scope.loadOldOrders = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));
        customerFactory.getCustomerOrders().success(function (data) {
            try {
                $scope.oldOrders = data;
            } catch (e) {
                deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(500, ''));
            }
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(err.message);
        })
    };

  
    $scope.loadOldOrders();

    //addToCart: add the selected item to '$rootScope.cartItems' (defined in 'controllers.js)
    $scope.repeatOrder = function (order) {
        var shopDetails = shopDetailsFactory.get(order.shop.id);
        
        if (!shopDetails.is_open) {
            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('SHOP_CLOSED'),
                template: $translate.instant('CANT_ORDER_SHOP_CLOSED'),
            });
        }
        else {
            if ($rootScope.cartShop != null) {
                // Show a warning popup if shop changed
                var confirmPopup = $ionicPopup.confirm({
                    title: $translate.instant('ITEMS_IN_CART'),
                    template: $translate.instant('CONFIRM_EMPTY_CART_MSG'),
                    cancelText: $translate.instant('NO'),
                    okText: $translate.instant('YES')
                });
                // Resolve the promise returned by the popup, then empty the cart if user confirm and refill it
                confirmPopup.then(function (res) {
                    if (res) {
                        //if user click 'yes': empty the cart, change the cart shop and add the new item from the selected old order
                        $rootScope.cartShop = null;
                        $rootScope.cartItems = [];
                        // Fill cart with the order's items
                        for (i = 0; i < order.items.length; i++) {
                            $rootScope.cartItems.push({ id: order.items[i].item.id, name: order.items[i].item.name, description: order.items[i].item.description, photo: order.items[i].item.photo, quantity: order.items[i].qty, price: order.items[i].item_price });
                        }
                        $rootScope.showCartFabButton = true; //Set '$rootScope.showCartFabButton' (defined in 'controllers.js) to true, used to show the cart fab button in bottom right corner
                        $rootScope.cartShop = shopDetails; //Set the shop for the current order, don't allow items from other shops to be added to the cart
                        $state.go('app.cart');
                    }
                });
            }
            else{
                // Fill cart with the order's items
                for (i = 0; i < order.items.length; i++) {
                    $rootScope.cartItems.push({ id: order.items[i].item.id, name: order.items[i].item.name, description: order.items[i].item.description, photo: order.items[i].item.photo, quantity: order.items[i].qty, price: order.items[i].item_price });
                }
                $rootScope.showCartFabButton = true; //Set '$rootScope.showCartFabButton' (defined in 'controllers.js) to true, used to show the cart fab button in bottom right corner
                $rootScope.cartShop = shopDetails; //Set the shop for the current order, don't allow items from other shops to be added to the cart
                $state.go('app.cart');
            }
        } 
    };

});