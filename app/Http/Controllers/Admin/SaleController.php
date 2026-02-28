<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        // Gather analytics metrics for only 'completed' orders
        $totalRevenue = Order::where('order_status', 'completed')->sum('total_price');
        $totalOrders = Order::where('order_status', 'completed')->count();
        $totalItemsSold = OrderItem::whereHas('order', function($query) {
            $query->where('order_status', 'completed');
        })->sum('quantity');

        // Fetch completed orders with pagination
        $sales = Order::with(['user', 'items.product'])
            ->where('order_status', 'completed')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_items_sold' => $totalItemsSold
            ]
        ]);
    }
}
