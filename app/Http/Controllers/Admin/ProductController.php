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
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|max:1048576',
            'variants' => 'required|array|min:1',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.additional_price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.image' => 'nullable|image|max:1048576',
        ]);

        $totalStock = collect($request->variants)->sum('stock');

        $path = null;
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')[0]->store('products', 'public');
        }

        $product = Product::create([
            'nama_produk' => $request->nama_produk,
            'category_id' => $request->category_id,
            'harga' => $request->harga,
            'stok' => $totalStock,
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
            foreach ($request->variants as $index => $variant) {
                $variantData = [
                    'name' => $variant['name'],
                    'additional_price' => $variant['additional_price'] ?? 0,
                    'stock' => $variant['stock'] ?? 0,
                ];

                if (isset($variant['image']) && $request->hasFile("variants.$index.image")) {
                    $variantData['image_path'] = $request->file("variants.$index.image")->store('products/variants', 'public');
                }

                $product->variants()->create($variantData);
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
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|max:1048576',
            'existing_images' => 'nullable|array',
            'variants' => 'required|array|min:1',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.additional_price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.image' => 'nullable|image|max:1048576',
        ]);

        $totalStock = collect($request->variants)->sum('stock');

        $data = $request->except(['gambar', 'variants', 'existing_images']);
        $data['stok'] = $totalStock; // Update stock based on variants sum

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

        // Handle Variants. To handle images gracefully without deleting existing variant images, 
        // we'll find existing variants and update or create. For simplicity (like before), 
        // we can delete and recreate if we keep track of old images.
        // But since we are deleting recreating, we must delete old image files if they are not passed back.
        // Wait, instead of deleting all and recreating, updating is safer for images.
        $existingVariantsIds = [];
        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $index => $variantData) {
                $variantModel = null;
                if (isset($variantData['id']) && $variantData['id']) {
                    $variantModel = $product->variants()->find($variantData['id']);
                }

                $dataToSave = [
                    'name' => $variantData['name'],
                    'additional_price' => $variantData['additional_price'] ?? 0,
                    'stock' => $variantData['stock'] ?? 0,
                ];

                if ($request->hasFile("variants.$index.image")) {
                    if ($variantModel && $variantModel->image_path) {
                        Storage::disk('public')->delete($variantModel->image_path);
                    }
                    $dataToSave['image_path'] = $request->file("variants.$index.image")->store('products/variants', 'public');
                } elseif (isset($variantData['image']) && is_string($variantData['image'])) {
                    $dataToSave['image_path'] = $variantData['image'];
                }

                if ($variantModel) {
                    $variantModel->update($dataToSave);
                    $existingVariantsIds[] = $variantModel->id;
                } else {
                    $newVariant = $product->variants()->create($dataToSave);
                    $existingVariantsIds[] = $newVariant->id;
                }
            }
        }
        
        // Delete variants that are no longer present
        $variantsToDelete = $product->variants()->whereNotIn('id', $existingVariantsIds)->get();
        foreach($variantsToDelete as $v) {
            if ($v->image_path) Storage::disk('public')->delete($v->image_path);
            $v->delete();
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
