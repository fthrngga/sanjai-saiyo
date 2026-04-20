<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $fillable = [
        'user_id', 'label', 'recipient_name', 'phone_number',
        'full_address', 'province_id', 'city_id', 'district_id', 'subdistrict_id', 'postal_code', 'is_primary'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
