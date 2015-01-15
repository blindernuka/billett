<?php namespace Blindern\UKA\Billett;

class Ticketgroup extends \Eloquent {
    /**
     * Check if list of ticketgroups is available
     *
     * @param array(array(ticketgroup, count), ...)
     * @return boolean
     */
    public static function checkIsAvailable($groups)
    {
        // split into the different events
        // and check for each event

        $events = [];
        $events_ticketgroups = [];

        foreach ($groups as $row) {
            $ticketgroup = $row[0];
            if (!isset($events[$ticketgroup->event->id])) {
                $events[$ticketgroup->event->id] = $ticketgroup->event;
                $events_ticketgroups[$ticketgroup->event->id] = [];
            }

            $events_ticketgroups[$ticketgroup->event->id][] = $row;
        }

        foreach ($events as $event) {
            if (!$event->checkIsAvailable($events_ticketgroups[$event->id])) {
                return false;
            }
        }

        return true;
    }

    protected $model_suffix = '';
    protected $table = 'ticketgroups';

    protected $apiAllowedFields = array('id', 'event_id', 'is_active', 'is_published', 'is_normal', 'title', 'ticket_text', 'price', 'fee', 'limit', 'order');
    protected $apiAllowedRelations = array('event', 'tickets');

    public function getPriceAttribute($val) {
        return (float) $val;
    }

    public function getFeeAttribute($val) {
        return (float) $val;
    }

    public function tickets()
    {
        return $this->hasMany('\\Blindern\\UKA\\Billett\\Ticket'.$this->model_suffix, 'ticketgroup_id');
    }

    public function event()
    {
        return $this->belongsTo('\\Blindern\\UKA\\Billett\\Event'.$this->model_suffix, 'event_id');
    }

    /**
     * Check if there tickets associated that are not expired
     */
    public function getHasTicketsAttribute()
    {
        $res = $this->tickets()->where(function($query) {
            $query->whereNull('expire')->orWhere('expire', '>=', time());
        })->first();

        return (bool) $res;
    }

    /**
     * Get fields we can search in
     */
    public function getApiAllowedFields() {
        return $this->apiAllowedFields;
    }

    /**
     * Get fields we can use as relations
     */
    public function getApiAllowedRelations() {
        return $this->apiAllowedRelations;
    }
}
