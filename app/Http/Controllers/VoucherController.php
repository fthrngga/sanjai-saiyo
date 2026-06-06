<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function index()
    {
        $now = now();
        $vouchers = Voucher::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', $now);
            })
            ->where('code', 'not like', 'REWARD%')
            ->get();

        $claimedVoucherIds = [];
        if (auth()->check()) {
            $claimedVoucherIds = auth()->user()->claimedVouchers()->pluck('vouchers.id')->toArray();
        }

        return Inertia::render('Voucher/VoucherCenter', [
            'vouchers' => $vouchers,
            'claimedVoucherIds' => $claimedVoucherIds
        ]);
    }

    public function claim(Request $request, Voucher $voucher)
    {
        $user = auth()->user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Cek jika sudah pernah diklaim
        $alreadyClaimed = $user->claimedVouchers()->where('voucher_id', $voucher->id)->exists();
        if ($alreadyClaimed) {
            return back()->withErrors(['message' => 'Anda sudah mengklaim voucher ini.']);
        }

        // Cek keaktifan dan tanggal
        $now = now();
        if (!$voucher->is_active || 
            ($voucher->start_date && $voucher->start_date > $now) || 
            ($voucher->end_date && $voucher->end_date < $now)) {
            return back()->withErrors(['message' => 'Voucher sudah kedaluwarsa atau tidak aktif.']);
        }

        // Cek kuota
        if ($voucher->quota !== -1 && $voucher->quota <= 0) {
            return back()->withErrors(['message' => 'Kuota voucher telah habis.']);
        }

        // Jalankan transaksi/proses klaim
        \DB::transaction(function () use ($user, $voucher) {
            $user->claimedVouchers()->attach($voucher->id, [
                'claimed_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            if ($voucher->quota > 0) {
                $voucher->decrement('quota');
            }
        });

        return back()->with('success', 'Voucher berhasil diklaim! Silakan gunakan saat checkout.');
    }
}
