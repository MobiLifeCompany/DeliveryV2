﻿angular.module('delivery.factory', [])

.factory('businessCategoriesFactory', function (storageUtilityFactory, $http, $rootScope) {

    var API = {
        get: function () {
            return $http.get($rootScope.baseURL + '/businesses?lang=' + storageUtilityFactory.getSelectedLanguage());
        }
    };

    return API;
})
.factory('areasFactory', function ($http, $rootScope) {
    var API = {
        get: function () {
            $rootScope.$apply(function () {
                $http.get($rootScope.baseURL + '/cities/' + $rootScope.selectedCity.id + '/areas').
                    success(function (data) {
                        return data;
                    })
                    .error(function (data) {
                        console.log(data);
                    });
            });
        }
    }
    return API;
})
.factory('citiesFactory', function ($http, $rootScope) {
    var API = {
        get: function () {
            return $http.get($rootScope.baseURL + '/countries/' + $rootScope.countryId + '/cities_areas?lang=' + $rootScope.lang);
        }
    };

    return API;
})
.factory('shopsFactory', function ($http, $rootScope) {
    var API = {
        get: function () {
            return $http.get($rootScope.baseURL + '/businesses/' + $rootScope.selectedCategory.id + '/areas/' + $rootScope.selectedArea.id + '/shops?lang=' + $rootScope.lang);
        },
        getOffers: function () {
            return $http.get($rootScope.baseURL + '/offers?lang=' + $rootScope.lang);
        }
    };

    return API;
})
.factory('mastriesFactory', function () {
    return {
        get: function (shops) {
            resultArray = [];
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

.factory('shopDetailsFactory', function ($rootScope, $http,storageUtilityFactory) {
   
    var SAPI = {
        get: function (shopId) {
            shopDetails = {};
            shopsArray = $rootScope.shops;
            for (i = 0; i < shopsArray.length; i++) {
                if (shopsArray[i].id == shopId) {
                    shopDetails = shopsArray[i];
                    $rootScope.shopId = shopId;
                    break;
                }
            }
            return shopDetails;
        },
        getShopItemsCategories: function (shopId) {
            $rootScope.selectedShop = this.get(shopId);
            return $http.get($rootScope.baseURL + '/shops/' + $rootScope.selectedShop.id + '/items?lang=' + storageUtilityFactory.getSelectedLanguage());
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

        deleteCustomer: function () {
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
    var gcmIdkey = 'gcmId';
    var firstRunKey = 'firstRun';
    var showHelpKey = 'showHelp';

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
        setCustomerAddress: function (customerAddress) {
            customerAddresses = LSFactory.get(customerAddressesKey);
            customerAddresses.push(customerAddress);
            LSFactory.delete(customerAddressesKey);
            LSFactory.set(customerAddressesKey, customerAddresses);
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
        },

        getGcmId: function () {
            return LSFactory.get(gcmIdkey);
        },

        setGcmId: function (gcmId) {
             return LSFactory.set(gcmIdkey, gcmId);
        },
        getGcmId1: function () {
            return LSFactory.get('registrationId');
        },

        getFirstRun: function () {
            return LSFactory.get(firstRunKey);
        },

        setFirstRun: function (state) {
            return LSFactory.set(firstRunKey, state);
        },
        getShowHelp: function () {
            return LSFactory.get(showHelpKey);
        },

        setShowHelp: function (state) {
            return LSFactory.set(showHelpKey, state);
        },

    };
    return UtilityAPI;
})
.factory('customerFactory',
    function ($http, $rootScope, storageUtilityFactory, authFactory) {

        var customerAPI = {

            login: function (customer) {
                return $http.post($rootScope.baseURL + '/customers/login', customer);
            },

            register: function (customer) {
                customer.gcm_id = storageUtilityFactory.getGcmId();
                return $http.post($rootScope.baseURL + '/customers', customer);
            },
            updateProfile: function (customer) {
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer())
                    customerAuthToken = authFactory.getCustomer().auth_token;

                customer.gcm_id = storageUtilityFactory.getGcmId();
                return $http.put($rootScope.baseURL + '/customers/' + customer.id, customer, { headers: { 'auth-token': customerAuthToken } });
            },
            createCustomerAddress: function (customerAddress) {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.post($rootScope.baseURL + '/customers/' + customerId + '/addresses', customerAddress, { headers: { 'auth-token': customerAuthToken } });
            },

            getCustomerAddressess: function () {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.get($rootScope.baseURL + '/customers/' + customerId + '/addresses', { headers: { 'auth-token': customerAuthToken } });
            },

            updateCustomerAddress: function (customerAddress) {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.put($rootScope.baseURL + '/customers/' + customerId + '/addresses/' + customerAddress.id, customerAddress, { headers: { 'auth-token': customerAuthToken } });
            },

            deleteCustomerAddress: function (customerAddressId) {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.delete($rootScope.baseURL + '/customers/' + customerId + '/addresses/' + customerAddressId, { headers: { 'auth-token': customerAuthToken } });
            },
            createCustomerOrder: function (customerOrder) {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.post($rootScope.baseURL + '/customers/' + customerId + '/orders', customerOrder, { headers: { 'auth-token': customerAuthToken } });
            },
            getCustomerOrders: function () {
                var customerId = -1;
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer()) {
                    customerId = authFactory.getCustomer().id;
                    customerAuthToken = authFactory.getCustomer().auth_token;
                }
                return $http.get($rootScope.baseURL + '/customers/' + customerId + '/orders', { headers: { 'auth-token': customerAuthToken } });
            },
            sendCustomerRating: function (rateInfo) {
                var customerAuthToken = '';
                if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer())
                    customerAuthToken = authFactory.getCustomer().auth_token;
                return $http.post($rootScope.baseURL + '/shops/' + rateInfo.shopId + '/rate', rateInfo, { headers: { 'auth-token': customerAuthToken } });
            },
            notifyShopFunction: function (shopId) {
                    var customerAuthToken = '';
                    if (angular.isDefined(authFactory.isLoggedIn()) && authFactory.getCustomer())
                        customerAuthToken = authFactory.getCustomer().auth_token;
                    return $http.post($rootScope.baseURL + '/shops/' + shopId + '/notify_to_subscribe',shopId, { headers: { 'auth-token': customerAuthToken } });
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
            } else if ((errorCode === 404 || errorCode === 401) && requestType === "ORDER") {
                return $translate.instant('ORDER_ERROR_MSG');
            } else if ((errorCode === 404 || errorCode === 401) && requestType === "CONTACTUS") {
                return $translate.instant('CONTACTUS_ERROR_MSG');
            } else if ((errorCode === 404) && requestType === "OLD_ORDERS") {
                return $translate.instant('OLD_ORDER_ERROR_MSG');
            } else if (errorCode === 500)
                return $translate.instant('COMMON_ERROR_MSG');
        }
    };
    return errorCodeMessageAPI;
})
.factory('deliveryLoader', function ($ionicLoading, $timeout) {
    var LOADERAPI = {
        showLoading: function (text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: '<div class="loader" style="font-size: 8px;">' + text + '<svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>',
                duration: 25000,
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

.factory('connectionFactory', function ($http, $ionicPopup, $translate) {

    var API = {
        testConnection: function () {
            img = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' + "?" + new Date().getTime();
            return $http.get(img);
        },
        exitApplication: function () {
            // Show a warning popup if no stable internet connection detected
            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('NO_INTERNET'),
                template: $translate.instant('INTERNET_CONN_MSG')
            });

            // Resolve the promise returned by the popup. exit the app on confirmation
            alertPopup.then(function (res) {
                if (res) {
                    ionic.Platform.exitApp(); // stops the app
                }
            });
        }, showAlertPopup: function (titleHeader,content) {
            // Show a warning popup if no stable internet connection detected
            var alertPopup = $ionicPopup.alert({
                title: titleHeader,
                template: content
            });
        }
    };

    return API;
})
.factory('utilitiesFactory', function ($http, $rootScope) {

    var API = {
        sendContactUsInfo: function (contactUsInfo) {
            return $http.post($rootScope.baseURL + '/contact', contactUsInfo);
        }
    };

    return API;
})
.factory('gcmFactory', function ($rootScope, storageUtilityFactory) {

    var app = {
        // Application Constructor
        initialize: function () {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'

        onDeviceReady: function () {
            var push = PushNotification.init({
                "android": {
                    "senderID": "180733002242"
                },
                "ios": {
                    "alert": "true",
                    "badge": "true",
                    "sound": "true"
                },
                "windows": {}
            });

            push.on('registration', function (data) {
                console.log("registration event");
                $rootScope.registrationId = data.registrationId;
                storageUtilityFactory.setGcmId(data.registrationId);

            });

            push.on('registered', function (data) {
                console.log("registration event");
                $rootScope.registrationId = data.registrationId;
                storageUtilityFactory.setGcmId(data.registrationId);

            });

            push.on('notification', function (data) {
                if (cordova.platformId === 'android') {
                    $rootScope.notification = data;
                    console.log("notification event");
                    cordova.plugins.notification.local.add({
                        id: data.additionalData["google.message_id"].substring(2, 15),
                        message: data.message,
                        title: data.title,
                        sound: "file://sound/delivery-tone.mp3",
                        icon: "http://admin.deliveryonweb.com/dist/img/logo.png",
                        data: { type: "ORDER" },
                    }).then(function () {
                        console.log("The notification has been set");
                    });
                }
            });

            push.on('error', function (e) {
                console.log("push error");
            });

        }
    };

    return app;
})