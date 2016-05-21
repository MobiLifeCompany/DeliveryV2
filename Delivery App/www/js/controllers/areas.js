angular.module('delivery.controllers')

.controller('AreasCtrl', function ($scope, $rootScope, $ionicLoading, $http, $timeout, $ionicFilterBar, $ionicSlideBoxDelegate,areasFactory,deliveryLoader) {

     $scope.areas = [];
     $rootScope.selectedArea = {};
     $scope.areas = $scope.selectedCity.areas;
     $scope.done_loading = true;

     /// <summary>setArea: add the selected area to '$rootScope' and 'localStorage' then redirect the user to main view</summary>
     /// <param name="i" type="integer">The id of the selected area</param>
     $scope.setArea = function (area) {
        $rootScope.selectedArea = area;
        localStorage.setItem("areaID", area.id);
        localStorage.setItem("areaName", area.name);

        // Hide the modal and show the main view
        $rootScope.areasModal.hide();
        $rootScope.showMainView = true;
        $rootScope.loadShops();
        //this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
        $ionicSlideBoxDelegate.update();
    };

    $scope.prevStep = function () {
        $rootScope.areasModal.hide();
        $rootScope.citiesModal.show();
    };
});