angular.module('delivery.controllers')

.controller('ProfileCtrl', function ($scope, $rootScope, $ionicPopup, $ionicLoading, $timeout, $translate, connectionFactory, customerFactory, authFactory, deliveryLoader) {

    $scope.customer = authFactory.getCustomer();
    $scope.customer.phone = Number($scope.customer.phone);
    /// <summary>closeRegister: Close the register modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.profileModal.hide();
    };

    $scope.updateProfile = function () {
        connectionFactory.testConnection().success(function (data) {
            deliveryLoader.showLoading($translate.instant('LOADING'));
            customerFactory.updateProfile($scope.customer).success(function (data) {
                $rootScope.currentCustomerId = data.id;
                $rootScope.currentCustomerUserName = data.username;
                $rootScope.currentCustomerAuthToken = data.auth_token;
                data.password = $scope.customer.password;
                data.password_confirmation = $scope.customer.password;
                authFactory.deleteCustomer();
                authFactory.setCustomer(data);
                deliveryLoader.hideLoading();
                var alertPopup = $ionicPopup.alert({
                    title: $translate.instant('PROFILE'),
                    template: $translate.instant('PROFILE_SUCCESS_MSG'),
                });
                alertPopup.then(function (res) {
                    $scope.customer = {};
                    $scope.close();
                });

            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('PROFILE'), errorCodeMessageFactory.getErrorMessage(statusCode, 'PROFILE'));
            });
        }).error(function (err, statusCode) {
            connectionFactory.exitApplication();
        })
       
    }
});