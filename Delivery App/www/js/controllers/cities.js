angular.module('delivery.controllers')

.controller('CitiesCtrl', function ($scope, $rootScope, $ionicLoading, $translate, $timeout, $http, $ionicModal, errorCodeMessageFactory, connectionFactory, storageUtilityFactory, citiesFactory, deliveryLoader) {

    $scope.cities = [];
    $scope.done_loading = true;
    $rootScope.selectedCity = {};

    $rootScope.$on('modal.shown', function (event, modal) {
        if (modal.id == '12') {
            //////////// functions calls on show//////////////////////
            $scope.loadCities();
        }
    });

    $scope.loadCities = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));

        citiesFactory.get().success(function (data) {
            $scope.cities = data.cities;
            deliveryLoader.hideLoading();

        }).error(function (err, statusCode) {
            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), $translate.instant('COMMON_ERROR_MSG'));
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
        })
    }

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
        $rootScope.categoriesModal.show();
        $rootScope.citiesModal.hide();
    }
});