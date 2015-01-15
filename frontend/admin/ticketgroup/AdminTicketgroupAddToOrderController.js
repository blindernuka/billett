angular.module('billett.admin').controller('AdminTicketgroupAddToOrderController', function ($modalInstance, $scope, eventgroup_id, AdminEventgroup, addHandler) {
    var ctrl = this;
    ctrl.count = 0;  // num tickets to add
    ctrl.amount = 0; // price to pay

    AdminEventgroup.get({id: eventgroup_id}, function (eventgroup) {
        ctrl.eventgroup = eventgroup;

        generateEventList();
    }, function () {
        $modalInstance.dismiss('eventgroup error');
    });

    ctrl.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // build list of possible events
    var generateEventList = function () {
        if (!ctrl.eventgroup) return;

        // build list of ticketgroups
        ctrl.events = ctrl.eventgroup.events.filter(function (event) {
            if (event.is_old && !ctrl.ticketfilter.show_old) return false;
            return event.is_selling && event.ticketgroups.length > 0;
        });

        // add fields for later filtering
        ctrl.events.forEach(function (event) {
            event.dateinfo = moment.unix(event.time_start).format('ddd D. MMM YYYY HH:mm');
        });
    };

    // filtering of events
    ctrl.ticketfilter = {};
    $scope.$watchCollection('ctrl.ticketfilter', function () {
        generateEventList();
    });

    // add/remove ticketgroup selection
    ctrl.ticketgroups_add = {};
    ctrl.changeTicketgroupNum = function (ticketgroup, event, num) {
        if (!(ticketgroup.id in ctrl.ticketgroups_add)) {
            ctrl.ticketgroups_add[ticketgroup.id] = {
                ticketgroup: ticketgroup,
                event: event,
                num: 0
            };
        }

        var g = ctrl.ticketgroups_add[ticketgroup.id];
        g.num += num;

        if (g.num == 0) {
            delete ctrl.ticketgroups_add[ticketgroup.id];
        }

        ctrl.count += num;
        ctrl.amount += num * (ticketgroup.price + ticketgroup.fee);
    };

    // helper for filtering ticketgroups
    ctrl.ticketgroup_check = function(actual, expected) {
        if (expected) return true;
        return actual;
    };

    // add selected tickets
    ctrl.addTickets = function () {
        ctrl.sending = true;
        addHandler(ctrl.ticketgroups_add).then(function () {
            $modalInstance.close();
        }, function () {
            alert("Ukjent feil oppsto ved registrering av billetter");
        }).finally(function () {
            delete ctrl.sending;
        });
    };
});