angular.module('delivery.controllers')

.controller('CitiesCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $ionicModal) {
    $ionicLoading.show();
    // wait for 1000 milliseconds and hide the overlay to simulate data loading from server
    $timeout(function () {
        $ionicLoading.hide();
        $scope.done_loading = true;
    }, 500);

    // dummy data for cities
    $scope.cities = [
        { name: 'Hama', id: 1},
        { name: 'Homs', id: 2 },
        { name: 'Aleppo', id: 3 },
        { name: 'Damascus', id: 4 },
        { name: 'Lattakia', id: 5 },
        { name: 'Idleb', id: 6 }
    ];

    $rootScope.selectedCity = [];

    /// <summary>setCity: Add the selected city to '$rootScope' and 'localStorage' then redirect the user to 'select area' modal</summary>
    /// <param name="i" type="integer">The id of the selected area</param>
    $scope.setCity = function (i) {
        $rootScope.selectedCity = { id: i, name: $scope.cities[i - 1].name };
        localStorage.setItem("cityName", $scope.cities[i - 1].name);

        $ionicModal.fromTemplateUrl('templates/areas.html', {
            scope: $rootScope,
            hardwareBackButtonClose: false,
        }).then(function (modal) {
            $rootScope.areasModal = modal;
            $rootScope.areasModal.show();
        });

        // wait for 1 seconds and hide this modal, for a smoother transition and reduce flekering
        $timeout(function () {
            $rootScope.citiesModal.hide();
        }, 500);
    };

    /// <summary>prevStep: Redirect the user back to 'select categories' modal</summary>
    /// <param>no parameters</param>
    $scope.prevStep = function () {
        $rootScope.categoriesModal.show();
        $rootScope.citiesModal.hide();
    }
});