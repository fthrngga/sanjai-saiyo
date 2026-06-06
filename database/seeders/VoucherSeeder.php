<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        $vouchers = [
            [
                'code' => 'WELCOMESAIYO',
                'name' => 'Voucher Selamat Datang',
                'type' => 'shipping',
                'discount_type' => 'fixed',
                'discount_value' => 15000,
                'max_discount' => null,
                'min_spend' => 0,
                'quota' => -1,
                'start_date' => now(),
                'end_date' => now()->addYears(5),
                'is_active' => true,
            ],
            [
                'code' => 'DISKONHEBAT',
                'name' => 'Diskon Produk 10% Spesial',
                'type' => 'product',
                'discount_type' => 'percentage',
                'discount_value' => 10,
                'max_discount' => 20000,
                'min_spend' => 50000,
                'quota' => 100,
                'start_date' => now(),
                'end_date' => now()->addMonths(6),
                'is_active' => true,
            ],
            [
                'code' => 'ONGKIRHEMAT',
                'name' => 'Potongan Ongkir Rp 10.000',
                'type' => 'shipping',
                'discount_type' => 'fixed',
                'discount_value' => 10000,
                'max_discount' => null,
                'min_spend' => 30000,
                'quota' => 200,
                'start_date' => now(),
                'end_date' => now()->addMonths(6),
                'is_active' => true,
            ],
            [
                'code' => 'SAIYOMANIS',
                'name' => 'Potongan Belanja Rp 15.000',
                'type' => 'product',
                'discount_type' => 'fixed',
                'discount_value' => 15000,
                'max_discount' => null,
                'min_spend' => 100000,
                'quota' => 50,
                'start_date' => now(),
                'end_date' => now()->addMonths(6),
                'is_active' => true,
            ],
        ];

        foreach ($vouchers as $v) {
            \App\Models\Voucher::firstOrCreate(['code' => $v['code']], $v);
        }
    }
}
