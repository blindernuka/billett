'use strict';

angular.module('billett.admin', [
    'ngRoute',
    'billett.auth',
    'billett.helper.page',
    'billett.admin.event',
    'billett.admin.eventgroup',
    'billett.admin.order',
    'billett.admin.paymentgroup',
    'billett.admin.ticketgroup',
])

.config(function($routeProvider) {
    $routeProvider.when('/a', {
        templateUrl: 'views/admin/index.html',
        controller: 'AdminIndexController',
        resolve: {auth: 'AuthRequireResolver'}
    });

}).

controller('AdminIndexController', function(Page, $http, $scope, AdminEventgroup) {
    Page.setTitle('Administration');

    AdminEventgroup.query(function(ret) {
        $scope.eventgroups = ret;
    });
});