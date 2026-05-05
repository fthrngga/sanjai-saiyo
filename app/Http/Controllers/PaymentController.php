<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function show(Order $order, \App\Services\QrisService $qrisService)
    {
        // Ensure user owns the order
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Mengambil string QRIS statis dari konfigurasi .env
        // Jika belum diset di .env, gunakan string dummy sebagai fallback sementara
        $staticQris = config('services.qris.static_string') 
            ?: '00020101021126660014ID.CO.QRIS.WWW01189360091530263625340214841961622359680303UMI51440014ID.CO.QRIS.WWW0215ID10231649195000303UMI5204541153033605802ID5919Toko Sanjai Saiyo6009Bukittinggi6105261156214071012345678906304F2E2';
        
        $dynamicQris = $qrisService->generateDynamicQris($staticQris, $order->grand_total);

        return Inertia::render('Payment/Index', [
            'order' => $order->load('items'),
            'dynamic_qris' => $dynamicQris,
        ]);
    }

    public function uploadProof(Request $request, Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'bukti_pembayaran' => 'required|file|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('bukti_pembayaran')) {
            $path = $request->file('bukti_pembayaran')->store('receipts', 'public');
            
            $order->update([
                'bukti_pembayaran' => 'storage/' . $path,
                'status_pembayaran' => 'pending_verification'
            ]);
        }

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.');
    }
}
