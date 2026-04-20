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

        // If it's a Buy Now action, deselect all existing cart items first
        if ($request->is_buy_now) {
            \App\Models\Cart::where('user_id', auth()->id())->update(['is_selected' => false]);
        }

        if ($cartItem) {
            // For Buy Now, ignore adding to existing quantity, just set the quantity to what they chose this time
            // Or add to it depending on logic. Usually Buy Now sets exact quantity.
            if ($request->is_buy_now) {
                $cartItem->quantity = $request->quantity;
                $cartItem->is_selected = true;
            } else {
                $cartItem->quantity += $request->quantity;
            }
            $cartItem->save();
        } else {
            \App\Models\Cart::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
                'is_selected' => $request->is_buy_now ? true : false, // Default is usually true or false in migration, force it here
            ]);
        }

        if ($request->is_buy_now) {
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
