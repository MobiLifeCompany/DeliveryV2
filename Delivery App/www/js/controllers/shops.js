angular.module('delivery.controllers')

.controller('ShopsCtrl', function ($scope, $rootScope, $ionicLoading, $translate, $ionicModal, $ionicPopover, $ionicPopup, $state, $ionicHistory, $ionicSlideBoxDelegate, $timeout, $http, $ionicPlatform, $ionicFilterBar, $ionicActionSheet, $cordovaSocialSharing, ionicMaterialInk, connectionFactory, shopDetailsFactory, shopsFactory, mastriesFactory, deliveryLoader, errorCodeMessageFactory) {

    $rootScope.shops = [];
    $rootScope.masteriesArray = [];
    $rootScope.masteriesCheckList = [];
    $rootScope.goldenOffers = [];
    //$rootScope.shopDetails = shopDetailsFactory.get($stateParams.shopId);

    $scope.$on('$ionicView.loaded', function () {
        if ($rootScope.showMainView)
        {
            deliveryLoader.showLoading($translate.instant('LOADING'));

            $rootScope.loadGoldenOffers();
            $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
            $ionicSlideBoxDelegate.slide(0);
            $ionicSlideBoxDelegate.start();
            $rootScope.loadShops();
        }
        
    });

    $scope.$on('$ionicView.enter', function () {
        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.start();
    });

    $rootScope.$watch('showMainView', function () {
        if ($rootScope.showMainView && $rootScope.isCategorySelected)
        {
            deliveryLoader.showLoading($translate.instant('LOADING'));

            $rootScope.loadGoldenOffers();
            $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
            $ionicSlideBoxDelegate.slide(0);
            $ionicSlideBoxDelegate.start();
            $rootScope.loadShops();
        }
    });

    /// <summary>loadGoldenOffers: Load all golden offers and save an array to be used when needed in golden offers slider</summary>
    /// <param>No parameters</param>
    $rootScope.loadGoldenOffers = function () {
        shopsFactory.getOffers().success(function (data) {
            try {
                var goldenOffers = [];
                for (i = 0; i < data.length; i++) {
                    if (data[i].offer_type === 'GOLDEN')
                        goldenOffers.push(data[i]);
                }
                $rootScope.goldenOffers = goldenOffers;
                $ionicSlideBoxDelegate.update();

            } catch (e) {
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(500, ''));
            }
        }).error(function (err, statusCode) {
            connectionFactory.testConnection().success(function (data) {
                connectionFactory.showAlertPopup($translate.instant('ERROR'), err.message);
            }).error(function (err, statusCode) {
                connectionFactory.exitApplication();
            });
        })
    };

    $rootScope.loadShops = function () {
        shopsFactory.get().success(function (data) {
            try{
                $rootScope.shops = data;
                if ($rootScope.shops.length > 0) {
                    $rootScope.masteriesCheckList = [];
                    $rootScope.masteriesArray = mastriesFactory.get($rootScope.shops);
                    //prepare masteries filter array, add 'checked' parameter to original 'masteriesArray' for binding it to checkboxes
                    for (i = 0; i < $rootScope.masteriesArray.length; i++) {
                        $rootScope.masteriesCheckList.push({ name: $rootScope.masteriesArray[i].name, checked: false });
                    }
                    $scope.noShopsFound = false;
                }
                else
                    $scope.noShopsFound = true;
            } catch (e) {
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(500, ''));
            }
            deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
           connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), err.message);
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
            $scope.noShopsFound = true;
        })
    };

    
    $scope.done_loading = true;

    //set the default order criteria to 'rating' And filtering
    $scope.orderCriteria = 'rating';
    $scope.descending = true;
    $scope.isMasteryFilterSet = false;
    $scope.isAdvanceFilterSet = false;
    $scope.advanceFilter = {minDeliveryValue: 10000, deliveryTime: 120, rating: 0, showClosed: true, promotionOnly: false};


    // Create options popover
    $ionicPopover.fromTemplateUrl('options-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.optionsPopover = popover;
    });

    $scope.closePopover = function () {
        $scope.optionsPopover.hide();
    };

    $scope.openPopover = function () {
        $scope.optionsPopover.show();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.optionsPopover.remove();
    });

    $scope.showPopover = function () {
        $scope.openPopover();
    };

    $scope.changeAddress = function () {
        $rootScope.showMainView = false // hide the main screen while changing address
        if ($rootScope.isUserLoggedin) {
            $ionicModal.fromTemplateUrl('templates/saved-areas.html', {
                scope: $rootScope,
                hardwareBackButtonClose: false,
            }).then(function (modal) {
                $rootScope.savedAreasModal = modal;
                $rootScope.savedAreasModal.show();
            });
        }
        else {
            $ionicModal.fromTemplateUrl('templates/cities.html', {
                id: '12',
                scope: $rootScope,
                hardwareBackButtonClose: false,
            }).then(function (modal) {
                $rootScope.citiesModal = modal;
                $rootScope.citiesModal.show();
            });
        }
    };

    $scope.changeCategory = function () {
        $rootScope.showMainView = false // hide the main screen while changing address
        $rootScope.categoriesModal.show();
    };

    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.shops,
            update: function (filteredItems) {
                $scope.shops = filteredItems;
            },
            filterProperties: 'name'
        });
    };

    $rootScope.goBackToShops = function () {
        $state.go('app.shops'); //go back to start view 'shops'
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
    };

    //Create 'Sort By' modal to display it as bottom sheet
    $ionicModal.fromTemplateUrl('sort-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.sortModal = modal;
    });

    //Create 'Filter By' modal to display it as bottom sheet
    $ionicModal.fromTemplateUrl('filter-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.filterModal = modal;
    });

    //Create 'Advance Filter' modal to display it as bottom sheet
    $ionicModal.fromTemplateUrl('advance-filter-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.advanceFilterModal = modal;
    });

    /// <summary>showSort: Show the 'Sort By' bottom sheet (modal) when the corresponding tab item is clicked</summary>
    $scope.showSort = function () {
        $scope.sortModal.show();
    };

    $scope.closeSort = function () {
        $scope.sortModal.hide();
    };

    $scope.sortByAlphabet = function () {
        $scope.orderCriteria = 'name';
        $scope.descending = false;
        $scope.sortModal.hide();
    };

    $scope.sortByReview = function () {
        $scope.orderCriteria = 'rating';
        $scope.descending = true;
        $scope.sortModal.hide();
    };

    /// <summary>showFilter: Show the 'filter by' bottom sheet (modal) when the corresponding tab item is clicked</summary>
    /// <param>No parameters</param>
    $scope.showFilter = function () {
        $scope.filterModal.show();
    };

    $scope.closeFilter = function () {
        $scope.filterModal.hide();
    };

    /// <summary>showAdvanceFilter: Show the 'advance filter' bottom sheet (modal) when the corresponding tab item is clicked</summary>
    /// <param>No parameters</param>
    $scope.showAdvanceFilter = function () {
        $scope.advanceFilterModal.show();
    };

    $scope.closeAdvanceFilter = function () {
        $scope.advanceFilterModal.hide();
    };

    /// <summary>filterFunction: filter the shops list according to mastery filter & advance filters</summary>
    $scope.filterFunction = function (element) {
        var matchFilter = false;
        $scope.isMasteryFilterSet = false;
        //Apply advance filter first
        if (element.min_amount <= $scope.advanceFilter.minDeliveryValue &&
            parseInt(element.estimation_time) <= $scope.advanceFilter.deliveryTime &&
            ($scope.advanceFilter.rating == 0 || element.rating <= $scope.advanceFilter.rating) &&
            ($scope.advanceFilter.showClosed == true || $scope.advanceFilter.showClosed == false && element.is_open == true) &&
            ($scope.advanceFilter.promotionOnly == false || $scope.advanceFilter.promotionOnly == true && element.promotion_note != null)) {

            // Then apply mastery filter
            //loop through the masteryCheckList to see if any mastery is checked
            for (i = 0; i < $rootScope.masteriesCheckList.length; i++) {
                if ($rootScope.masteriesCheckList[i].checked)
                    $scope.isMasteryFilterSet = true;
            }
            //if any mastery had been checked '$scope.isMasteryFilterSet == true'  -> filter the list
            if ($scope.isMasteryFilterSet) {
                for (i = 0; i < $rootScope.masteriesCheckList.length; i++) {
                    if ($rootScope.masteriesCheckList[i].checked) {
                        if ((element.masteries.indexOf($rootScope.masteriesCheckList[i].name) > -1))
                            matchFilter = true;
                    }
                }
            }
            else
                matchFilter = true;
        }
        

        return matchFilter;
    };

    $scope.clearMasteryFilter = function () {
        $scope.isMasteryFilterSet = false;
        for (i = 0; i < $rootScope.masteriesCheckList.length; i++) {
            $rootScope.masteriesCheckList[i].checked = false;
            $scope.filterModal.hide();
        }
    }

    $scope.clearAdvanceFilter = function () {
        $scope.isAdvanceFilterSet = false;
        $scope.advanceFilter = { minDeliveryValue: 10000, deliveryTime: 120, rating: 0, showClosed: true, promotionOnly: false };
        $scope.advanceFilterModal.hide();
    }

    //Create 'item details' modal to display information about the selected item
    $ionicModal.fromTemplateUrl('item-details-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.itemDetailsModal = modal;
    });

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

    $scope.closeItemDetails = function () {
        $scope.itemDetailsModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.itemDetailsModal.remove();
    });

    //increaseAmountFromModal: increase the item quantity counter on 'itemDetailsModal' when click on '+' button
    $scope.increaseQuantityFromModal = function (itemId, item) {
        var selectedItem = document.getElementById('selectedItemId');
        selectedItem.innerHTML = parseInt(selectedItem.innerHTML) + 1;
        $scope.addToCart(item, $scope.shopDetails);
    };

    //decreseAmountFromModal: decrease the item quantity counter on 'itemDetailsModal' when click on '-' button
    $scope.decreseQuantityFromModal = function (itemId, item) {
        var selectedItem = document.getElementById('selectedItemId');
        if (parseInt(selectedItem.innerHTML) > 0) {
            selectedItem.innerHTML = parseInt(selectedItem.innerHTML) - 1;
            $scope.addToCart(item, $scope.shopDetails);
        }
    };

    //addToCart: add the selected item to '$rootScope.cartItems' (defined in 'controllers.js)
    $scope.addToCart = function (item, shop) {
        if (shop.is_open) {
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
        message += ($rootScope.versionCountry == 'lb')?$translate.instant('SHARED_USING_DELIVERY_LB'):$translate.instant('SHARED_USING_DELIVERY_SY') + '\n';
        
        $cordovaSocialSharing
            .share(message, $translate.instant('APPLICATION_NAME'), offer.item.photo, $rootScope.downloadURL) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
    };

});