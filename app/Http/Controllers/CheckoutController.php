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

        return \Inertia\Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'provinces' => $provinces
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

        // Determine destination
        $destinationId = $request->subdistrict_id ?? $request->district_id ?? $request->city_id;
        $destinationType = $request->subdistrict_id ? 'subdistrict' : ($request->district_id ? 'district' : 'city');

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
        ]);

        $cartItems = \App\Models\Cart::with(['product', 'variant'])
            ->where('user_id', auth()->id())
            ->where('is_selected', true)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index');
        }

        $itemsTotal = 0;
        foreach ($cartItems as $item) {
            $price = $item->product->harga + ($item->variant ? $item->variant->additional_price : 0);
            $itemsTotal += $price * $item->quantity;
        }

        $shippingCost = $request->shipping_cost;
        $grandTotal = $itemsTotal + $shippingCost;

        // Create Order
        $order = \App\Models\Order::create([
            'user_id' => auth()->id(),
            'address_snapshot' => $request->only(['recipient_name', 'phone_number', 'full_address', 'province_name', 'city_name', 'province_id', 'city_id']),
            'total_price' => $grandTotal,
            'shipping_cost' => $shippingCost,
            'shipping_courier' => $request->courier,
            'shipping_service' => $request->shipping_service,
            'payment_status' => 'paid', // Still dummy paid
            'order_status' => 'pending',
            'snap_token' => 'dummy-snap-token-' . uniqid(),
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

        \App\Models\Cart::where('user_id', auth()->id())
            ->where('is_selected', true)
            ->delete();

        return redirect()->route('payment.show', $order->id)->with('success', 'Pesanan berhasil dibuat! Silakan lakukan pembayaran.');
    }
}
