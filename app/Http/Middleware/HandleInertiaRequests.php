<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cart_count' => $request->user()
                ? \App\Models\Cart::where('user_id', $request->user()->id)->sum('quantity')
                : 0,
            'unread_orders_count' => ($request->user() && $request->user()->role === 'admin')
                ? \App\Models\Order::where('is_admin_read', false)->count()
                : 0,
            'notifications' => $request->user()
                ? $request->user()->notifications()->latest()->take(10)->get()
                : [],
            'unread_notifications_count' => $request->user()
                ? $request->user()->unreadNotifications()->count()
                : 0,
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
        ];
    }
}
