<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Product;
use App\Models\Category;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'products' => Product::with('category')
            ->take(10)
            ->get(),
        'categories' => Category::all(),
    ]);
})->name('home');

Route::get('/search', function () {
    $query = request('query');
    $products = \App\Models\Product::where('nama_produk', 'like', "%{$query}%")
        ->get();

    return Inertia::render('Search', [
        'results' => $products,
        'query' => $query,
    ]);
})->name('search.index');

Route::get('/products/{product}', function (\App\Models\Product $product) {
    return Inertia::render('Product/Detail', [
        'product' => $product->load(['category', 'variants', 'reviews.user']),
        'related_products' => \App\Models\Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get()
    ]);
})->name('products.show');

Route::get('/api/search/recommended', function () {
    return \App\Models\Product::inRandomOrder()
        ->take(4)
        ->get(['id', 'nama_produk', 'gambar', 'harga']);
});

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('admin/products', \App\Http\Controllers\Admin\ProductController::class)->names('admin.products');
    Route::resource('admin/orders', \App\Http\Controllers\Admin\OrderController::class)->names('admin.orders');
});

Route::middleware('auth')->group(function () {
    Route::get('/cart', [\App\Http\Controllers\CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [\App\Http\Controllers\CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cart}', [\App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [\App\Http\Controllers\CartController::class, 'destroy'])->name('cart.destroy');

    Route::get('/checkout', [\App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [\App\Http\Controllers\CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/cities', [\App\Http\Controllers\CheckoutController::class, 'getCities'])->name('checkout.cities');
    Route::get('/checkout/districts', [\App\Http\Controllers\CheckoutController::class, 'getDistricts'])->name('checkout.districts');
    Route::get('/checkout/subdistricts', [\App\Http\Controllers\CheckoutController::class, 'getSubdistricts'])->name('checkout.subdistricts');
    Route::post('/checkout/cost', [\App\Http\Controllers\CheckoutController::class, 'getShippingCost'])->name('checkout.cost');

    Route::get('/payment/{order}', [\App\Http\Controllers\PaymentController::class, 'show'])->name('payment.show');
    Route::post('/payment/{order}/simulate', [\App\Http\Controllers\PaymentController::class, 'simulate'])->name('payment.simulate');

    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/complete', [\App\Http\Controllers\OrderController::class, 'complete'])->name('orders.complete');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
