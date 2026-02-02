<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'address_snapshot',
        'total_price',
        'shipping_cost',
        'shipping_courier',
        'shipping_service',
        'payment_status',
        'snap_token',
        'order_status',
        'tracking_number'
    ];

    protected $casts = [
        'address_snapshot' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
