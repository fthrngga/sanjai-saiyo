<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images'])->latest()->paginate(10);
        return Inertia::render('Admin/Product/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Product/Create', [
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|max:2048',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.additional_price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
        ]);

        $path = null;
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')[0]->store('products', 'public');
        }

        $product = Product::create([
            'nama_produk' => $request->nama_produk,
            'category_id' => $request->category_id,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'deskripsi' => $request->deskripsi,
            'gambar' => $path,
        ]);

        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $index => $file) {
                $imagePath = $file->store('products', 'public');
                $product->images()->create([
                    'image_path' => $imagePath,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $variant) {
                $product->variants()->create([
                    'name' => $variant['name'],
                    'additional_price' => $variant['additional_price'] ?? 0,
                    'stock' => $variant['stock'] ?? 0,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load(['images', 'variants']);
        return Inertia::render('Admin/Product/Edit', [
            'product' => $product,
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|max:2048',
            'existing_images' => 'nullable|array',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.additional_price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
        ]);

        $data = $request->except(['gambar', 'variants', 'existing_images']);

        if ($request->hasFile('gambar') && count($request->file('gambar')) > 0) {
            $data['gambar'] = $request->file('gambar')[0]->store('products', 'public');
        } elseif ($request->has('existing_images') && count($request->existing_images) > 0) {
            $data['gambar'] = $request->existing_images[0]['image_path'];
        }

        $product->update($data);

        // Handle Images
        $existingImageIds = $request->has('existing_images') ? collect($request->existing_images)->pluck('id')->filter()->toArray() : [];
        
        // delete images not in existing_images
        $imagesToDelete = $product->images()->whereNotIn('id', $existingImageIds)->get();
        foreach($imagesToDelete as $img) {
            Storage::disk('public')->delete($img->image_path);
            $img->delete();
        }

        // Add new images
        if ($request->hasFile('gambar')) {
            $currentMaxOrder = $product->images()->max('sort_order') ?? -1;
            foreach ($request->file('gambar') as $index => $file) {
                $imagePath = $file->store('products', 'public');
                $product->images()->create([
                    'image_path' => $imagePath,
                    'is_primary' => false, // First item is handled by main 'gambar' logic mostly, but we can refine if needed
                    'sort_order' => $currentMaxOrder + 1 + $index,
                ]);
            }
            
            // Re-evaluate primary
            $firstImage = $product->images()->orderBy('sort_order')->first();
            if($firstImage) {
                $product->images()->update(['is_primary' => false]);
                $firstImage->update(['is_primary' => true]);
                $product->update(['gambar' => $firstImage->image_path]);
            } else {
                $product->update(['gambar' => null]);
            }
        }

        // Handle Variants
        $product->variants()->delete(); // simple replace strategy
        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $variant) {
                $product->variants()->create([
                    'name' => $variant['name'],
                    'additional_price' => $variant['additional_price'] ?? 0,
                    'stock' => $variant['stock'] ?? 0,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        foreach($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
        }
        if ($product->gambar) {
            Storage::disk('public')->delete($product->gambar);
        }
        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
