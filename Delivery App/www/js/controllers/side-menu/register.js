angular.module('delivery.controllers')

.controller('RegisterCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $translate, $http, $ionicModal, connectionFactory, errorCodeMessageFactory, customerFactory, deliveryLoader) {

    $scope.customer = {};

    $rootScope.closeRegister = function () {
        $rootScope.registerModal.remove();
    };

    $scope.register = function () {
        deliveryLoader.showLoading($translate.instant('LOADING'));

        $scope.customer.lang = $rootScope.lang;
        customerFactory.register($scope.customer).success(function (data) {
            deliveryLoader.hideLoading();
            $rootScope.registerModal.hide();
            connectionFactory.showAlertPopup($translate.instant('REGISTER_SUCCESSFUL'), $translate.instant('ACCOUNT_CREATED'));
            $rootScope.showLogin();
        }).error(function (err, statusCode) {
            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('REGISTER'), errorCodeMessageFactory.getErrorMessage(statusCode, 'REGISTER'));
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
        });

    }
});