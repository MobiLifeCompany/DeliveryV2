angular.module('delivery.controllers')

.controller('ContactUsCtrl', function ($scope, $rootScope, $ionicHistory, $ionicPopup, $ionicLoading, $timeout, $translate, errorCodeMessageFactory, connectionFactory, authFactory, utilitiesFactory, deliveryLoader) {

    $scope.contactUsInfo = {};

    $scope.close = function () {
        $rootScope.contactUsModal.remove();
    };

    $scope.sendContactUsInfo = function () {
        connectionFactory.testConnection().success(function (data) {
            deliveryLoader.showLoading($translate.instant('LOADING'));
            if ($rootScope.isUserLoggedin == true)
                $scope.contactUsInfo.name = authFactory.getCustomer().full_name;
            utilitiesFactory.sendContactUsInfo($scope.contactUsInfo).success(function (data) {
                deliveryLoader.hideLoading();
                var alertPopup = $ionicPopup.alert({
                    title: $translate.instant('CONTACTUS_MSG'),
                    template: $translate.instant('CONTACTUS_SUCCESS_MSG'),
                });
                alertPopup.then(function (res) {
                    $scope.contactUsInfo = {};
                    $scope.close();
                });
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('ERROR'), errorCodeMessageFactory.getErrorMessage(404, 'CONTACTUS'));
            });
        }).error(function (err, statusCode) {
            connectionFactory.exitApplication();
        })

    }
});