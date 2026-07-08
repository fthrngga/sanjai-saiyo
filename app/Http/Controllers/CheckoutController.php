<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    protected $rajaOngkir;

    public function __construct(\App\Services\RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function index()
    {
        $cartItems = \App\Models\Cart::with(['product', 'variant'])
            ->where('user_id', auth()->id())
            ->where('is_selected', true)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index');
        }

        $provinces = $this->rajaOngkir->getProvinces();
        $userAddresses = auth()->user()->addresses;

        $now = now();
        $availableVouchers = \App\Models\Voucher::where('is_active', true)
            ->where(function($q) {
                $q->where('quota', '>', 0)->orWhere('quota', -1);
            })
            ->where(function($q) use ($now) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $now);
            })
            ->where(function($q) use ($now) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $now);
            })
            ->get();

        return \Inertia\Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'provinces' => $provinces,
            'userAddresses' => $userAddresses,
            'availableVouchers' => $availableVouchers
        ]);
    }

    public function getCities(Request $request)
    {
        $cities = $this->rajaOngkir->getCities($request->province_id);
        return response()->json($cities);
    }

    public function getDistricts(Request $request)
    {
        $districts = $this->rajaOngkir->getDistricts($request->city_id);
        return response()->json($districts);
    }

    public function getSubdistricts(Request $request)
    {
        $subdistricts = $this->rajaOngkir->getSubdistricts($request->district_id);
        return response()->json($subdistricts);
    }

    public function getShippingCost(Request $request)
    {
        // 1. Calculate total weight
        $weight = 0;
        $cartItems = \App\Models\Cart::with('product')
            ->where('user_id', auth()->id())
            ->where('is_selected', true)
            ->get();

        foreach ($cartItems as $item) {
            $weight += $item->product->berat * $item->quantity;
        }

        if ($weight == 0)
            return response()->json([]);

        // Fallback to district instead of subdistrict for better courier compatibility (JNE, TIKI)
        $destinationId = $request->district_id ?? $request->city_id;
        $destinationType = $request->district_id ? 'district' : 'city';

        $costs = $this->rajaOngkir->getCost($destinationId, $weight, $request->courier, $destinationType);
        return response()->json($costs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'recipient_name' => 'required|string',
            'phone_number' => 'required|string',
            'full_address' => 'required|string',
            'province_id' => 'required',
            'city_id' => 'required',
            'courier' => 'required|string',
            'shipping_service' => 'required|string',
            'shipping_cost' => 'required|integer',
            'voucher_id' => 'nullable|integer',
        ]);

        $cartItems = \App\Models\Cart::with(['product', 'variant'])
            ->where('user_id', auth()->id())
            ->where('is_selected', true)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index');
        }

        // Validate stock before checkout
        foreach ($cartItems as $item) {
            $availableStock = $item->variant ? $item->variant->stock : $item->product->stok;
            if ($item->quantity > $availableStock) {
                $name = $item->product->nama_produk . ($item->variant ? " ({$item->variant->name})" : "");
                return back()->withErrors(['stock' => "Stok untuk {$name} tidak mencukupi. Hanya tersedia {$availableStock} unit. Silakan sesuaikan keranjang Anda."]);
            }
        }

        $itemsTotal = 0;
        foreach ($cartItems as $item) {
            $price = $item->product->harga + ($item->variant ? $item->variant->additional_price : 0);
            $itemsTotal += $price * $item->quantity;
        }

        $shippingCost = $request->shipping_cost;
        $discountAmount = 0;
        $voucherId = null;

        if ($request->voucher_id) {
            $voucher = \App\Models\Voucher::find($request->voucher_id);
            if ($voucher && $voucher->is_active && ($voucher->quota > 0 || $voucher->quota == -1)) {
                $now = now();
                $isValidDate = (!$voucher->start_date || $voucher->start_date <= $now) && 
                               (!$voucher->end_date || $voucher->end_date >= $now);

                if ($isValidDate && $itemsTotal >= $voucher->min_spend) {
                    $voucherId = $voucher->id;

                    if ($voucher->type === 'shipping') {
                            if ($voucher->discount_type === 'fixed') {
                                $discountAmount = min($shippingCost, $voucher->discount_value);
                            } else {
                                $pctDiscount = $shippingCost * ($voucher->discount_value / 100);
                                if ($voucher->max_discount) {
                                    $pctDiscount = min($pctDiscount, $voucher->max_discount);
                                }
                                $discountAmount = min($shippingCost, $pctDiscount);
                            }
                        } else {
                            if ($voucher->discount_type === 'fixed') {
                                $discountAmount = min($itemsTotal, $voucher->discount_value);
                            } else {
                                $pctDiscount = $itemsTotal * ($voucher->discount_value / 100);
                                if ($voucher->max_discount) {
                                    $pctDiscount = min($pctDiscount, $voucher->max_discount);
                                }
                                $discountAmount = min($itemsTotal, $pctDiscount);
                            }
                        }
                    }
                }

            if (!$voucherId) {
                return back()->withErrors(['voucher' => 'Voucher tidak valid, kuota habis, atau tidak memenuhi syarat minimum belanja.']);
            }
        }

        $totalPrice = $itemsTotal + $shippingCost;
        $kodeUnik = rand(100, 999);
        $grandTotal = max(0, $itemsTotal + $shippingCost - $discountAmount) + $kodeUnik;

        // Create Order and items inside transaction
        $order = \DB::transaction(function () use ($request, $cartItems, $totalPrice, $shippingCost, $kodeUnik, $grandTotal, $voucherId, $discountAmount) {
            $order = \App\Models\Order::create([
                'user_id' => auth()->id(),
                'address_snapshot' => $request->only(['recipient_name', 'phone_number', 'full_address', 'province_name', 'city_name', 'province_id', 'city_id']),
                'total_price' => $totalPrice,
                'shipping_cost' => $shippingCost,
                'shipping_courier' => $request->courier,
                'shipping_service' => $request->shipping_service,
                'payment_status' => 'pending', 
                'order_status' => 'pending',
                'kode_unik' => $kodeUnik,
                'grand_total' => $grandTotal,
                'status_pembayaran' => 'unpaid',
                'snap_token' => null,
                'voucher_id' => $voucherId,
                'discount_amount' => $discountAmount,
            ]);

            foreach ($cartItems as $item) {
                $price = $item->product->harga + ($item->variant ? $item->variant->additional_price : 0);

                \App\Models\OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name_snapshot' => $item->product->nama_produk,
                    'variant_name_snapshot' => $item->variant ? $item->variant->name : null,
                    'price_at_purchase' => $price,
                    'quantity' => $item->quantity,
                ]);
            }

            if ($voucherId) {
                $voucherToUpdate = \App\Models\Voucher::find($voucherId);
                if ($voucherToUpdate && $voucherToUpdate->quota > 0) {
                    $voucherToUpdate->decrement('quota');
                }

                \App\Models\UserVoucher::create([
                    'user_id' => auth()->id(),
                    'voucher_id' => $voucherId,
                    'order_id' => $order->id,
                    'claimed_at' => now(),
                    'used_at' => now(),
                ]);
            }

            \App\Models\Cart::where('user_id', auth()->id())
                ->where('is_selected', true)
                ->delete();

            return $order;
        });

        return redirect()->route('payment.show', $order->id)->with('success', 'Pesanan berhasil dibuat! Silakan lakukan pembayaran.');
    }
}
