angular.module('delivery.controllers')

.controller('RegisterCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $translate, $http, $ionicModal, connectionFactory, customerFactory, deliveryLoader) {

    $scope.customer = {};

    $rootScope.closeRegister = function () {
        $rootScope.registerModal.hide();
    };

    $rootScope.showRegister = function () {
        $rootScope.registerModal.show();
    }

    $scope.register = function () {
        connectionFactory.testConnection().success(function (data) {
            deliveryLoader.showLoading($translate.instant('LOADING'));
            $scope.customer.lang = $rootScope.lang;
            customerFactory.register($scope.customer).success(function (data) {
                deliveryLoader.hideLoading();
                $rootScope.registerModal.hide();
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('REGISTER'), errorCodeMessageFactory.getErrorMessage(statusCode, 'REGISTER'));
            });
        }).error(function (err, statusCode) {
            connectionFactory.exitApplication();
        })

    }
});