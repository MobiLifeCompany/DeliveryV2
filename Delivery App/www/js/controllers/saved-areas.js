angular.module('delivery.controllers')

.controller('SavedAreasCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $ionicModal, $ionicSlideBoxDelegate, storageUtilityFactory, authFactory) {

    $rootScope.selectedCity = storageUtilityFactory.getSelectedCity();
    $rootScope.selectedArea =  storageUtilityFactory.getSelectedArea();
    $rootScope.fullName = authFactory.getCustomer().full_name;

    $scope.savedAreas = storageUtilityFactory.getCustomerAddresses();
    $scope.uniqueAreas = [];
    // Get only unique values for savedAreas to prevent dubplication in the areas list
    var areaExists = false;
    for (i = 0; i < $scope.savedAreas.length; i++) {
        for (j = 0; j < $scope.uniqueAreas.length; j++) {
            if ($scope.savedAreas[i].area.id == $scope.uniqueAreas[j].area.id)
                areaExists = true;
        }
        if (!areaExists)
            $scope.uniqueAreas.push($scope.savedAreas[i]);
        areaExists = false;
    };

    $scope.prevStep = function () {
        $rootScope.savedAreasModal.hide();
        $rootScope.categoriesModal.show();
    };

    $scope.selectCurrentAddress = function () {
        // Hide the modal and show the main view
        $rootScope.savedAreasModal.hide();
        $rootScope.showMainView = true;
        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
    };

    $scope.selectSavedAddress = function (area) {
        $rootScope.selectedArea = area;
        storageUtilityFactory.setSelectedArea(area);
        
        // Hide the modal and show the main view
        $rootScope.savedAreasModal.hide();
        $rootScope.showMainView = true;

        //load required shops by business category and selected delivered area 
        $rootScope.loadShops();

        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
    };

    $scope.selectNewAddress = function () {
        $ionicModal.fromTemplateUrl('templates/cities.html', {
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