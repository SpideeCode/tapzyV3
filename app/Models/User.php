<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'restaurant_id',
        'name',
        'email',
        'password',
        'role'
    ];

    protected $hidden = ['password', 'remember_token'];

    /**
     * Hash the password using Bcrypt
     *
     * @param  string  $value
     * @return void
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
