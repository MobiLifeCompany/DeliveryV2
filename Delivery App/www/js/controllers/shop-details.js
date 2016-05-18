angular.module('delivery.controllers')

.controller('ShopDetailsCtrl', function ($scope, $rootScope, $stateParams, $ionicLoading, $ionicModal, $timeout, $http, $ionicPlatform, $ionicFilterBar, $ionicActionSheet, ionicMaterialInk, shopDetailsFactory, deliveryLoader) {

    $scope.shopDetails = [];
    //deliveryLoader.showLoading('Loading...');
    $scope.shopDetails = shopDetailsFactory.get($stateParams.shopId);

    //categories dummy data.. to be replaced
    $scope.categories = [];
    var itemId = 1;
    for (var i = 0; i < 10; i++) {
        $scope.categories[i] = {
            id: i,
            name: 'Category' + i,
            items: []
        };
        for (var j = 0; j < 3; j++) {
            $scope.categories[i].items.push({id: itemId, name: 'item ' + itemId++, description: 'item details to descripe the item', price: '10$', photo: 'img/shops/item'+j+'.jpg'});
        }
    }

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

    //increaseAmount: increase the item quantity counter label when click on '+' button
    $scope.increaseAmount = function (itemAmount) {
        var item = document.getElementById(itemAmount);
        item.innerHTML = parseInt(item.innerHTML) + 1;
    };

    //decreseAmount: decrease the item quantity counter label when click on '-' button
    $scope.decreseAmount = function (itemAmount) {
            var item = document.getElementById(itemAmount);
            if (parseInt(item.innerHTML) > 1) {
                item.innerHTML = parseInt(item.innerHTML) - 1;
            }
    };

    //increaseAmountFromModal: increase the item quantity counter on 'itemDetailsModal' when click on '+' button
    $scope.increaseAmountFromModal = function (itemAmount) {
        var item = document.getElementById(itemAmount);
        var selectedItem = document.getElementById('selectedItemId');
        item.innerHTML = selectedItem.innerHTML = parseInt(item.innerHTML) + 1;
    };

    //decreseAmountFromModal: decrease the item quantity counter on 'itemDetailsModal' when click on '-' button
    $scope.decreseAmountFromModal = function (itemAmount) {
        var item = document.getElementById(itemAmount);
        var selectedItem = document.getElementById('selectedItemId');
        if (parseInt(item.innerHTML) > 1) {
            item.innerHTML = selectedItem.innerHTML = parseInt(item.innerHTML) - 1;
        }
    };
});