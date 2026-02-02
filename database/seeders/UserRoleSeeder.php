<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Pelanggan; 
use App\Models\Admin;     

class UserRoleSeeder extends Seeder
{

    public function run(): void
    {
        $adminUser = User::create([
            'name' => 'Admin Sanjai Saiyo',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('11223344'), 
            'role' => 'admin',
        ]);

        Admin::create([
            'user_id' => $adminUser->id,
            'phone' => '081234567890',
            'department' => 'IT & Operations',
        ]);


        $pelangganUser = User::create([
            'name' => 'Budi Pelanggan',
            'email' => 'pelanggan@gmail.com',
            'password' => Hash::make('11223344'),
            'role' => 'pelanggan',
        ]);

        Pelanggan::create([
            'user_id' => $pelangganUser->id,
            'no_telepon' => '087654321098',
        ]);

    }
}