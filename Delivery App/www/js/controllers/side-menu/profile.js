angular.module('delivery.controllers')

.controller('ProfileCtrl', function ($scope, $rootScope, $ionicPopup, $ionicLoading, $timeout, $translate, connectionFactory, customerFactory, authFactory, deliveryLoader) {

    $scope.customer = authFactory.getCustomer();
    $scope.customer.phone = Number($scope.customer.phone);
    //$scope.customerProfile = {};
    /// <summary>closeRegister: Close the register modal when user press back</summary>
    /// <param>No parameters</param>
    $scope.close = function () {
        $rootScope.profileModal.remove();
    };

    $scope.updateProfile = function () {
         $scope.customerProfile.mobile = $scope.customerProfile.phone;
        customerFactory.updateProfile($scope.customerProfile).success(function (data) {
            $rootScope.currentCustomerId = data.id;
            $rootScope.currentCustomerUserName = data.username;
            $rootScope.currentCustomerAuthToken = data.auth_token;
            data.password = $scope.customer.password;
            data.password_confirmation = $scope.customer.password;
            authFactory.deleteCustomer();
            authFactory.setCustomer(data);
			$rootScope.customerProfile = authFactory.getCustomer();
            $rootScope.fullName = authFactory.getCustomer().full_name;
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
            connectionFactory.testConnection().success(function (data) {
                deliveryLoader.hideLoading();
                connectionFactory.showAlertPopup($translate.instant('PROFILE'), errorCodeMessageFactory.getErrorMessage(statusCode, 'PROFILE'));
            }).error(function (err, statusCode) {
                deliveryLoader.hideLoading();
                connectionFactory.exitApplication();
            });
        });
    }
});