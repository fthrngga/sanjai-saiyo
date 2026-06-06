<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function index()
    {
        $vouchers = Voucher::latest()->paginate(10);
        return Inertia::render('Admin/Voucher/Index', [
            'vouchers' => $vouchers
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Voucher/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code',
            'name' => 'required|string|max:255',
            'type' => 'required|in:shipping,product',
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|integer|min:1',
            'max_discount' => 'nullable|integer|min:0',
            'min_spend' => 'required|integer|min:0',
            'quota' => 'required|integer|min:-1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'required|boolean',
        ]);

        Voucher::create($validated);

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher berhasil dibuat.');
    }

    public function edit(Voucher $voucher)
    {
        return Inertia::render('Admin/Voucher/Edit', [
            'voucher' => $voucher
        ]);
    }

    public function update(Request $request, Voucher $voucher)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code,' . $voucher->id,
            'name' => 'required|string|max:255',
            'type' => 'required|in:shipping,product',
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|integer|min:1',
            'max_discount' => 'nullable|integer|min:0',
            'min_spend' => 'required|integer|min:0',
            'quota' => 'required|integer|min:-1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'required|boolean',
        ]);

        $voucher->update($validated);

        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher berhasil diperbarui.');
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return redirect()->route('admin.vouchers.index')->with('success', 'Voucher berhasil dihapus.');
    }
}
