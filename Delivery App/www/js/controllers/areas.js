angular.module('delivery.controllers')

.controller('AreasCtrl', function ($scope, $rootScope, $ionicLoading, $http, $timeout, $ionicFilterBar, $ionicSlideBoxDelegate, connectionFactory, storageUtilityFactory, areasFactory, deliveryLoader) {

    $rootScope.selectedArea = {};
    $scope.areas = $scope.selectedCity.areas;
    $scope.done_loading = true;

    /// <summary>setArea: add the selected area to '$rootScope' and 'localStorage' then redirect the user to main view</summary>
    /// <param name="i" type="integer">The id of the selected area</param>
    $scope.setArea = function (area) {
        connectionFactory.testConnection().success(function (data) {
            $rootScope.selectedArea = area;
            storageUtilityFactory.setSelectedArea(area);

            // Hide the modal and show the main view
            $rootScope.areasModal.hide();
            $rootScope.showMainView = true;

            //load required shops by business category and selected delivered area 
            $rootScope.loadShops();

            //this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
            $ionicSlideBoxDelegate.update();
        }).error(function (err, statusCode) {
            connectionFactory.exitApplication();
        })

    };

    $scope.prevStep = function () {
        $rootScope.areasModal.hide();
        $rootScope.citiesModal.show();
    };
});