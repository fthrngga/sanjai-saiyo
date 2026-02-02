<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Added this line based on 'use HasFactory;' inside the class

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['nama_kategori'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
