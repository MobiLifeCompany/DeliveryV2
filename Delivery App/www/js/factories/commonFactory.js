var baseURL = 'http://deliveryonweb.com/api/v1';

angular.module('delivery.factory', [])

.factory('businessCategoriesFactory', function ($rootScope, $http) {

    var API = {
        get: function () {
            return $http.get(baseURL + '/businesses?lang=' + $rootScope.lang);
        }
    };

    return API;
})
.factory('areasFactory', function ($http, $rootScope) {
    var API = {
        get: function () {
            return $http.get(baseURL + '/cities/' + $rootScope.selectedCity.id + '/areas');
        }
    };

    return API;
})
.factory('citiesFactory', function ($http, $rootScope) {
    var API = {
        get: function () {
            return $http.get(baseURL + '/countries/' + $rootScope.countryId + '/cities_areas?lang=' + $rootScope.lang);
        }
    };

    return API;
})
.factory('shopsFactory', function ($http, $rootScope) {
    var API = {
        get: function () {
            return $http.get(baseURL + '/businesses/' + $rootScope.selectedCategory.id + '/areas/' + $rootScope.selectedArea.id + '/shops?lang=' + $rootScope.lang);
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

.factory('shopDetailsFactory', function ($rootScope, $http) {
    var shopsArray = $rootScope.shops;
    var shopDetails = {};
    var SAPI = {
        get: function (shopId) {
            for (i = 0; i < shopsArray.length; i++) {
                if (shopsArray[i].id == shopId) {
                    shopDetails = shopsArray[i];
                }
            }
            $rootScope.selectedShop = shopDetails;
            return shopDetails;
        },
        getShopItemsCategories: function () {
               return $http.get(baseURL + '/shops/' + $rootScope.selectedShop.id + '/items');
        }
    }
    return SAPI;
})

.factory('LSFactory', function () {

        var LSAPI = {

            clear: function () {
                return localStorage.clear();
            },

            get: function (key) {
                return JSON.parse(localStorage.getItem(key));
            },

            set: function (key, data) {
                return localStorage.setItem(key, JSON.stringify(data));
            },

            delete: function (key) {
                return localStorage.removeItem(key);
            },
            getCurrentLanguage: function () {
                return localStorage.getItem("language")
            }

        };

        return LSAPI;

})

.factory('AuthFactory', function (LSFactory) {
    var userKey = 'user';
    var AuthAPI = {

        isLoggedIn: function () {
            return this.getUser() === null ? false : true;
        },

        getUser: function () {
            return LSFactory.get(userKey);
        },

        setUser: function (user) {
            return LSFactory.set(userKey, user);
        },

        deleteAuth: function () {
            LSFactory.delete(userKey);
        }

    };
    return AuthAPI;
})

.factory('UserFactory', 
    function ($http) {
        
        var UserAPI = {

            login: function (customer) {
               return $http.post(baseURL + '/customers/login', customer);
            },

            register: function (customer) {
                return $http.post(baseURL + '/customers', customer);
            }
        };

        return UserAPI;
    }
 )
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