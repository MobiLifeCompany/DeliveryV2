angular.module('delivery.controllers')

.controller('RegisterCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $http, $ionicModal, customerFactory, deliveryLoader) {

    $scope.customer = {};
    
    $rootScope.closeRegister = function () {
        $rootScope.registerModal.hide();
    };

    $rootScope.showRegister = function () {
        $rootScope.registerModal.show();
    }

    $scope.register = function () {
        deliveryLoader.showLoading('Registering...');
        $scope.customer.lang = $rootScope.lang;
        customerFactory.register($scope.customer).success(function (data) {
            deliveryLoader.hideLoading();
            $rootScope.registerModal.hide();
        }).error(function (err, statusCode) {
            deliveryLoader.hideLoading();
            deliveryLoader.toggleLoadingWithMessage(statusCode +": " + err);
        });
    }
});