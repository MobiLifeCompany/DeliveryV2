angular.module('delivery.controllers')

.controller('OldOrdersCtrl', function ($scope, $rootScope, $ionicPopup, $translate, $state, shopDetailsFactory) {
    $scope.oldOrders = [{
        "customer_id": 4, "shop_id": 1, "customer_address_id": "1", "order_status": "PREPARED", "total": "2900", "qty": 2, "cancel_reason": null, "note": "ffff",
        "shop":
        {
            "id": 1, "name": "MacDonalds"
        },
        "customer_address":
        {
            "id": 1, "street": "Alquatly street", "building": "build-four", "floor": "2", "details": "eretertertert", "latitude": "123", "longitude": "123", "is_default": true,
            "city":
            {
                "id": 3, "country_id": 1, "name": "Hama"
            },
            "area":
            {
                "id": 3, "city_id": 3, "name": "Sahat al-assi"
            }
        },
        "items":
            [{ "id": 1, "name": "broasted", "quantity": 2, "price": 1000 }, { "id": 2, "name": "Crispy strips", "quantity": 1, "price": 900 }, { "id": 3, "name": "Cheese burger", "quantity": 2, "price": 1800 }]
    },
    {
        "customer_id": 4, "shop_id": 1, "customer_address_id": "1", "order_status": "FINISHED", "total": "3500", "qty": 3, "cancel_reason": null, "note": "ffff",
        "shop":
        {
            "id": 1, "name": "Pizza hut"
        },
        "customer_address":
        {
            "id": 1, "street": "al-wadi street", "building": "bld-556", "floor": "1", "details": "eretertertert", "latitude": "123", "longitude": "123", "is_default": true,
            "city":
            {
                "id": 3, "country_id": 1, "name": "Hama"
            },
            "area":
            {
                "id": 3, "city_id": 3, "name": "Alshareaa"
            }
        },
        "items":
            [{ "id": 1, "name": "medium pizza", "quantity": 2, "price": 1000 }, { "id": 2, "name": "special pizza", "quantity": 1, "price": 900 }]
    }
    ];

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
                            $rootScope.cartItems.push({ id: order.items[i].id, name: order.items[i].name, description: '', photo: '', quantity: order.items[i].quantity, price: order.items[i].price });
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
                    $rootScope.cartItems.push({ id: order.items[i].id, name: order.items[i].name, description: '', photo: '', quantity: order.items[i].quantity, price: order.items[i].price });
                }
                $rootScope.showCartFabButton = true; //Set '$rootScope.showCartFabButton' (defined in 'controllers.js) to true, used to show the cart fab button in bottom right corner
                $rootScope.cartShop = shopDetails; //Set the shop for the current order, don't allow items from other shops to be added to the cart
                $state.go('app.cart');
            }
        }
    };

});