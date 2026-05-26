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
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin Sanjai Saiyo',
                'password' => Hash::make('11223344'), 
                'role' => 'admin',
            ]
        );

        Admin::updateOrCreate(
            ['user_id' => $adminUser->id],
            [
                'phone' => '081234567890',
                'department' => 'IT & Operations',
            ]
        );


        $pelangganUser = User::updateOrCreate(
            ['email' => 'pelanggan@gmail.com'],
            [
                'name' => 'Budi Pelanggan',
                'password' => Hash::make('11223344'),
                'role' => 'pelanggan',
            ]
        );

        Pelanggan::updateOrCreate(
            ['user_id' => $pelangganUser->id],
            [
                'no_telepon' => '087654321098',
            ]
        );

    }
}