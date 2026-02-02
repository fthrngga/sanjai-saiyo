<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'recipient_name',
        'phone_number',
        'label',
        'province_id',
        'province_name',
        'city_id',
        'city_name',
        'district_id',
        'district_name',
        'full_address',
        'is_primary'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
