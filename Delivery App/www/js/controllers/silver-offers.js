angular.module('delivery.controllers')

.controller('SilverOffersCtrl', function ($scope, $rootScope, $ionicLoading, $translate, $ionicModal, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaSocialSharing, shopsFactory, connectionFactory, deliveryLoader, errorCodeMessageFactory) {

    $scope.shopsOffers = [];

    // Load shop offers on enter
    $scope.$on('$ionicView.enter', function () {
        $scope.loadShopsOffers();

        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.start();

        if ($rootScope.cartItems.length > 0)
            $rootScope.showCartFabButton = true; //show the cart button when the cart has items
        
    });

    $scope.loadShopsOffers = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));

        shopsFactory.getOffers().success(function (data) {
            try {
                var silverOffers = [];
                for (i = 0; i < data.length; i++) {
                    if (data[i].offer_type === 'SILVER')
                        silverOffers.push(data[i]);
                }
                $scope.shopsOffers = silverOffers;
                deliveryLoader.hideLoading();
            } catch (e) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(500, ''));
            }
        }).error(function (err, statusCode) {
            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), err.message);
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
        })
    };

    //Create 'item details' modal to display information about the selected item
    $ionicModal.fromTemplateUrl('item-details-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.itemDetailsModal = modal;
    });

    $scope.closeItemDetails = function () {
        $scope.itemDetailsModal.hide();
    };

    $scope.showItemDetails = function (offer) {
        if (offer.clickable) {
            $scope.selectedOffer = offer;
            $scope.selectedItem = offer.item;
            $scope.shopDetails = offer.shop;
            var selectedItemQuantity = 0;
            $scope.itemDetailsModal.show();
            document.getElementById('selectedItemId').innerHTML = selectedItemQuantity;
        }
    };

    //Create 'item Photo' modal to display selected offer photo
    $ionicModal.fromTemplateUrl('item-photo-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.itemPhotoModal = modal;
    });

    $scope.closeItemPhoto = function () {
        $scope.itemPhotoModal.hide();
    };


    $scope.showItemPhoto = function (offerPhoto) {
        $scope.selectedPhotoSrc = offerPhoto;
        $scope.itemPhotoModal.show();
    };
    

    $scope.$on('$destroy', function () {
        $scope.itemDetailsModal.remove();
    });

    //increaseAmountFromModal: increase the item quantity counter on 'itemDetailsModal' when click on '+' button
    $scope.increaseQuantityFromModal = function (itemId, item, shopDetails) {
        var selectedItem = document.getElementById('selectedItemId');
        selectedItem.innerHTML = parseInt(selectedItem.innerHTML) + 1;

        $scope.addToCart(item, shopDetails);
    };

    //decreseAmountFromModal: decrease the item quantity counter on 'itemDetailsModal' when click on '-' button
    $scope.decreseQuantityFromModal = function (itemId, item, shopDetails) {
        var selectedItem = document.getElementById('selectedItemId');
        if (parseInt(selectedItem.innerHTML) > 0) {
            selectedItem.innerHTML = parseInt(selectedItem.innerHTML) - 1;
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
                var quantity = document.getElementById('selectedItemId').innerHTML;
                $rootScope.showCartFabButton = true; //Set '$rootScope.showCartFabButton' (defined in 'controllers.js) to true, used to show the cart fab button in bottom right corner
                $rootScope.cartShop = $scope.shopDetails; //Set the shop for the current order, don't allow items from other shops to be added to the cart
                for (i = 0; i < $rootScope.cartItems.length; i++) {
                    if ($rootScope.cartItems[i].id == item.id) { //if item allready exists in cart, update the quantity
                        if (quantity == 0)
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
                if ($rootScope.cartItems.length == 0) {
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

    $scope.shareOffer = function (offer) {
        var message = offer.item.name + '\n';
        message += offer.shop.name + '\n';
        message += $translate.instant('PRICE') + " " + offer.item.price + $rootScope.currency + '\n';
        message += ($rootScope.versionCountry == 'lb') ? $translate.instant('SHARED_USING_DELIVERY_LB') : $translate.instant('SHARED_USING_DELIVERY_SY') + '\n';

        $cordovaSocialSharing
            .share(message, $translate.instant('APPLICATION_NAME'), offer.item.photo, $rootScope.downloadURL) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    };

});