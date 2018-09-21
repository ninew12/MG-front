'use strict';

angular
    .module('myApp.routes', ['ngRoute'])
    .config(config);

function config ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.
        when('/', {
            templateUrl: '/modules/homes/views/home.html',
            controller: 'HomeController'
        })
        .when('/experts', {
            templateUrl: '/modules/experts/views/experts.html',
            controller: 'ExpertsController'
        })
        .when('/experts-create', {
            templateUrl: '/modules/experts/views/experts-create.html',
            controller: 'ExpertsCreateController'
        })
        .when('/experts-detail:id', {
            templateUrl: '/modules/experts/views/experts-detail.html',
            controller: 'ExpertsDetailController'
        })
        .when('/experts:jobtypes', {
            templateUrl: '/modules/experts/views/experts-criteria.html',
            controller: 'ExpertsCriteriaController'
        })
        .when('/jobtype-experts:idJobtype', {
            templateUrl: '/modules/experts/views/experts-jobtype.html',
            controller: 'ExpertsJobtypeController'
        })
        .when('/jobs', {
            templateUrl: '/modules/jobs/views/jobs.html',
            controller: 'JobsController'
        })
        .when('/customers', {
            templateUrl: '/modules/customers/views/customer.html',
            controller: 'CustomerController'
        })
        .when('/helps', {
            templateUrl: '/modules/helps/views/help.html',
            controller: 'HelpController'
        })
        .when('/search', {
            templateUrl: '/modules/search/views/search.html',
            controller: 'SearchController'
        })
        .when('/chat', {
            templateUrl: '/modules/chats/views/chat.html',
            controller: 'ChatController'
        })
        .when('/profile', {
            templateUrl: '/modules/profiles/views/profile.html',
            controller: 'ProfileController'
        })
        .when('/setting', {
            templateUrl: '/modules/profiles/views/setting.html',
            controller: 'SettingController'
        })
        .when('/term-service', {
            templateUrl: '/modules/footers/views/term-service.html',
            controller: 'FooterController'
        })
        .when('/policy', {
            templateUrl: '/modules/footers/views/policy.html',
            controller: 'FooterController'
        })
        .when('/setting', {
            templateUrl: '/modules/profiles/views/setting.html',
            controller: 'SettingController'
        })
        .otherwise({
            redirectTo: '/'
        });
        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        //   });
};
