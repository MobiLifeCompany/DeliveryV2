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

.factory('shopDetailsFactory', function () {
    var shopsArray = [{ name: 'KFC', id: 1, src: "img/shops/kfc.jpg", rating: 3, masteries: ['Fast Food', 'Salads', 'Burgers'], minAmount: '10$', deliveryTime: '45 min', deliveryFee: '2$', deliveryHours: '9:00 am - 10:00 pm', hasPromotion: true, isOpen: true, promotionNote: 'great promotion here', warningNote: 'important warning too!', address: 'Hama, Sahat Al-Assi', longitude: '35.130351', latitude: '36.755670' },
                    { name: 'McDonalds', id: 2, src: "img/shops/mcdonalds.jpg", rating: 4, masteries: ['Arabic', 'Sweets', 'Grill'], minAmount: '15$', deliveryTime: '30 min', deliveryFee: '2$', deliveryHours: '9:00 am - 10:00 pm', hasPromotion: false, isOpen: true, promotionNote: 'great promotion here', warningNote: 'important warning too!', address: 'Hama, Al-Dabagha', longitude: '35.131506', latitude: '36.753518' },
                    { name: 'Pizza Hut', id: 3, src: "img/shops/pizza_hut.jpg", rating: 4, masteries: ['Chiken', 'Salads', 'Burgers'], minAmount: '10$', deliveryTime: '45 min', deliveryFee: '2$', deliveryHours: '9:00 am - 10:00 pm', hasPromotion: false, isOpen: false, promotionNote: 'great promotion here', warningNote: '', address: 'Hama, Sahat Al-Assi', longitude: '35.130351', latitude: '36.755670' },
                    { name: 'Dominos Pizza', id: 4, src: "img/shops/dominos.jpg", rating: 5, masteries: ['Pizza', 'Deserts'], minAmount: '12$', deliveryTime: '40 min', deliveryFee: '2$', deliveryHours: '9:00 am - 10:00 pm', hasPromotion: true, isOpen: true, promotionNote: '', warningNote: '', address: 'Hama, Al-Dabagha', longitude: '35.131506', latitude: '36.753518' },
                    { name: 'Shop FIVE', id: 5, src: "img/categories/icon5.jpg", rating: 2, masteries: ['Salads', 'Burgers'], minAmount: '8$', deliveryTime: '45 min', deliveryFee: '2$', deliveryHours: '9:00 am - 10:00 pm', hasPromotion: true, isOpen: true, promotionNote: '', warningNote: '', address: '', longitude: '', latitude: '' },
                    { name: 'Shop SIX', id: 6, src: "img/categories/icon6.jpg", rating: 2, masteries: ['Fast Food', 'Salads', 'Burgers'], minAmount: '10$', deliveryTime: '45 min', deliveryFee: '2$', deliveryHours: '9:00 am - 10:00 pm', hasPromotion: false, isOpen: true, promotionNote: '', warningNote: '', address: '', longitude: '', latitude: '' }
    ];
    var shopDetails = {};
    return {
        get: function (shopId) {
            for (i = 0; i < shopsArray.length; i++) {
                if (shopsArray[i].id == shopId) {
                    shopDetails = shopsArray[i];
                }
            }
            return shopDetails;
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