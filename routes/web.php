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

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/search', function () {
    $query = request('query');
    
    $products = \App\Models\Product::with('category')
        ->where('nama_produk', 'like', "%{$query}%")
        ->orWhereHas('category', function ($q) use ($query) {
            $q->where('nama_kategori', 'like', "%{$query}%");
        })
        ->get();

    return Inertia::render('Search', [
        'results' => $products,
        'query' => $query,
    ]);
})->name('search.index');

Route::get('/catalog', function () {
    $query    = request('query', '');
    $category = request('category', '');
    $sort     = request('sort', 'latest');

    $products = \App\Models\Product::with('category')
        ->when($query, fn($q) => $q->where('nama_produk', 'like', "%{$query}%"))
        ->when($category, fn($q) => $q->whereHas('category', fn($c) => $c->where('slug', $category)->orWhere('id', $category)))
        ->when($sort === 'price_asc',  fn($q) => $q->orderBy('harga', 'asc'))
        ->when($sort === 'price_desc', fn($q) => $q->orderBy('harga', 'desc'))
        ->when($sort === 'latest' || !$sort, fn($q) => $q->latest())
        ->paginate(12)
        ->withQueryString();

    return Inertia::render('Catalog', [
        'products'   => $products,
        'categories' => \App\Models\Category::all(),
        'filters'    => ['query' => $query, 'category' => $category, 'sort' => $sort],
    ]);
})->name('catalog.index');

Route::get('/products/{product}', function (Product $product) {
    return Inertia::render('Product/Detail', [
        'product' => $product->load(['category', 'variants', 'images', 'reviews.user']),
        'related_products' => Product::where('category_id', $product->category_id)
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
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('admin/products', \App\Http\Controllers\Admin\ProductController::class)->names('admin.products');
    Route::resource('admin/vouchers', \App\Http\Controllers\Admin\VoucherController::class)->names('admin.vouchers');
    Route::resource('admin/orders', \App\Http\Controllers\Admin\OrderController::class)->names('admin.orders');
    Route::patch('admin/orders/{order}/verify-payment', [\App\Http\Controllers\Admin\OrderController::class, 'verifyPayment'])->name('admin.orders.verifyPayment');
    Route::get('admin/sales', [\App\Http\Controllers\Admin\SaleController::class, 'index'])->name('admin.sales.index');
    Route::get('admin/reviews', [\App\Http\Controllers\Admin\ReviewController::class, 'index'])->name('admin.reviews.index');
    Route::post('admin/reviews/bulk-destroy', [\App\Http\Controllers\Admin\ReviewController::class, 'bulkDestroy'])->name('admin.reviews.bulkDestroy');
    Route::delete('admin/reviews/{review}', [\App\Http\Controllers\Admin\ReviewController::class, 'destroy'])->name('admin.reviews.destroy');
    
    Route::get('admin/pos', [\App\Http\Controllers\Admin\PosController::class, 'index'])->name('admin.pos.index');
    Route::post('admin/pos/checkout', [\App\Http\Controllers\Admin\PosController::class, 'store'])->name('admin.pos.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/vouchers', [\App\Http\Controllers\VoucherController::class, 'index'])->name('vouchers.index');
    Route::post('/vouchers/{voucher}/claim', [\App\Http\Controllers\VoucherController::class, 'claim'])->name('vouchers.claim');

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
    Route::post('/payment/{order}/upload-proof', [\App\Http\Controllers\PaymentController::class, 'uploadProof'])->name('payment.uploadProof');

    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/complete', [\App\Http\Controllers\OrderController::class, 'complete'])->name('orders.complete');

    Route::post('/notifications/mark-read', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.markRead');

    Route::post('/reviews', [\App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // User Addresses Routes
    Route::post('/user/addresses', [\App\Http\Controllers\UserAddressController::class, 'store'])->name('user.addresses.store');
    Route::put('/user/addresses/{id}', [\App\Http\Controllers\UserAddressController::class, 'update'])->name('user.addresses.update');
    Route::delete('/user/addresses/{id}', [\App\Http\Controllers\UserAddressController::class, 'destroy'])->name('user.addresses.destroy');
    Route::put('/user/addresses/{id}/primary', [\App\Http\Controllers\UserAddressController::class, 'setPrimary'])->name('user.addresses.setPrimary');
});

require __DIR__ . '/auth.php';
