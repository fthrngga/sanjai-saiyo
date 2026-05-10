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
        $selectedYear = request('year', Carbon::now()->year);
        $selectedMonth = request('month', 'all');

        // Summary Metrics based on selected filter
        $baseOrderQuery = Order::whereYear('created_at', $selectedYear);
        if ($selectedMonth !== 'all') {
            $baseOrderQuery->whereMonth('created_at', $selectedMonth);
        }

        $totalRevenue = (clone $baseOrderQuery)->where('order_status', 'completed')->sum('total_price');
        
        // Untuk text sub-info "Bulan ini", kita bisa tetap menggunakan bulan ini secara real time
        // Atau jika difilter, kita anggap tidak ada perbandingan. Untuk kemudahan kita tetap hitung bulan ini real time.
        $thisMonthRevenue = Order::where('order_status', 'completed')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_price');

        $baseUserQuery = User::where('role', 'pelanggan')->whereYear('created_at', $selectedYear);
        if ($selectedMonth !== 'all') {
            $baseUserQuery->whereMonth('created_at', $selectedMonth);
        }
        $totalUsers = $baseUserQuery->count();
        
        $activeProducts = Product::count(); 

        $pendingOrders = (clone $baseOrderQuery)->where('order_status', 'pending')->count();
        $processingOrders = (clone $baseOrderQuery)->where('order_status', 'processing')->count();

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

        // Fitur Filter Chart (Tahun dan Bulan)
        $availableYears = Order::where('order_status', 'completed')
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        if ($availableYears->isEmpty()) {
            $availableYears = collect([Carbon::now()->year]);
        }

        $chartData = [];
        $chartLabels = [];

        // ALWAYS group by month for the selected year (12 months)
        $salesPerMonth = Order::where('order_status', 'completed')
            ->whereYear('created_at', $selectedYear)
            ->selectRaw('MONTH(created_at) as month, SUM(total_price) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        foreach (range(1, 12) as $m) {
            $chartLabels[] = $monthsName[$m - 1];
            $chartData[] = (float) $salesPerMonth->get($m, 0);
        }

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
            'top_products' => $topProducts,
            'chart_data' => $chartData,
            'chart_labels' => $chartLabels,
            'available_years' => $availableYears,
            'filters' => [
                'year' => $selectedYear,
                'month' => $selectedMonth,
            ]
        ]);
    }
}
