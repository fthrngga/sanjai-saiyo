<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Product Variants
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g. "Pedas Level 1", "Original"
            $table->integer('additional_price')->default(0); // Price added to base product price
            $table->integer('stock')->default(0);
            $table->timestamps();
        });

        // 2. User Addresses (Compatible with RajaOngkir)
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('recipient_name');
            $table->string('phone_number');
            $table->string('label')->default('Rumah'); // Rumah, Kantor

            // Region IDs from RajaOngkir
            $table->string('province_id');
            $table->string('province_name');
            $table->string('city_id');
            $table->string('city_name');
            $table->string('district_id')->nullable(); // Kecamatan (if supported by plan)
            $table->string('district_name')->nullable();

            $table->text('full_address');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        // 3. Shopping Cart
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('set null');
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });

        // 4. Orders
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Snapshot of address to preserve history if user changes address later
            $table->json('address_snapshot');

            $table->integer('total_price'); // Includes product price + shipping
            $table->integer('shipping_cost');
            $table->string('shipping_courier'); // jne, pos, tiki
            $table->string('shipping_service'); // REG, OKE

            // Payment
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'expired'])->default('pending');
            $table->string('snap_token')->nullable(); // Midtrans token

            // Order Status
            $table->enum('order_status', ['pending', 'processing', 'shipped', 'completed', 'cancelled'])->default('pending');
            $table->string('tracking_number')->nullable();

            $table->timestamps();
        });

        // 5. Order Items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('set null');

            // Snapshots in case product is deleted/changed
            $table->string('product_name_snapshot');
            $table->string('variant_name_snapshot')->nullable();
            $table->integer('price_at_purchase'); // Base + Variant price
            $table->integer('quantity');
            $table->timestamps();
        });

        // 6. Reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->integer('rating'); // 1-5
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('product_variants');
    }
};
