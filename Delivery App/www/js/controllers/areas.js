angular.module('delivery.controllers')

.controller('AreasCtrl', function ($scope, $rootScope, $ionicLoading, $http, $timeout, $ionicFilterBar, connectionFactory, storageUtilityFactory, areasFactory, deliveryLoader, customerFactory) {

    $rootScope.selectedArea = {};
    $scope.areas = $scope.selectedCity.areas;
    $scope.done_loading = true;

    /// <summary>setArea: add the selected area to '$rootScope' and 'localStorage' then redirect the user to main view</summary>
    /// <param name="i" type="integer">The id of the selected area</param>
    $scope.setArea = function (area) {
        $rootScope.selectedArea = area;
        storageUtilityFactory.setSelectedArea(area);
        //Check if customer has any address
        customerFactory.getCustomerAddressess().success(function (data) {
            try {
                var filteredAddresses = [];
                for (i = 0; i < data.length; i++)
                    if (data[i].area.id === storageUtilityFactory.getSelectedArea().id && data[i].city.id === storageUtilityFactory.getSelectedCity().id)
                        filteredAddresses.push(data[i]);

                if (filteredAddresses.length > 0)
                    $rootScope.userHasAddress = true;
                else
                    $rootScope.userHasAddress = false;
            } catch (e) {
                $rootScope.userHasAddress = false;
            }
        }).error(function (err, statusCode) {
            $rootScope.userHasAddress = false;
        });

        // Hide the modal and show the main view
        $rootScope.areasModal.hide();
        $rootScope.isCategorySelected = true;
        $rootScope.showMainView = true;
    };

    $scope.prevStep = function () {
        $rootScope.areasModal.hide();
        $rootScope.citiesModal.show();
    };
});