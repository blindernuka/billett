'use strict';

angular.module('billett.admin.ticketgroup', [
    'ngRoute',
    'ngResource',
    'billett.helper.page'
])

.config(function($routeProvider) {
    $routeProvider.when('/a/event/:id/ticketgroup/new', {
        templateUrl: 'views/admin/ticketgroup/new.html',
        controller: 'AdminTicketGroupNewController'
    })
    .when('/a/event/:event_id/ticketgroup/:ticketgroup_id', {
        templateUrl: 'views/admin/ticketgroup/index.html',
        controller: 'AdminTicketGroupController'
    });
})

.controller('AdminTicketGroupController', function(Page, $routeParams,
        AdminTicketGroup, $scope, $location) {
    Page.setTitle('Billettgruppe');

    $scope.event_id = $routeParams['event_id'];
    $scope.ticketgroup_id = $routeParams['ticketgroup_id'];

    AdminTicketGroup.get({id:$scope.ticketgroup_id}, function(ret) {
        if (ret.event.id != $scope.event_id) {
            $location.path('/a');
            return;
        }

        ret.is_active = !!ret.is_active;
        ret.is_published = !!ret.is_published;
        ret.is_normal = !!ret.is_normal;

        $scope.ticketgroup = ret;
    }, function(err) {
        $location.path('/a/event/'+$scope.event_id);
    });

    $scope.updateTicketGroup = function() {
        $scope.ticketgroup.$save(function(ret) {
            $location.path('/a/event/'+$scope.event_id);
        });
    };

    $scope.deleteTicketGroup = function() {
        // TODO: no delete on valid/reserved tickets
        AdminTicketGroup.delete({id: $scope.ticketgroup_id}, function(res) {
            $location.path('/a/event/'+$scope.event_id);
        });
    };
})

.controller('AdminTicketGroupNewController', function(Page, $routeParams,
        AdminTicketGroup, AdminEvent, $scope, $location) {
    Page.setTitle('Ny billettgruppe');

    $scope.event_id = $routeParams['id'];
    $scope.ticketgroup = {
        price: 0,
        is_normal: true
    };

    AdminEvent.get({id:$routeParams['id']}, function(ret) {
        $scope.event = ret;
    }, function(err) {
        $location.path('/a');
    });

    $scope.addTicketGroup = function() {
        var g = new AdminTicketGroup($scope.ticketgroup);
        g.event_id = $scope.event_id;
        g.$save(function(res) {
            $location.path('/a/event/'+g.event_id);
        }, function(err) {
            alert(err.data);
        });
    };
})

.factory('AdminTicketGroup', function($resource) {
    var r = $resource('api/ticketgroup/:id', {
        'id': '@id'
    }, {
        save: { method: 'PUT' }
    });

    return r;
});