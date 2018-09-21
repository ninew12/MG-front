'use strict';
angular.module('myApp', [
    'ui.bootstrap', 'ngResource', 'ngRoute', 'ngMaterial', 'jkAngularCarousel', 'angucomplete-alt', 'slickCarousel', 'pascalprecht.translate', 'ngCookies',
    'myApp.auth', 'myApp.routes', 'myApp.core', 'myApp.services', 'myApp.config', 'ui.router', 'ui-notification'])
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
   
