angular.module('delivery.controllers')

.controller('ShopsCtrl', function ($scope, $rootScope, $ionicLoading, $translate, $ionicModal, $ionicPopover, $state, $ionicHistory, $ionicSlideBoxDelegate, $timeout, $http, $ionicPlatform, $ionicFilterBar, $ionicActionSheet, ionicMaterialInk, connectionFactory, shopDetailsFactory, shopsFactory, mastriesFactory, deliveryLoader, errorCodeMessageFactory) {

    $rootScope.shops = [];
    $rootScope.masteriesArray = [];
    $rootScope.masteriesCheckList = [];
    $rootScope.shopsOffers = [];
    //$rootScope.shopDetails = shopDetailsFactory.get($stateParams.shopId);

    $scope.$on('$ionicView.enter', function () {
        connectionFactory.testConnection(deliveryLoader).success(function (data) {
            $rootScope.loadShops(deliveryLoader);
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.exitApplication();
        })
    });

    $rootScope.loadShops = function (deliveryLoader) {
        shopsFactory.get().success(function (data) {
            try{
                $rootScope.shops = data;
                if ($rootScope.shops.length > 0) {
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
            deliveryLoader.hideLoading();
            connectionFactory.showAlertPopup($translate.instant('ERROR'), err.message);
            $scope.noShopsFound = true;
        })
    };

    $rootScope.loadShopsOffers = function (deliveryLoader) {
        shopsFactory.getOffers().success(function (data) {
            try {
                var silverOffers = [];
                for (i = 0; i < data.length; i++) {
                    if (data[i].offer_type === 'GOLDEN')
                        silverOffers.push(data[i]);
                }
                $scope.shopsOffers = silverOffers;
                $ionicSlideBoxDelegate.update();
                deliveryLoader.hideLoading();

            } catch (e) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(500, ''));
            }
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.showAlertPopup($translate.instant('ERROR'), err.message);
        })
    };

    connectionFactory.testConnection(deliveryLoader).success(function (data) {
      $rootScope.loadShopsOffers(deliveryLoader);
    }).error(function (err, statusCode) {
        deliveryLoader.hideLoading();
        connectionFactory.exitApplication();
    })
    
    $scope.done_loading = true;

    //set the default order criteria to 'rating' And filtering
    $scope.orderCriteria = 'rating';
    $scope.descending = true;
    $scope.isMasteryFilterSet = false;
    $scope.isAdvanceFilterSet = false;
    $scope.advanceFilter = {minDeliveryValue: 10000, deliveryTime: 120, rating: 0, showClosed: true, promotionOnly: false};

    // use ionicView.loaded event to load shops when navigating from checkout view after clearing $ionicHistory cache and history
    $scope.$on('$ionicView.loaded', function () {
        connectionFactory.testConnection(deliveryLoader).success(function (data) {
            if ($rootScope.showMainView)
                $rootScope.loadShops(deliveryLoader);
            else
                deliveryLoader.hideLoading();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.exitApplication();
        })
    });


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
        //Apply advance filter first
        if (element.min_amount <= $scope.advanceFilter.minDeliveryValue &&
            parseInt(element.estimation_time) <= $scope.advanceFilter.deliveryTime &&
            ($scope.advanceFilter.rating == 0 || element.rating <= $scope.advanceFilter.rating) &&
            ($scope.advanceFilter.showClosed == true || $scope.advanceFilter.showClosed == false && element.is_open == true) &&
            ($scope.advanceFilter.promotionOnly == false || $scope.advanceFilter.promotionOnly == true && element.promotion_note != null)) {

            // Then apply mastery filter
            //loop through the masteryCheckList to see if any mastery is checked
            for (i = 0; i < $scope.masteriesCheckList.length; i++) {
                if ($scope.masteriesCheckList[i].checked)
                    $scope.isMasteryFilterSet = true;
            }
            //if any mastery had been checked '$scope.isMasteryFilterSet == true'  -> filter the list
            if ($scope.isMasteryFilterSet) {
                for (i = 0; i < $scope.masteriesCheckList.length; i++) {
                    if ($scope.masteriesCheckList[i].checked) {
                        if ((element.masteries.indexOf($scope.masteriesCheckList[i].name) > -1))
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
        for (i = 0; i < $scope.masteriesCheckList.length; i++) {
            $scope.masteriesCheckList[i].checked = false;
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

    $scope.showItemDetails = function (item, shop, clickable) {
        if (clickable) {
            $scope.selectedItem = item;
            $scope.shopDetails = shop;
            var selectedItemQuantity = 1;
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
    $scope.increaseQuantityFromModal = function (itemId) {
        var selectedItem = document.getElementById('selectedItemId');
        selectedItem.innerHTML = parseInt(selectedItem.innerHTML) + 1;
    };

    //decreseAmountFromModal: decrease the item quantity counter on 'itemDetailsModal' when click on '-' button
    $scope.decreseQuantityFromModal = function (itemId) {
        var selectedItem = document.getElementById('selectedItemId');
        if (parseInt(selectedItem.innerHTML) > 1) {
            selectedItem.innerHTML = parseInt(selectedItem.innerHTML) - 1;
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
                        $rootScope.cartItems[i].quantity = quantity;
                        $rootScope.shopId = shop.id;
                        isNewItem = false;
                        i = $rootScope.cartItems.length; //break the loop
                    }

                }
                if (isNewItem) //all new item to cart
                {
                    $rootScope.shopId = shop.id;
                    $rootScope.cartItems.push({ id: item.id, name: item.name, description: item.description, photo: item.photo, quantity: quantity, price: item.price });
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
        var itemQty = 1;
        for (i = 0; i < $rootScope.cartItems.length; i++) {
            if ($rootScope.cartItems[i].id == itemId) {
                itemQty = $rootScope.cartItems[i].quantity;
            }
        }
        return itemQty;
    }

});