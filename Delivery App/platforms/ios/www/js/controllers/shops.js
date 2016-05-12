angular.module('delivery.controllers')

.controller('ShopsCtrl', function ($scope, $rootScope,$ionicLoading, $ionicModal, $timeout, $ionicPlatform, $ionicFilterBar) {
    $ionicLoading.show();
    // wait for 3 seconds and hide the overlay
    $timeout(function () {
        $ionicLoading.hide();
        $scope.done_loading = true;
    }, 500);

    $scope.shops = [
        { title: 'Shop ONE', id: 1, src: "img/categories/icon1.jpg", rating: 3, masteries: ['Fast Food', 'Salads', 'Burgers']},
        { title: 'Shop TWO', id: 2, src: "img/categories/icon2.jpg", rating: 4, masteries: ['Arabic', 'Sweets', 'Grill'] },
        { title: 'Shop THREE', id: 3, src: "img/categories/icon3.jpg", rating: 4, masteries: ['Checken', 'Salads', 'Burgers'] },
        { title: 'Shop FOUR', id: 4, src: "img/categories/icon4.jpg", rating: 5, masteries: ['Pizza', 'deserts'] },
        { title: 'Shop FIVE', id: 5, src: "img/categories/icon5.jpg", rating: 2, masteries: ['Salads', 'Burgers'] },
        { title: 'Shop SIX', id: 6, src: "img/categories/icon6.jpg", rating: 2, masteries: ['Fast Food', 'Salads', 'Burgers'] }
    ];

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
            filterProperties: 'title'
        });
    };
});