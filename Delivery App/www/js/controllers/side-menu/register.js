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
        connectionFactory.testConnection(deliveryLoader).success(function (data) {
            $scope.customer.lang = $rootScope.lang;
            customerFactory.register($scope.customer, deliveryLoader).success(function (data) {
                deliveryLoader.hideLoading();
                $rootScope.registerModal.hide();
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('REGISTER'), errorCodeMessageFactory.getErrorMessage(statusCode, 'REGISTER'));
            });
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            connectionFactory.exitApplication();
        })

    }
});