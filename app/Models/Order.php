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
        'tracking_number',
        'cancel_reason',
        'kode_unik',
        'grand_total',
        'status_pembayaran',
        'bukti_pembayaran',
        'voucher_id',
        'discount_amount'
    ];

    protected $casts = [
        'address_snapshot' => 'array',
        'bukti_pembayaran' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
