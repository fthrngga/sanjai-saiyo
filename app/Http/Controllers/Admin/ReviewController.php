<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        // Get all reviews with user and product relationship
        $reviews = Review::with(['user:id,name', 'product:id,nama_produk'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }
}
