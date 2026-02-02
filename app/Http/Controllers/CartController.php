<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = \App\Models\Cart::with(['product', 'variant'])
            ->where('user_id', auth()->id())
            ->get();

        return \Inertia\Inertia::render('Cart/Index', [
            'cartItems' => $cartItems
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $cartItem = \App\Models\Cart::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            \App\Models\Cart::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->back()->with('success', 'Produk ditambahkan ke keranjang.');
    }

    public function update(Request $request, \App\Models\Cart $cart)
    {
        // Ensure user owns this cart item
        if ($cart->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'nullable|integer|min:1',
            'is_selected' => 'nullable|boolean',
        ]);

        $cart->update($request->only(['quantity', 'is_selected']));

        return redirect()->back();
    }

    public function destroy(\App\Models\Cart $cart)
    {
        if ($cart->user_id !== auth()->id()) {
            abort(403);
        }

        $cart->delete();

        return redirect()->back()->with('success', 'Item dihapus dari keranjang.');
    }
}
