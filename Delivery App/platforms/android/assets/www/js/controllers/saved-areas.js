angular.module('delivery.controllers')

.controller('SavedAreasCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $ionicModal, $ionicSlideBoxDelegate) {

    $scope.city = localStorage.getItem("cityName");
    $scope.area = localStorage.getItem("areaName");

    $scope.savedAreas = [
        { name: 'Sahat Al-Assi', id: 1 },
        { name: 'Alshareaa', id: 2 }
    ];

    $scope.prevStep = function () {
        $rootScope.savedAreasModal.hide();
        $rootScope.categoriesModal.show();
    };

    $scope.selectCurrentAddress = function () {
        $rootScope.selectedArea = { id: localStorage.getItem("areaID"), name: localStorage.getItem("areaName") };

        // Hide the modal and show the main view
        $rootScope.savedAreasModal.hide();
        $rootScope.showMainView = true;
        $ionicSlideBoxDelegate.update();//this line is used to solve a bug associated with the ion-slide-box not being shown when 'ng-show' of the parent change to true
    };

    $scope.selectSavedAddress = function (i) {
        $rootScope.selectedArea = { id: i, name: $scope.savedAreas[i - 1].name };
        localStorage.setItem("areaID", i);
        localStorage.setItem("areaName", $scope.savedAreas[i - 1].name);
        
        // Hide the modal and show the main view
        $rootScope.savedAreasModal.hide();
        $rootScope.showMainView = true;
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