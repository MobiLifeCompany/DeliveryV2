angular.module('delivery.controllers')

.controller('AreasCtrl', function ($scope, $rootScope, $ionicLoading, $http, $timeout, $ionicFilterBar, connectionFactory, storageUtilityFactory, areasFactory, deliveryLoader) {

    $rootScope.selectedArea = {};
    $scope.areas = $scope.selectedCity.areas;
    $scope.done_loading = true;

    /// <summary>setArea: add the selected area to '$rootScope' and 'localStorage' then redirect the user to main view</summary>
    /// <param name="i" type="integer">The id of the selected area</param>
    $scope.setArea = function (area) {
        connectionFactory.testConnection(deliveryLoader).success(function (data) {
            $rootScope.selectedArea = area;
            storageUtilityFactory.setSelectedArea(area);

            // Hide the modal and show the main view
            $rootScope.areasModal.hide();
            $rootScope.showMainView = true;
            $rootScope.isCategorySelected = true;

            //load required shops by business category and selected delivered area 
            $rootScope.loadShops(deliveryLoader);

        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.exitApplication();
        })

    };

    $scope.prevStep = function () {
        $rootScope.areasModal.hide();
        $rootScope.citiesModal.show();
    };
});