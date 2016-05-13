var baseURL = 'http://private-fa897-backendapi2.apiary-mock.com';

angular.module('delivery.factory', [])

.factory('businessCategoriesFactory', function ($http) {

    var API = {
        get: function () {
            return $http.get(baseURL + '/businessCateogries');
        }
    };

    return API;
})
.factory('areasFactory', function ($http) {

    var API = {
        get: function () {
            return $http.get(baseURL + '/areas');
        }
    };

    return API;
})
.factory('citiesFactory', function ($http) {

    var API = {
        get: function () {
            return $http.get(baseURL + '/cities');
        }
    };

    return API;
})
.factory('shopsFactory', function ($http) {

    var API = {
        get: function () {
            return $http.get(baseURL + '/shops');
        }
    };

    return API;
})

.factory('mastriesFactory', function () {
    var resultArray = [];
    return {
        get: function (shops) {
            tempArray = [];
            for (i = 0; i < shops.length; i++) {
                for (j = 0; j < shops[i].masteries.length; j++) {
                    if (tempArray.indexOf(shops[i].masteries[j]) === -1) {
                        tempArray.push(shops[i].masteries[j]);
                    }
                }
            }
            for (i = 0; i < tempArray.length; i++) {
                resultArray.push({ name: tempArray[i] });
            }

            return resultArray;
        }
    }
    
})
.factory('deliveryLoader',  function ($ionicLoading, $timeout) {

    var LOADERAPI = {

        showLoading: function (text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: text
            });
        },

        hideLoading: function () {
            $ionicLoading.hide();
        },

        toggleLoadingWithMessage: function (text, timeout) {
            var self = this;

            self.showLoading(text);

            $timeout(function () {
                self.hideLoading();
            }, timeout || 3000);
        }

    };
    return LOADERAPI;
})