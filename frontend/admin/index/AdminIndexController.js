(function() {
    'use strict';

    var module = angular.module('billett.admin.index', [
        'ngRoute',
        'billett.auth',
        'billett.common.PageService',
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/a', {
            templateUrl: 'assets/views/admin/index/index.html',
            controller: 'AdminIndexController',
            resolve: {auth: 'AuthRequireResolver'}
        });
    });

    module.controller('AdminIndexController', function (Page, $http, $scope, AdminEventgroup) {
        Page.setTitle('Administration');

        AdminEventgroup.query(function (ret) {
            $scope.eventgroups = ret;
        });
    });
})();
