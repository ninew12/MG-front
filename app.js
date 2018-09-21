'use strict';
// angular.module('myApp', ['ngRoute', 'app.routes', 'app.core', 'app.services', 'app.config']);
angular.module('myApp', [
    'ui.bootstrap', 'ngRoute', 'ngMaterial', 'jkAngularCarousel', 'angucomplete-alt', 'slickCarousel', 'pascalprecht.translate', 'ngCookies',
    'myApp.auth', 'myApp.routes', 'myApp.core', 'myApp.services', 'myApp.config'])
    // .constant('URL_API', 'http://54.255.237.25:3000')
    .constant('URL_API', 'https://senseino.co:3000')

.factory('socketio', ['$rootScope', function($rootScope){
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback){
            socket.emit(eventName, data, function(){
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback){
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
}]);
   
