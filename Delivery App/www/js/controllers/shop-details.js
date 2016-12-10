angular.module('delivery.controllers')

.controller('ShopDetailsCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading, $ionicModal, $translate, $timeout, $http, $ionicPlatform, $ionicPopup, $ionicFilterBar, $cordovaSocialSharing, $location, $anchorScroll, $ionicScrollDelegate, connectionFactory, ionicMaterialInk, shopDetailsFactory, deliveryLoader, errorCodeMessageFactory) {


    $scope.shopDetails = [];
    $rootScope.selectedShop = {};
    $scope.categories = [];
    $scope.items = [];
    $scope.isSearchApplied = false;

    $scope.shopDetails = shopDetailsFactory.get($stateParams.shopId === "" ? $rootScope.shopId : $stateParams.shopId);


    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.cartItems.length > 0)
            $rootScope.showCartFabButton = true; //show the cart button when the cart has items

        $scope.loadShopItemsCategories();
    })


    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.items,
            update: function (filteredItems) {
                $scope.items = filteredItems;
                $scope.isSearchApplied = true;
            },
            cancel: function () {
                $scope.isSearchApplied = false;
            },
            filterProperties: 'name'
        });
    };


    $scope.loadShopItemsCategories = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));

        shopDetailsFactory.getShopItemsCategories().success(function (data) {
            try {
                $scope.categories = data;
                for (i = 0; i < $scope.categories.length; i++) {
                    $scope.items = $scope.items.concat($scope.categories[i].items);
                }
                deliveryLoader.hideLoading();

            } catch (e) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(500, ''));
            }
            
        }).error(function (err, statusCode) {
            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), $translate.instant('COMMON_ERROR_MSG'));
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
        })
    }


    // toggleCategory if given category is the selected category, deselect it. else, select the given category
    $scope.toggleCategory = function (category) {
        if ($scope.isCategoryShown(category)) {
            $scope.shownCategory = null;
        } else {
            $location.hash(category.id);
            var handle = $ionicScrollDelegate.$getByHandle('content');
            handle.anchorScroll(true);
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

    //Create 'item Photo' modal to display selected item photo
    $ionicModal.fromTemplateUrl('item-photo-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.itemPhotoModal = modal;
    });

    $scope.closeItemPhoto = function () {
        $scope.itemPhotoModal.hide();
    };


    $scope.showItemPhoto = function (itemPhoto) {
        $scope.selectedPhotoSrc = itemPhoto;
        $scope.itemPhotoModal.show();
    };


    function findAndReplace(string, target, replacement) {
        var i = 0, length = string.length;
        for (i; i < length; i++) {
            string = string.replace(target, replacement);
        }
        return string;
    }
    $scope.replaceShift = function (open) {
        return $rootScope.lang == 'ar' ? findAndReplace(findAndReplace(open, 'am', $translate.instant('AM')),'pm', $translate.instant('PM')) : open;
    }

    $scope.getCurrentDeliverHour = function () {
        days = $scope.shopDetails.delivery_hours;
        var weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var d = new Date();
        dayNumber = d.getDay();
        for (i = 0; i < days.length; i++) {
            if (days[i].day == weekDays[dayNumber]) {
                return days[i].open;
            }
        }
        return "";
    }
    $scope.getDayName = function (dayName) {
        if (dayName === 'sat')
            return $translate.instant('SATURDAY');
        else if (dayName === 'sun')
            return $translate.instant('SUNDAY');
        else if (dayName === 'mon')
            return $translate.instant('MONDAY');
        else if (dayName === 'tue')
            return $translate.instant('TUESDAY');
        else if (dayName === 'wed')
            return $translate.instant('WEDNESDAY');
        else if (dayName === 'thu')
            return $translate.instant('THURSDAY');
        else if (dayName === 'fri')
            return $translate.instant('FRIDAY');
        return "";
    }

    
    //increaseAmount: increase the item quantity counter label when click on '+' button
    $scope.increaseQuantity = function (itemId, item, shopDetails) {
        var selectedItem = document.getElementById(itemId);
        selectedItem.innerHTML = parseInt(selectedItem.innerHTML) + 1;

        $scope.addToCart(item, shopDetails);
    };

    //decreseAmount: decrease the item quantity counter label when click on '-' button
    $scope.decreseQuantity = function (itemId, item, shopDetails) {
        var selectedItem = document.getElementById(itemId);
        if (parseInt(selectedItem.innerHTML) > 0) {
            selectedItem.innerHTML = parseInt(selectedItem.innerHTML) - 1;
            $scope.addToCart(item, shopDetails);
        }
    };

    //increaseAmountFromModal: increase the item quantity counter on 'itemDetailsModal' when click on '+' button
    $scope.increaseQuantityFromModal = function (itemId, item, shopDetails) {
        var menuItem = document.getElementById(itemId);
        var selectedItem = document.getElementById('selectedItemId');
        menuItem.innerHTML = selectedItem.innerHTML = parseInt(menuItem.innerHTML) + 1;

        $scope.addToCart(item, shopDetails);
    };

    //decreseAmountFromModal: decrease the item quantity counter on 'itemDetailsModal' when click on '-' button
    $scope.decreseQuantityFromModal = function (itemId, item, shopDetails) {
        var menuItem = document.getElementById(itemId);
        var selectedItem = document.getElementById('selectedItemId');
        if (parseInt(menuItem.innerHTML) > 0) {
            menuItem.innerHTML = selectedItem.innerHTML = parseInt(menuItem.innerHTML) - 1;
            $scope.addToCart(item, shopDetails);
        }
    };

    //addToCart: add the selected item to '$rootScope.cartItems' (defined in 'controllers.js)
    $scope.addToCart = function (item, shop) {
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
                        if(quantity == 0)
                            $rootScope.cartItems.splice(i, 1);
                        else
                            $rootScope.cartItems[i].quantity = quantity;
                        isNewItem = false;
                        i = $rootScope.cartItems.length; //break the loop
                    }

                }

                if (isNewItem) //all new item to cart
                    $rootScope.cartItems.push({ id: item.id, name: item.name, description: item.description, photo: item.photo, quantity: quantity, price: item.price });

                // if the cart become empty
                if ($rootScope.cartItems.length == 0)
                {
                    $rootScope.showCartFabButton = false;
                    $rootScope.cartShop = null;
                }
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
        var itemQty = 0;
        for (i = 0; i < $rootScope.cartItems.length; i++) {
            if ($rootScope.cartItems[i].id == itemId) {
                itemQty = $rootScope.cartItems[i].quantity;
            }
        }

        return itemQty;
    };

    $scope.shareShop = function () {
        var message = $scope.shopDetails.name + '\n';
        for (var i = 0; i < $scope.shopDetails.masteries.length; i++)
            message += $scope.shopDetails.masteries[i] + ' | ';
        message += '\n';
        message += $scope.shopDetails.address + '\n';
        message += ($rootScope.versionCountry == 'lb') ? $translate.instant('SHARED_USING_DELIVERY_LB') : $translate.instant('SHARED_USING_DELIVERY_SY') + '\n';

        $cordovaSocialSharing
            .share(message, $translate.instant('APPLICATION_NAME'), $scope.shopDetails.photo, $rootScope.downloadURL) // Share via native share sheet
            .then(function(result) {
              // Success!
            }, function(err) {
              // An error occured. Show a message to the user
            });
    };

    $scope.shareItem = function (item) {
        var message = item.name + '\n';
        message += $translate.instant('SHOP') + ": " + $scope.shopDetails.name + '\n';
        message += $translate.instant('PRICE') + " " + item.price +" "+ $rootScope.currency + '\n';
        message += ($rootScope.versionCountry == 'lb')?$translate.instant('SHARED_USING_DELIVERY_LB'):$translate.instant('SHARED_USING_DELIVERY_SY') + '\n';

        $cordovaSocialSharing
            .share(message, item.name, item.photo, $rootScope.downloadURL) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    }
});