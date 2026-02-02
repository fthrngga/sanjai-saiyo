<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function show(Order $order)
    {
        // Ensure user owns the order
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Payment/Index', [
            'order' => $order->load('items'),
            'snap_client_key' => config('services.midtrans.client_key'), // We'll assume this might be null for now
        ]);
    }

    public function simulate(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->update([
            'payment_status' => 'paid',
            'order_status' => 'processing'
        ]);

        return redirect()->route('home')->with('success', 'Pembayaran Berhasil (Simulasi)!');
    }
}
