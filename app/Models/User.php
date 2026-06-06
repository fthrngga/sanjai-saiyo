<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function pelanggan()
    {
        return $this->hasOne(Pelanggan::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function userVouchers()
    {
        return $this->hasMany(UserVoucher::class);
    }

    public function claimedVouchers()
    {
        return $this->belongsToMany(Voucher::class, 'user_vouchers')
            ->withPivot(['id', 'claimed_at', 'used_at', 'order_id'])
            ->withTimestamps();
    }
}
