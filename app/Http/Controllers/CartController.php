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

        $isBuyNow = $request->boolean('is_buy_now');

        // If it's a Buy Now action, deselect all existing cart items first
        if ($isBuyNow) {
            \App\Models\Cart::where('user_id', auth()->id())->update(['is_selected' => false]);
        }

        $cartItem = \App\Models\Cart::firstOrNew([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'product_variant_id' => $request->product_variant_id,
        ]);

        if ($isBuyNow) {
            // For Buy Now, override quantity and forcefully select it
            $cartItem->quantity = $request->quantity;
            $cartItem->is_selected = true;
        } else {
            $cartItem->quantity = ($cartItem->quantity ?? 0) + $request->quantity;
        }

        $cartItem->save();

        if ($isBuyNow) {
            return redirect()->route('checkout.index');
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
