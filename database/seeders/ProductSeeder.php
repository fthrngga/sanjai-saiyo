<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data Produk Riil Sanjai Saiyo Payakumbuh
        // Asumsi: Harga dasar adalah untuk kemasan standar (misal 250 gram)
        $data = [
            'Keripik Sanjai' => [
                [
                    'nama' => 'Sanjai Balado Merah',
                    'deskripsi' => 'Keripik singkong renyah dengan balutan bumbu karamel cabai merah asli yang pedas, manis, dan lengket merata. (Kemasan 250 Gram)',
                    'gambar' => 'products/Keripik.jpg',
                    'harga' => 25000,
                    'variants' => [
                        ['name' => 'Pedas Standar', 'additional_price' => 0],
                        ['name' => 'Ekstra Pedas', 'additional_price' => 2000],
                    ]
                ],
                [
                    'nama' => 'Sanjai Balado Hijau',
                    'deskripsi' => 'Inovasi rasa dengan bumbu cabai hijau pilihan. Memberikan aroma segar khas cabai hijau. (Kemasan 250 Gram)',
                    'gambar' => 'products/Keripik.jpg',
                    'harga' => 27000,
                    'variants' => [
                        ['name' => 'Pedas Standar', 'additional_price' => 0],
                        ['name' => 'Ekstra Pedas', 'additional_price' => 2000],
                    ]
                ],
                [
                    'nama' => 'Sanjai Tawar (Putih)',
                    'deskripsi' => 'Keripik singkong original yang diiris tipis, digoreng garing. Sangat renyah dan cocok untuk camilan santai. (Kemasan 250 Gram)',
                    'gambar' => 'products/Keripik.jpg',
                    'harga' => 20000,
                    'variants' => [
                        ['name' => 'Original', 'additional_price' => 0],
                        ['name' => 'Asin Gurih (Bawang)', 'additional_price' => 1000],
                    ]
                ],
                [
                    'nama' => 'Karak Kaliang',
                    'deskripsi' => 'Camilan tradisional berbahan dasar singkong berbentuk angka delapan. Gurih khas bawang putih dan sangat renyah. (Kemasan 250 Gram)',
                    'gambar' => 'products/Keripik.jpg',
                    'harga' => 15000,
                    'variants' => [
                        ['name' => 'Original', 'additional_price' => 0],
                    ]
                ],
                [
                    'nama' => 'Dakak-dakak',
                    'deskripsi' => 'Singkong potong dadu kecil yang digoreng kering dengan bumbu kuning. Aroma daun kunyitnya sangat wangi. (Kemasan 250 Gram)',
                    'gambar' => 'products/Keripik.jpg',
                    'harga' => 18000,
                    'variants' => [
                        ['name' => 'Original', 'additional_price' => 0],
                        ['name' => 'Pedas', 'additional_price' => 2000],
                    ]
                ],
            ],
            
            'Kudapan Manis Tradisional' => [
                [
                    'nama' => 'Galamai Payakumbuh',
                    'deskripsi' => 'Dodol khas Payakumbuh berbahan dasar tepung ketan, santan, dan gula aren. Teksturnya kenyal dan legit. (Kemasan 500 Gram)',
                    'gambar' => 'products/Kue.jpg',
                    'harga' => 35000,
                    'variants' => [
                        ['name' => 'Original (Polos)', 'additional_price' => 0],
                        ['name' => 'Tabur Kacang', 'additional_price' => 3000],
                    ]
                ],
                [
                    'nama' => 'Kipang Kacang',
                    'deskripsi' => 'Kacang tanah sangrai utuh yang disatukan dengan karamel gula aren yang manis and kental. (Kemasan 250 Gram)',
                    'gambar' => 'products/Kue.jpg',
                    'harga' => 20000,
                    'variants' => [
                        ['name' => 'Original', 'additional_price' => 0],
                    ]
                ],
                [
                    'nama' => 'Batiah',
                    'deskripsi' => 'Kerupuk ketan manis khas Payakumbuh disiram cairan gula merah. (Isi 10 Pcs)',
                    'gambar' => 'products/Kue.jpg',
                    'harga' => 15000,
                    'variants' => [
                        ['name' => 'Original', 'additional_price' => 0],
                    ]
                ],
            ],

            'Kue & Bakery' => [
                [
                    'nama' => 'Kue Sapik',
                    'deskripsi' => 'Kue kering tradisional Minang yang dilipat saat panas. Renyah dan harum. (Kemasan Toples Sedang)',
                    'gambar' => 'products/Kue.jpg',
                    'harga' => 25000,
                    'variants' => [
                        ['name' => 'Original (Kayu Manis)', 'additional_price' => 0],
                        ['name' => 'Pandan', 'additional_price' => 2000],
                    ]
                ],
            ],

            'Kerupuk & Rakik' => [
                [
                    'nama' => 'Rakik Maco',
                    'deskripsi' => 'Gorengan renyah berbahan dasar adonan tepung beras dan telur, diberi topping ikan maco. (Isi 10 Pcs)',
                    'gambar' => 'products/Snack.jpg',
                    'harga' => 15000,
                    'variants' => [
                        ['name' => 'Ikan Maco', 'additional_price' => 0],
                        ['name' => 'Udang Rebon', 'additional_price' => 2000],
                    ]
                ],
                [
                    'nama' => 'Karupuak Jangek (Rambak Kulit)',
                    'deskripsi' => 'Kerupuk kulit sapi asli yang digoreng mekar sempurna. (Kemasan 200 Gram)',
                    'gambar' => 'products/Snack.jpg',
                    'harga' => 25000,
                    'variants' => [
                        ['name' => 'Original Gurih', 'additional_price' => 0],
                        ['name' => 'Bumbu Pedas Daun Jeruk', 'additional_price' => 3000],
                    ]
                ],
            ],
        ];

        foreach ($data as $categoryName => $products) {
            $cat = Category::firstOrCreate(['nama_kategori' => $categoryName]);

            foreach ($products as $p) {
                // Check if the product already exists to prevent duplication
                $product = Product::where('nama_produk', $p['nama'])->first();
                if ($product) {
                    // Update image path to use the existing committed image files
                    $product->update(['gambar' => $p['gambar']]);
                    continue;
                }

                $product = Product::create([
                    'category_id' => $cat->id,
                    'nama_produk' => $p['nama'],
                    'deskripsi' => $p['deskripsi'],
                    'harga' => $p['harga'],
                    'stok' => rand(30, 100),
                    'gambar' => $p['gambar'],
                ]);

                foreach ($p['variants'] as $variantData) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'name' => $variantData['name'],
                        'additional_price' => $variantData['additional_price'],
                        'stock' => rand(15, 50),
                    ]);
                }

                $user = User::inRandomOrder()->first();
                if ($user) {
                    $order = Order::create([
                        'user_id' => $user->id,
                        'address_snapshot' => json_encode(['address' => 'Jl. Sudirman, Pekanbaru']),
                        'total_price' => $product->harga,
                        'shipping_cost' => 15000,
                        'shipping_courier' => 'jnt',
                        'shipping_service' => 'EZ',
                        'payment_status' => 'paid',
                        'order_status' => 'completed'
                    ]);

                    // Randomize which variant gets ordered for the mock review
                    $randomVariant = $product->variants()->inRandomOrder()->first();
                    $priceAtPurchase = $product->harga + ($randomVariant ? $randomVariant->additional_price : 0);
                    $variantName = $randomVariant ? ' - ' . $randomVariant->name : '';

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name_snapshot' => $product->nama_produk . $variantName,
                        'price_at_purchase' => $priceAtPurchase,
                        'quantity' => rand(1, 3)
                    ]);

                    $comments = [
                        'Packing rapi, bumbunya melimpah dan tidak pelit. Mantap!',
                        'Rasanya autentik banget, persis kayak yang sering dibeli langsung ke tokonya.',
                        'Pengiriman cepat, keripiknya nggak hancur di jalan. Rekomen banget buat oleh-oleh.',
                        'Enak, garing, rasanya pas nggak bikin eneg. Repeat order pastinya.',
                        'Produk fresh baru digoreng sepertinya. Top markotop!'
                    ];

                    Review::create([
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                        'order_id' => $order->id,
                        'rating' => rand(4, 5),
                        'comment' => $comments[array_rand($comments)],
                    ]);
                }
            }
        }
    }
}