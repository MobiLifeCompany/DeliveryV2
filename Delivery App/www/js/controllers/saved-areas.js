angular.module('delivery.controllers')

.controller('SavedAreasCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $translate, $ionicModal, deliveryLoader, storageUtilityFactory, authFactory) {

    $rootScope.selectedCity = storageUtilityFactory.getSelectedCity();
    $rootScope.selectedArea =  storageUtilityFactory.getSelectedArea();
    $rootScope.fullName = authFactory.getCustomer().full_name;

    $scope.savedAreas = storageUtilityFactory.getCustomerAddresses();
    $scope.uniqueAreas = [];

    // Get only unique values for savedAreas to prevent dubplication in the areas list
    var areaExists = false;
    if($scope.savedAreas!=null){
        for (i = 0; i < $scope.savedAreas.length; i++) {
            for (j = 0; j < $scope.uniqueAreas.length; j++) {
                if ($scope.savedAreas[i].area.id == $scope.uniqueAreas[j].area.id)
                    areaExists = true;
            }
            if (!areaExists)
                $scope.uniqueAreas.push($scope.savedAreas[i]);
            areaExists = false;
        };
    }

    $scope.prevStep = function () {
        $rootScope.savedAreasModal.hide();
        $rootScope.categoriesModal.show();
    };

    $scope.selectCurrentAddress = function () {
        // Hide the modal and show the main view
        $rootScope.savedAreasModal.hide();
        $rootScope.showMainView = true;
        $rootScope.isCategorySelected = true;
    };

    $scope.selectSavedAddress = function (area) {
        deliveryLoader.showLoading($translate.instant('LOADING'));
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
        $rootScope.savedAreasModal.hide();
        $rootScope.showMainView = true;
        $rootScope.isCategorySelected = true;
    };

    $scope.selectNewAddress = function () {
        $ionicModal.fromTemplateUrl('templates/cities.html', {
            id: '12',
            scope: $rootScope,
            hardwareBackButtonClose: false,
        }).then(function (modal) {
            $rootScope.citiesModal = modal;
            $rootScope.citiesModal.show();
        });

        // wait for 1 seconds and hide this modal, for a smoother transition and reduce flekering
        $timeout(function () {
            $rootScope.savedAreasModal.hide();
        }, 500);
    }
});