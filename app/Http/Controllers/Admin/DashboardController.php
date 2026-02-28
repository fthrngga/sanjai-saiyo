<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Summary Metrics
        $totalRevenue = Order::where('order_status', 'completed')->sum('total_price');
        
        $thisMonthRevenue = Order::where('order_status', 'completed')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_price');

        $totalUsers = User::where('role', 'pelanggan')->count();
        $activeProducts = Product::count(); 

        $pendingOrders = Order::where('order_status', 'pending')->count();
        $processingOrders = Order::where('order_status', 'processing')->count();

        // Recent Orders
        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(5)
            ->get();

        // Fetch top products by quantity sold
        $topProducts = \App\Models\OrderItem::select('product_name_snapshot', \DB::raw('SUM(quantity) as total_sold'), \DB::raw('SUM(price_at_purchase * quantity) as total_revenue'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.order_status', 'completed')
            ->groupBy('product_name_snapshot')
            ->orderByDesc('total_sold')
            ->take(4)
            ->get();

        return Inertia::render('Dashboard', [
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'this_month_revenue' => $thisMonthRevenue,
                'active_products' => $activeProducts,
                'pending_orders' => $pendingOrders,
                'processing_orders' => $processingOrders,
                'total_users' => $totalUsers
            ],
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts
        ]);
    }
}
