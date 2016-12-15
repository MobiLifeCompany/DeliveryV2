angular.module('delivery.controllers')

.controller('OldOrdersCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, $ionicSlideBoxDelegate, $translate, $state, $cordovaSocialSharing, deliveryLoader, errorCodeMessageFactory, connectionFactory, shopDetailsFactory, customerFactory) {

    $scope.selectedOrder = {};
    // Load old orders on enter
    $scope.$on('$ionicView.enter', function () {
        $scope.loadOldOrders();

        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.start();

        if ($rootScope.cartItems.length > 0)
            $rootScope.showCartFabButton = true; //show the cart button when the cart has items
    });

    //Create 'old order details' modal to display information about the selected order
    $ionicModal.fromTemplateUrl('order-details-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.orderDetailsModal = modal;
    }, function(reason){
       console.log(reason);
   });

    $scope.showOrderDetails = function (order) {
        $scope.selectedOrder = order;
        $scope.orderDetailsModal.show();
    };

    $scope.closeOrderDetails = function () {
        $scope.orderDetailsModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.orderDetailsModal.remove();
    });

    $scope.totalOrder = function (x, y) {
        //Subtracting a Zero converts the input to an integer number
        return parseInt(x) + parseInt(y);
    };

    $scope.loadOldOrders = function () {
        if ($rootScope.isUserLoggedin == true) {
            deliveryLoader.showLoading($translate.instant('LOADING'));

            customerFactory.getCustomerOrders().success(function (data) {
                try {
                    $scope.oldOrders = data;
                    deliveryLoader.hideLoading();
                } catch (e) {
                    deliveryLoader.hideLoading();
                    connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(500, ''));
                }
            }).error(function (err, statusCode) {
                connectionFactory.testConnection().success(function (data) {
                    deliveryLoader.hideLoading();
                    connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(Number(statusCode), 'OLD_ORDERS'));
                }).error(function (err, statusCode) {
                    deliveryLoader.hideLoading();
                    connectionFactory.exitApplication();
                });
            })
        }
        else {
            // Show a warning popup if not logged in
            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('LOGIN_REQUIRED'),
                template: $translate.instant('PLEASE_LOGIN')
            });
        }
        
    };

    //addToCart: add the selected item to '$rootScope.cartItems' (defined in 'controllers.js)
    $scope.repeatOrder = function (order) {
        var shopDetails = order.shop;

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
            else {
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