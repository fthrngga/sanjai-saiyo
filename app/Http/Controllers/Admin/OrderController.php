<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }

        $orders = $query->latest()->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status'])
        ]);
    }

    public function show(Order $order)
    {
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load(['user', 'items.product'])
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'order_status' => 'required|in:pending,processing,shipped,completed,cancelled',
            'tracking_number' => 'nullable|string|max:255',
        ]);

        // Validation logic to prevent backward status updates
        $statusOrder = ['pending', 'processing', 'shipped', 'completed'];
        $currentStatusIndex = array_search($order->order_status, $statusOrder);
        $newStatusIndex = array_search($validated['order_status'], $statusOrder);

        // Check if status exists in the normal flow
        if ($currentStatusIndex !== false && $newStatusIndex !== false) {
            if ($newStatusIndex < $currentStatusIndex) {
                return redirect()->back()->withErrors(['order_status' => 'Status pesanan tidak dapat dikembalikan ke tahap sebelumnya.']);
            }
        }

        // Specific rule: Completed orders cannot be changed
        if ($order->order_status === 'completed') {
            return redirect()->back()->withErrors(['order_status' => 'Pesanan yang sudah selesai tidak dapat diubah statusnya.']);
        }

        $order->update([
            'order_status' => $validated['order_status'],
            'tracking_number' => $validated['tracking_number'] ?? $order->tracking_number,
        ]);

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
