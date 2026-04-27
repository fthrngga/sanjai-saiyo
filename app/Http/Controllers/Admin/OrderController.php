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
        // Remember the user's last selected status tab in session
        $status = $request->query('status', session('admin_order_status', 'all'));
        session(['admin_order_status' => $status]);

        $query = Order::with(['user', 'items.product']);

        // Filter by status if not 'all'
        if ($status !== 'all') {
            $query->where('order_status', $status);
        }

        // Get the unread order IDs before updating to pass to frontend for highlighting
        $newOrderIds = Order::where('is_admin_read', false)->pluck('id')->toArray();
        if (!empty($newOrderIds)) {
            Order::whereIn('id', $newOrderIds)->update(['is_admin_read' => true]);
        }

        $orders = $query->latest()->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => ['status' => $status],
            'newOrderIds' => $newOrderIds
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
            'cancel_reason' => 'nullable|string|max:1000',
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

        $oldStatus = $order->order_status;

        $order->update([
            'order_status' => $validated['order_status'],
            'tracking_number' => $validated['tracking_number'] ?? $order->tracking_number,
            'cancel_reason' => $validated['cancel_reason'] ?? $order->cancel_reason,
        ]);

        if ($oldStatus !== $validated['order_status']) {
            $order->user->notify(new \App\Notifications\OrderStatusChanged($order));
        }

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
