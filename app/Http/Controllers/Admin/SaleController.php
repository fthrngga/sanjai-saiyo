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
        $month = $request->input('month');
        $year = $request->input('year');

        // Base query for completed orders with filters
        $baseQuery = Order::where('order_status', 'completed')
            ->when($month, function ($q) use ($month) {
                return $q->whereMonth('updated_at', $month);
            })
            ->when($year, function ($q) use ($year) {
                return $q->whereYear('updated_at', $year);
            });

        $totalRevenue = $baseQuery->sum('total_price');
        $totalOrders = $baseQuery->count();

        // Calculate total items sold with filters
        $totalItemsSold = OrderItem::whereHas('order', function ($query) use ($month, $year) {
            $query->where('order_status', 'completed')
                ->when($month, function ($q) use ($month) {
                    return $q->whereMonth('updated_at', $month);
                })
                ->when($year, function ($q) use ($year) {
                    return $q->whereYear('updated_at', $year);
                });
        })->sum('quantity');

        // Fetch completed orders with pagination and filters
        $sales = Order::with(['user', 'items.product'])
            ->where('order_status', 'completed')
            ->when($month, function ($q) use ($month) {
                return $q->whereMonth('updated_at', $month);
            })
            ->when($year, function ($q) use ($year) {
                return $q->whereYear('updated_at', $year);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Get distinct years from orders for dropdown filter
        $availableYears = Order::where('order_status', 'completed')
            ->selectRaw('YEAR(updated_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        // Fallback if no sales exist
        if (empty($availableYears)) {
            $availableYears = [(int) date('Y')];
        }

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_items_sold' => $totalItemsSold
            ],
            'filters' => [
                'month' => $month,
                'year' => $year,
            ],
            'availableYears' => $availableYears
        ]);
    }
}
