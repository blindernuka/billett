<?php namespace Blindern\UKA\Billett\Auth;

class Guard extends \Illuminate\Auth\Guard {
    /**
     * Temporary solution
     */
    protected static $allowed = array(
        'henrste',
        'ingceckri',
        'vegardan',
        'benden',
        'miaemilie',
        'dionars',
        'andvin',
        'annanok',
        'chrimsam',
        'goranbs',
        'ingebjorgbm',
        'jannekj',
        'soensteby',
        'tirilskaardal'
    );

    /**
     * Simple ACL check
     *
     * Check if we have access to a specific role
     *
     * @param string $role Name of role
     * @return boolean
     */
    public function hasRole($role)
    {
        $user = $this->user();

        // TODO: this is only temporary
        if ($user && in_array($user->username, static::$allowed))
        {
            return true;
        }

        return false;
    }

    /**
     * Get list over roles user have access to
     */
    public function getRoles()
    {
        if ($this->hasRole('all')) {
            return array('all');
        }

        return array();
    }

}