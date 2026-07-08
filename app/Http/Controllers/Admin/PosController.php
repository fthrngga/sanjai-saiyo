<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PosController extends Controller
{
    public function index()
    {
        // Load products with variants that have stock > 0
        $products = Product::with(['variants', 'images', 'category'])
            ->where('stok', '>', 0)
            ->orWhereHas('variants', function ($query) {
                $query->where('stock', '>', 0);
            })
            ->latest()
            ->get();

        return Inertia::render('Admin/Pos/Index', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.variant_id' => 'nullable|exists:product_variants,id',
            'cart.*.name' => 'required|string',
            'cart.*.variant_name' => 'nullable|string',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            // Find or create Walk-in Customer
            $offlineUser = User::firstOrCreate(
                ['email' => 'walkin@sanjaisaiyo.com'],
                [
                    'name' => 'Pelanggan Offline',
                    'password' => bcrypt(Str::random(16)),
                    'role' => 'customer',
                    'phone' => '-',
                    'address' => 'Toko Fisik Sanjai Saiyo',
                    'email_verified_at' => now(),
                ]
            );

            // Calculate total
            $totalPrice = 0;
            foreach ($request->cart as $item) {
                $totalPrice += $item['price'] * $item['quantity'];
            }

            // Create Order
            $order = Order::create([
                'user_id' => $offlineUser->id,
                'address_snapshot' => [
                    'name' => 'Pelanggan Offline',
                    'phone' => '-',
                    'address' => 'Toko Fisik Sanjai Saiyo',
                    'city_name' => 'Bukittinggi',
                    'province_name' => 'Sumatera Barat'
                ],
                'total_price' => $totalPrice,
                'shipping_cost' => 0,
                'shipping_courier' => 'offline',
                'shipping_service' => 'offline',
                'payment_status' => 'paid',
                'status_pembayaran' => 'paid',
                'order_status' => 'completed',
                'kode_unik' => 0,
                'grand_total' => $totalPrice,
                'bukti_pembayaran' => null,
            ]);

            // Create Order Items and Decrement Stock
            foreach ($request->cart as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'product_variant_id' => $item['variant_id'],
                    'product_name_snapshot' => $item['name'],
                    'variant_name_snapshot' => $item['variant_name'],
                    'price_at_purchase' => $item['price'],
                    'quantity' => $item['quantity'],
                ]);

                // Decrement stock
                $product = Product::find($item['id']);
                if ($item['variant_id']) {
                    $variant = \App\Models\ProductVariant::find($item['variant_id']);
                    if ($variant) {
                        $variant->decrement('stock', $item['quantity']);
                    }
                }
                
                // Always decrement product master stock if needed or if it represents total stock
                // According to our earlier logic, both are decremented if variant is used, or just product if no variant
                if ($product) {
                    $product->decrement('stok', $item['quantity']);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Transaksi Kasir Offline Berhasil!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memproses transaksi: ' . $e->getMessage()]);
        }
    }
}
