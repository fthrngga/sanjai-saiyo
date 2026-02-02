<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Order/Index', [
            'orders' => $orders
        ]);
    }

    public function complete(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        if ($order->order_status !== 'shipped') {
            return back()->with('error', 'Pesanan belum dikirim atau sudah selesai.');
        }

        $order->update(['order_status' => 'completed']);

        return back()->with('success', 'Pesanan telah diterima. Terima kasih!');
    }
}
