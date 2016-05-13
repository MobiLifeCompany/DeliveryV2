angular.module('delivery.controllers')

.controller('CitiesCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $http, $ionicModal, citiesFactory, deliveryLoader) {

    $scope.cities = [];
    deliveryLoader.showLoading('Loading...');
    citiesFactory.get().success(function (data) {
        $scope.cities = data;
        deliveryLoader.hideLoading();
    }).error(function (err, statusCode) {
        deliveryLoader.hideLoading();
        deliveryLoader.toggleLoadingWithMessage(err.message);
    })
    
    $scope.done_loading = true;
    $rootScope.selectedCity = [];

    /// <summary>setCity: Add the selected city to '$rootScope' and 'localStorage' then redirect the user to 'select area' modal</summary>
    /// <param name="i" type="integer">The id of the selected area</param>
    $scope.setCity = function (i) {
        $rootScope.selectedCity = { id: i, name: $scope.cities[i - 1].name };
        localStorage.setItem("cityName", $scope.cities[i - 1].name);

        $ionicModal.fromTemplateUrl('templates/areas.html', {
            scope: $rootScope,
            hardwareBackButtonClose: false,
        }).then(function (modal) {
            $rootScope.areasModal = modal;
            $rootScope.areasModal.show();
        });

        // wait for 1 seconds and hide this modal, for a smoother transition and reduce flekering
        $timeout(function () {
            $rootScope.citiesModal.hide();
        }, 500);
    };

    /// <summary>prevStep: Redirect the user back to 'select categories' modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $rootScope.categoriesModal.show();
        $rootScope.citiesModal.hide();
    }
});