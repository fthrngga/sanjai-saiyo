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
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('kode_unik')->nullable();
            $table->integer('grand_total')->nullable();
            $table->enum('status_pembayaran', ['unpaid', 'pending_verification', 'paid', 'failed'])->default('unpaid');
            $table->string('bukti_pembayaran')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['kode_unik', 'grand_total', 'status_pembayaran', 'bukti_pembayaran']);
        });
    }
};
