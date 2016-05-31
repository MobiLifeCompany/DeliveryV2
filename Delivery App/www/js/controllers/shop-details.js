angular.module('delivery.controllers')

.controller('ShopDetailsCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading, $ionicModal, $translate, $timeout, $http, $ionicPlatform, $ionicPopup, ionicMaterialInk, shopDetailsFactory, deliveryLoader, errorCodeMessageFactory) {


    $scope.shopDetails = [];
    $rootScope.selectedShop={};
    $scope.categories = [];

    $scope.shopDetails = shopDetailsFactory.get($stateParams.shopId === "" ? $rootScope.shopId : $stateParams.shopId);
  
    
    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.cartItems.length > 0)
            $rootScope.showCartFabButton = true; //show the cart button when the cart has items
    })

    deliveryLoader.showLoading($translate.instant('LOADING'));
    shopDetailsFactory.getShopItemsCategories().success(function (data) {
        $scope.categories = data;
       deliveryLoader.hideLoading();
    }).error(function (err, statusCode) {
        deliveryLoader.hideLoading();
        deliveryLoader.toggleLoadingWithMessage(deliveryLoader.toggleLoadingWithMessage(errorCodeMessageFactory.getErrorMessage(statusCode)));
    })


    // toggleCategory if given category is the selected category, deselect it. else, select the given category
    $scope.toggleCategory = function (category) {
        if ($scope.isCategoryShown(category)) {
            $scope.shownCategory = null;
        } else {
            $scope.shownCategory = category;
        }
    };

    $scope.isCategoryShown = function (category) {
        return $scope.shownCategory === category;
    };

    // toggleNotifications: toggle between 'promotions' And 'warning'
    $scope.toggleNotifications = function (notification) {
        if ($scope.isNotificationShown(notification)) {
            $scope.shownNotification = null;
        } else {
            $scope.shownNotification = notification;
        }
    };

    $scope.isNotificationShown = function (notification) {
        return $scope.shownNotification === notification;
    };

    //showMap: Show a map of the shop with position marker, will be called from the 'shopInfoModal' when it's shown
    $scope.showMap = function () {
        var latLng = new google.maps.LatLng($scope.shopDetails.longitude, $scope.shopDetails.latitude);
        var mapOptions = {
            center: latLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng($scope.shopDetails.longitude, $scope.shopDetails.latitude),
            map: map,
            title: $scope.shopDetails.name
        });

        $scope.map = map;
    }

    //Create 'Shop info' modal to display detailed information about the selected shop
    $ionicModal.fromTemplateUrl('shop-info-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.shopInfoModal = modal;
    });

    $scope.showShopInfo = function () {
        $scope.shopInfoModal.show();
        $scope.showMap();
    };

    $scope.closeShopInfo = function () {
        $scope.shopInfoModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.shopInfoModal.remove();
    });
    $scope.$on('modal.hidden', function () {
        $scope.$on('$destroy', function () {
            $scope.map = null;
        });
    });

    //Create 'item details' modal to display information about the selected item
    $ionicModal.fromTemplateUrl('item-details-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.itemDetailsModal = modal;
    });

    $scope.showItemDetails = function (item) {
        $scope.selectedItem = item;
        var selectedItemQuantity = document.getElementById(item.id).innerHTML;
        $scope.itemDetailsModal.show();
        document.getElementById('selectedItemId').innerHTML = selectedItemQuantity;
    };

    $scope.closeItemDetails = function () {
        $scope.itemDetailsModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.itemDetailsModal.remove();
    });

    $scope.getCurrentDeliverHour = function (){
        days = $scope.shopDetails.delivery_hours;
        var weekDays = ["sat","sun","mon","tue","wed","thu","fri"];
        var d=new Date();
        dayNumber = d.getDay();
        for (i = 0; i < days.length; i++) {
            if (days[i].day == weekDays[dayNumber]) {
                return days[i].open;
            }
        }
        return "";
    }
    //increaseAmount: increase the item quantity counter label when click on '+' button
    $scope.increaseQuantity = function (itemQuantity) {
        var item = document.getElementById(itemQuantity);
        item.innerHTML = parseInt(item.innerHTML) + 1;
    };

    //decreseAmount: decrease the item quantity counter label when click on '-' button
    $scope.decreseQuantity = function (itemQuantity) {
            var item = document.getElementById(itemQuantity);
            if (parseInt(item.innerHTML) > 1) {
                item.innerHTML = parseInt(item.innerHTML) - 1;
            }
    };

    //increaseAmountFromModal: increase the item quantity counter on 'itemDetailsModal' when click on '+' button
    $scope.increaseQuantityFromModal = function (itemQuantity) {
        var item = document.getElementById(itemQuantity);
        var selectedItem = document.getElementById('selectedItemId');
        item.innerHTML = selectedItem.innerHTML = parseInt(item.innerHTML) + 1;
    };

    //decreseAmountFromModal: decrease the item quantity counter on 'itemDetailsModal' when click on '-' button
    $scope.decreseQuantityFromModal = function (itemQuantity) {
        var item = document.getElementById(itemQuantity);
        var selectedItem = document.getElementById('selectedItemId');
        if (parseInt(item.innerHTML) > 1) {
            item.innerHTML = selectedItem.innerHTML = parseInt(item.innerHTML) - 1;
        }
    };

    //addToCart: add the selected item to '$rootScope.cartItems' (defined in 'controllers.js)
    $scope.addToCart = function (item, shop) {
        shop.is_open = true;
        if (!shop.is_open) {

            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('SHOP_CLOSED'),
                template: $translate.instant('CANT_ORDER_SHOP_CLOSED'),
            });
        }
        else {
            if ($rootScope.cartShop == null || shop.id == $rootScope.cartShop.id) {
                var isNewItem = true; // used to determine if the added item is new or allready in the cart
                var quantity = document.getElementById(item.id).innerHTML;
                $rootScope.showCartFabButton = true; //Set '$rootScope.showCartFabButton' (defined in 'controllers.js) to true, used to show the cart fab button in bottom right corner
                $rootScope.cartShop = $scope.shopDetails; //Set the shop for the current order, don't allow items from other shops to be added to the cart
                for (i = 0; i < $rootScope.cartItems.length; i++) {
                    if ($rootScope.cartItems[i].id == item.id) { //if item allready exists in cart, update the quantity
                        $rootScope.cartItems[i].quantity = quantity;
                        isNewItem = false;
                        i = $rootScope.cartItems.length; //break the loop
                    }

                }
                if (isNewItem) //all new item to cart
                    $rootScope.cartItems.push({ id: item.id, name: item.name, description: item.description, photo: item.photo, quantity: quantity, price: item.price });
            }
            else {
                // Show a warning popup if shop changed
                var confirmPopup = $ionicPopup.confirm({
                    title: $translate.instant('CHANGE_SHOP'),
                    template: $translate.instant('CHANGE_SHOP_MSG'),
                    cancelText: $translate.instant('NO'),
                    okText: $translate.instant('YES')
                });

                // Resolve the promise returned by the popup, then empty the cart if user confirm
                confirmPopup.then(function (res) {
                    if (res) {
                        //if user click 'yes': empty the cart, change the cart shop and add the new item from the new shop
                        $rootScope.cartShop = shop;
                        $rootScope.cartItems = [];
                        var quantity = document.getElementById(item.id).innerHTML;
                        $rootScope.cartItems.push({ id: item.id, name: item.name, description: item.description, photo: item.photo, quantity: quantity, price: item.price });
                    }
                });
            }
        }
    };

    $scope.checkItemCount = function (itemId) {
        var itemQty = 1;
        for (i = 0; i < $rootScope.cartItems.length; i++) {
            if ($rootScope.cartItems[i].id == itemId) {
                itemQty = $rootScope.cartItems[i].quantity;
            }
        }

        return itemQty;
    }
});