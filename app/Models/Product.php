<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_produk',
        'deskripsi',
        'harga',
        'stok',
        'berat',
        'gambar',
        'category_id',
    ];

    protected $appends = ['rating_average', 'total_sold'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getRatingAverageAttribute()
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    public function getTotalSoldAttribute()
    {
        // Only count completed orders
        return $this->orderItems()
            ->whereHas('order', function ($query) {
                $query->where('payment_status', 'paid');
            })
            ->sum('quantity');
    }
}
