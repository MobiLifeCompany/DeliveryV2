angular.module('delivery.controllers')

.controller('ShopsCtrl', function ($scope, $rootScope, $ionicLoading, $ionicModal, $timeout, $http, $ionicPlatform, $ionicFilterBar, $ionicActionSheet, ionicMaterialInk, shopsFactory, mastriesFactory, deliveryLoader) {

    $scope.shops = [];
    deliveryLoader.showLoading('Loading...');
    shopsFactory.get().success(function (data) {
        $scope.shops = data;
        $scope.masteriesArray = mastriesFactory.get($scope.shops);
        deliveryLoader.hideLoading();
     }).error(function (err, statusCode) {
         deliveryLoader.hideLoading();
         deliveryLoader.toggleLoadingWithMessage(err.message);
     })

    $scope.done_loading = true;

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