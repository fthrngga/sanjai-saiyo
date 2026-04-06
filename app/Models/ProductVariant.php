<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'name', 'additional_price', 'stock', 'image_path'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
