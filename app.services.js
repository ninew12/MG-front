'use strict';
angular.module('myApp.services', [])
        .service('authService', authService)
        authService.$inject = ['$translate', '$http', 'URL_API'];
     
function authService($translate, $http, URL_API) {
    /*jshint validthis: true */

    this.test = function() {
        return 'working';
    };
    this.LoginByEmail = function(username, password) {
        return $http({
        method: 'POST',
        url: URL_API + '/api/v1/users/login',
        data: {username:username, credential:password, type:'email'},
        headers: {
            'Content-Type': 'application/json',
            'platform': 'web',
            'lang': $translate.use(),
            'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
        }
        });
    };
    this.RegisByEmail = function(firstname, lastname, tel, email, password) {
        return $http({
        method: 'POST',
        url: URL_API + '/api/v1/users/register',
        data: {
            firstName: firstname,
            lastName: lastname,
            mobileNo: tel,
            email: email,
            type:'email',
            password: password
        },
        headers: {
            'Content-Type': 'application/json',
            'platform': 'web',
            'lang': $translate.use(),
            'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
        }
        });
    };
    this.ensureAuthenticated = function(userdata) {
        return $http({
            method: 'GET',
            url: URL_API + '/api/v1/users/' + userdata._id,
            headers: {
                'x-user' : userdata.email,
                'platform': 'web',
                'lang': $translate.use(),
                'Authorization': 'Basic c2Vuc2Vpbm86U2Vuc2Vpbm9AMjAxNw=='
            }
        });
    };
};
