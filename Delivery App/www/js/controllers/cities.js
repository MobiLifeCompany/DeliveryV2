angular.module('delivery.controllers')

.controller('CitiesCtrl', function ($scope, $rootScope, $ionicLoading, $translate, $timeout, $http, $ionicModal, storageUtilityFactory, citiesFactory, deliveryLoader) {

    $scope.cities = [];
    $scope.done_loading = true;
    $rootScope.selectedCity = {};

    deliveryLoader.showLoading($translate.instant('LOADING'));
    citiesFactory.get().success(function (data) {
        $scope.cities = data.cities;
        deliveryLoader.hideLoading();
    }).error(function (err, statusCode) {
        deliveryLoader.hideLoading();
        deliveryLoader.toggleLoadingWithMessage(err.message);
    })
    
    /// <summary>setCity: Add the selected city to '$rootScope' and 'localStorage' then redirect the user to 'select area' modal</summary>
    /// <param name="i" type="integer">The id of the selected area</param>
    $scope.setCity = function (city) {
        $rootScope.selectedCity = city;
        storageUtilityFactory.setSelectedCity(city);

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
        $rootScope.loadCategories();
        $rootScope.categoriesModal.show();
        $rootScope.citiesModal.hide();
    }
});