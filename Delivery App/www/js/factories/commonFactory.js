var baseURL = 'http://deliveryonweb.com/api/v1';

angular.module('delivery.factory', [])

.factory('businessCategoriesFactory', function (storageUtilityFactory, $http) {

    var API = {
        get: function () {
            return $http.get(baseURL + '/businesses?lang=' + storageUtilityFactory.getSelectedLanguage());
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
            }

        };

        return LSAPI;

})

.factory('authFactory', function (LSFactory) {
    var customerKey = 'customer';
    var AuthAPI = {

        isLoggedIn: function () {
            return this.getCustomer() === null ? false : true;
        },

        getCustomer: function () {
            return LSFactory.get(customerKey);
        },

        setCustomer: function (customer) {
            return LSFactory.set(customerKey, customer);
        },

        deleteAuth: function () {
            LSFactory.delete(customerKey);
        }

    };
    return AuthAPI;
})
.factory('storageUtilityFactory', function (LSFactory) {

    var selectedCategoryKey = 'selectedCategory';
    var selectedCountryKey = 'selectedCountry';
    var selectedCityKey = 'selectedCity';
    var selectedAreaKey = 'selectedArea';
    var customerAddressesKey = 'customerAddresses';
    var selectedLanguageKey = 'selectedLanguage';

    var UtilityAPI = {

        getCountry: function () {
            return LSFactory.get(selectedCountryKey);
        },

        setCountry: function (countryId) {
            return LSFactory.set(selectedCountryKey, countryId);
        },

        deleteCountry: function () {
            LSFactory.delete(selectedCountryKey);
        },

        getSelectedCategory: function () {
            return LSFactory.get(selectedCategoryKey);
        },

        setSelectedCategory: function (category) {
            return LSFactory.set(selectedCategoryKey, category);
        },

        deleteSelectedCategory: function () {
            LSFactory.delete(selectedCategoryKey);
        },

        getSelectedCity: function () {
            return LSFactory.get(selectedCityKey);
        },

        setSelectedCity: function (city) {
            return LSFactory.set(selectedCityKey, city);
        },

        deleteSelectedCity: function () {
            LSFactory.delete(selectedCityKey);
        },

        getSelectedArea: function () {
            return LSFactory.get(selectedAreaKey);
        },

        setSelectedArea: function (area) {
            return LSFactory.set(selectedAreaKey, area);
        },

        deleteSelectedArea: function () {
            LSFactory.delete(selectedAreaKey);
        },

        getCustomerAddresses: function () {
            return LSFactory.get(customerAddressesKey);
        },

        setCustomerAddresses: function (customerAddresses) {
            return LSFactory.set(customerAddressesKey, customerAddresses);
        },

        deleteCustomerAddresses: function () {
            LSFactory.delete(customerAddressesKey);
        },

        getSelectedLanguage: function () {
            return LSFactory.get(selectedLanguageKey);
        },

        setSelectedLanguage: function (selectedLanguage) {
            return LSFactory.set(selectedLanguageKey, selectedLanguage);
        },

        deleteSelectedLanguage: function () {
            LSFactory.delete(selectedLanguage);
        }

    };
    return UtilityAPI;
})
.factory('customerFactory', 
    function ($http, $rootScope, storageUtilityFactory, authFactory) {
        
        var customerAPI = {

            login: function (customer) {
               return $http.post(baseURL + '/customers/login', customer);
            },

            register: function (customer) {
                return $http.post(baseURL + '/customers', customer);
            },
            updateProfile: function (customer) {
                return $http.put(baseURL + '/customers', customer);
            },
            createCustomerAddress: function (customerAddress) {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()){
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                    }
                return $http.post(baseURL + '/customers/' + customerId + '/addresses', customerAddress, { headers: { 'auth-token': customerAuthToken } });
            },

            getCustomerAddressess: function () {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.get(baseURL + '/customers/' + customerId + '/addresses', { headers: { 'auth-token': customerAuthToken } });
            },

            updateCustomerAddress: function (customerAddress) {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.put(baseURL + '/customers/' + customerId + '/addresses/' + customerAddress.id, customerAddress, { headers: { 'auth-token': customerAuthToken } });
            },

            deleteCustomerAddress: function (customerAddressId) {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.delete(baseURL + '/customers/' + customerId + '/addresses/' + customerAddressId, { headers: { 'auth-token': customerAuthToken } });
            }
        };

        return customerAPI;
    }
 )
.factory('errorCodeMessageFactory', function ($translate) {

    var errorCodeMessageAPI = {
            getErrorMessage: function (errorCode, requestType) {
                if (errorCode === 500 > -1 && requestType === "BUSINESS") {
                    return "";
                } else if (errorCode === 422 && requestType === "REGISTER") {
                    return $translate.instant('REGISTER_ERROR_MSG');
                } else if ((errorCode === 404 || errorCode === 401) && requestType === "LOGIN") {
                    return $translate.instant('LOGIN_ERROR_MSG');
                } else if ((errorCode === 404 || errorCode === 401) && requestType === "ADDRESS") {
                    return $translate.instant('ADDRESS_ERROR_MSG');
                } else if ((errorCode === 404 || errorCode === 401) && requestType === "PROFILE") {
                    return $translate.instant('PROFILE_ERROR_MSG');
                }
                else if (errorCode === 500 )
                    return $translate.instant('COMMON_ERROR_MSG');
            }
        };
    return errorCodeMessageAPI;
})
.factory('deliveryLoader',  function ($ionicLoading, $timeout) {
    var LOADERAPI = {
        showLoading: function (text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: '<div class="loader" style="font-size: 8px;">' + text + '<svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
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