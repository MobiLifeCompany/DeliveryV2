angular.module('delivery.controllers')

.controller('ShopsCtrl', function ($scope, $rootScope, $ionicLoading, $ionicModal, $timeout, $http, $ionicPlatform, $ionicFilterBar, $ionicActionSheet, ionicMaterialInk, shopsFactory, mastriesFactory, deliveryLoader) {

    $scope.shops = [];
    $scope.masteriesArray = [];
    $scope.masteriesCheckList = [];
    deliveryLoader.showLoading('Loading...');
    shopsFactory.get().success(function (data) {
        $scope.shops = data;
        $scope.masteriesArray = mastriesFactory.get($scope.shops);

        //prepare masteries filter array, add 'checked' parameter to original 'masteriesArray' for binding it to checkboxes
        for (i = 0; i < $scope.masteriesArray.length; i++) {
            $scope.masteriesCheckList.push({ name: $scope.masteriesArray[i].name, checked: false });
        }

        deliveryLoader.hideLoading();
     }).error(function (err, statusCode) {
         deliveryLoader.hideLoading();
         deliveryLoader.toggleLoadingWithMessage(err.message);
     })

    $scope.done_loading = true;

    //set the default order criteria to 'rating' And filtering
    $scope.orderCriteria = 'rating';
    $scope.descending = true;
    $scope.isMasteryFilterSet = false;
    $scope.isAdvanceFilterSet = false;

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
        $scope.filterModal.hide();
    };

    /// <summary>filterFunction: filter the shops list according to mastery filter & advance filters</summary>
    $scope.filterFunction = function (element) {
        var matchFilter = false;

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

        return matchFilter;
    };

    $scope.clearMasteryFilter = function () {
        $scope.isMasteryFilterSet = false;
        for (i = 0; i < $scope.masteriesCheckList.length; i++) {
            $scope.masteriesCheckList[i].checked = false;
            $scope.filterModal.hide();
        }
    }
});