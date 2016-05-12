angular.module('delivery.controllers')

.controller('ShopsCtrl', function ($scope, $rootScope, $ionicLoading, $ionicModal, $timeout, $ionicPlatform, $ionicFilterBar, $ionicActionSheet, ionicMaterialInk) {
    $ionicLoading.show();
    // wait for 3 seconds and hide the overlay
    $timeout(function () {
        $ionicLoading.hide();
        $scope.done_loading = true;
    }, 500);

    $scope.shops = [
        { name: 'KFC', id: 1, src: "img/shops/kfc.jpg", rating: 3, masteries: ['Fast Food', 'Salads', 'Burgers'], minAmount: '10$', deliveryTime: '45 min' ,hasPromotion: true, isOpen: true },
        { name: 'McDonalds', id: 2, src: "img/shops/mcdonalds.jpg", rating: 4, masteries: ['Arabic', 'Sweets', 'Grill'], minAmount: '15$', deliveryTime: '30 min', hasPromotion: false, isOpen: true },
        { name: 'Pizza Hut', id: 3, src: "img/shops/pizza_hut.jpg", rating: 4, masteries: ['Chiken', 'Salads', 'Burgers'], minAmount: '10$', deliveryTime: '45 min', hasPromotion: false, isOpen: false },
        { name: 'Dominos Pizza', id: 4, src: "img/shops/dominos.jpg", rating: 5, masteries: ['Pizza', 'Deserts'], minAmount: '12$', deliveryTime: '40 min', hasPromotion: true, isOpen: true },
        { name: 'Shop FIVE', id: 5, src: "img/categories/icon5.jpg", rating: 2, masteries: ['Salads', 'Burgers'], minAmount: '8$', deliveryTime: '45 min', hasPromotion: true, isOpen: true },
        { name: 'Shop SIX', id: 6, src: "img/categories/icon6.jpg", rating: 2, masteries: ['Fast Food', 'Salads', 'Burgers'], minAmount: '10$', deliveryTime: '45 min', hasPromotion: false, isOpen: true }
    ];

    $scope.masteries = [
        {name: 'Chicken'},
        { name: 'Fast Food' },
        { name: 'Salads' },
        { name: 'Pizza' },
        { name: 'Burgers' },
        { name: 'Grill' },
        { name: 'Sweets' },
        { name: 'Deserts' }
    ];

    //set the default order criteria to 'rating'
    $scope.orderCriteria = 'rating';
    $scope.descending = true;

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

    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.shops,
            update: function (filteredItems) {
                $scope.shops = filteredItems;
            },
            filterProperties: 'name'
        });
    };

    //Create 'Sort By' modal to display it as bottom sheet
    $ionicModal.fromTemplateUrl('sort-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.sortModal = modal;
    });

    //Create 'Sort By' modal to display it as bottom sheet
    $ionicModal.fromTemplateUrl('filter-modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.filterModal = modal;
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
});