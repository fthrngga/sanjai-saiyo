<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Keripik', 'Snack', 'Kue'];

        foreach ($categories as $catName) {
            $cat = \App\Models\Category::create(['nama_kategori' => $catName]);

            for ($i = 1; $i <= 3; $i++) {
                $product = \App\Models\Product::create([
                    'category_id' => $cat->id,
                    'nama_produk' => $catName . ' ' . $i,
                    'deskripsi' => 'Deskripsi lezat untuk ' . $catName . ' ' . $i,
                    'harga' => rand(10000, 50000),
                    'stok' => rand(10, 100),
                    'gambar' => 'products/' . $catName . '.jpg',
                ]);

                // Create Variants
                $variants = ['Original', 'Pedas', 'Keju', 'Balado'];
                foreach ($variants as $index => $vName) {
                    \App\Models\ProductVariant::create([
                        'product_id' => $product->id,
                        'name' => $vName,
                        'additional_price' => ($index * 1000),
                        'stock' => rand(5, 50),
                    ]);
                }

                // Create Mock Reviews
                $user = \App\Models\User::inRandomOrder()->first();
                if ($user) {
                    for ($r = 0; $r < rand(1, 5); $r++) {
                        // Need an order for the review technically, but for seeding we can just create a review
                        // If schema enforces order_id, we need a dummy order. 
                        // Let's create a dummy completed order for this review.

                        $order = \App\Models\Order::create([
                            'user_id' => $user->id,
                            'address_snapshot' => [],
                            'total_price' => $product->harga,
                            'shipping_cost' => 10000,
                            'shipping_courier' => 'jne',
                            'shipping_service' => 'REG',
                            'payment_status' => 'paid',
                            'order_status' => 'completed'
                        ]);

                        \App\Models\OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'product_name_snapshot' => $product->nama_produk,
                            'price_at_purchase' => $product->harga,
                            'quantity' => rand(1, 3)
                        ]);

                        \App\Models\Review::create([
                            'user_id' => $user->id,
                            'product_id' => $product->id,
                            'order_id' => $order->id,
                            'rating' => rand(4, 5),
                            'comment' => 'Enak banget! Rasanya otentik.',
                        ]);
                    }
                }
            }
        }
    }
}

