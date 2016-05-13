angular.module('delivery.controllers')

.controller('AreasCtrl', function ($scope, $rootScope, $ionicLoading, $http, $timeout, $ionicFilterBar, $ionicSlideBoxDelegate,areasFactory,deliveryLoader) {

    $scope.areas = [];
    deliveryLoader.showLoading('Loading...');
    areasFactory.get().success(function (data) {
        $scope.areas = data;
        deliveryLoader.hideLoading();
     }).error(function (err, statusCode) {
         deliveryLoader.hideLoading();
         deliveryLoader.toggleLoadingWithMessage(err.message);
     })

     $scope.done_loading = true;
     $rootScope.selectedArea = {};

     /// <summary>setArea: add the selected area to '$rootScope' and 'localStorage' then redirect the user to main view</summary>
     /// <param name="i" type="integer">The id of the selected area</param>
     $scope.setArea = function (i) {
        $rootScope.selectedArea = { id: i, name: $scope.areas[i - 1].name };
        localStorage.setItem("areaID", i);
        localStorage.setItem("areaName", $scope.areas[i - 1].name);

        // Hide the modal and show the main view
        $rootScope.areasModal.hide();
        $rootScope.showMainView = true;
        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
    };

    /// <summary>prevStep: redirect the user back to select cities modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $rootScope.areasModal.hide();
        $rootScope.citiesModal.show();
    };
});