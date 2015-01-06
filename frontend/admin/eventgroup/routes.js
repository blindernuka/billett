angular.module('billett.admin').config(function ($routeProvider) {
    $routeProvider
        .when('/a/eventgroup/new', {
            templateUrl: 'assets/views/admin/eventgroup/new.html',
            controller: 'AdminEventgroupNewController',
            resolve: {auth: 'AuthRequireResolver'}
        })
        .when('/a/eventgroup/:id', {
            templateUrl: 'assets/views/admin/eventgroup/index.html',
            controller: 'AdminEventgroupController',
            resolve: {auth: 'AuthRequireResolver'}
        });
});