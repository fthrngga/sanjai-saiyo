<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change column to text
        Schema::table('orders', function (Blueprint $table) {
            $table->text('bukti_pembayaran')->nullable()->change();
        });

        // First convert existing data
        $orders = \DB::table('orders')->whereNotNull('bukti_pembayaran')->get();
        foreach ($orders as $order) {
            $val = $order->bukti_pembayaran;
            // If it's not already a JSON array, convert it
            if (!is_array(json_decode($val, true))) {
                \DB::table('orders')->where('id', $order->id)->update([
                    'bukti_pembayaran' => json_encode([$val])
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('bukti_pembayaran')->nullable()->change();
        });
    }
};
