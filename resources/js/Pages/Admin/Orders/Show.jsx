import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Package, Truck, ClipboardList, Save, ArrowLeft, CheckCircle, CreditCard, User } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function OrderShow({ auth, order }) {
    const { data: statusData, setData: setStatusData, patch, processing, errors } = useForm({
        order_status: order.order_status,
        tracking_number: order.tracking_number || '',
        cancel_reason: order.cancel_reason || '',
    });

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const handleStatusUpdate = (e) => {
        if (e) e.preventDefault();
        
        if (statusData.order_status === 'cancelled' && !isCancelModalOpen) {
            setIsCancelModalOpen(true);
            return;
        }

        patch(route('admin.orders.update', order.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setIsCancelModalOpen(false)
        });
    };

    return (
        <AdminLayout title={`Detail Pesanan #${order.id}`}>
            <div className="mb-6 flex items-center justify-between">
                <Button variant="outline" className="gap-2 bg-white border-2 border-gray-400 font-semibold hover:border-gray-600 hover:bg-gray-50 shadow-sm transition-all" asChild>
                    <Link href={route('admin.orders.index')}>
                        <ArrowLeft className="w-5 h-5 flex-shrink-0" /> <span className="pt-0.5">Kembali ke Daftar</span>
                    </Link>
                </Button>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        Dipesan pada {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm border ${
                        order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        order.order_status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        order.order_status === 'shipped' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                        order.order_status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-red-100 text-red-800 border-red-200'
                    }`}>
                        Status Server: {order.order_status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Order Details */}
                <div className="col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-gray-500" /> Item Pesanan
                            </h3>
                            <span className="text-sm font-medium text-gray-500">{order.items.length} Item</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        {item.product && item.product.gambar ? (
                                            <img src={`/storage/${item.product.gambar}`} alt={item.product_name_snapshot} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{item.product_name_snapshot}</h4>
                                        <p className="text-sm text-gray-500 mb-2">{item.variant_name_snapshot}</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-sm text-gray-600">{item.quantity} x Rp {item.price_at_purchase.toLocaleString('id-ID')}</p>
                                            <span className="font-bold text-gray-900">Rp {(item.quantity * item.price_at_purchase).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50/50 p-6 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal Produk</span>
                                <span>Rp {(order.total_price - order.shipping_cost).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ongkos Kirim ({order.shipping_courier.toUpperCase()} - {order.shipping_service})</span>
                                <span>Rp {order.shipping_cost.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total Pembayaran</span>
                                <span>Rp {order.total_price.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Address & User Info */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" /> Informasi Pengiriman
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Penerima</p>
                                <p className="font-medium text-gray-900">{order.address_snapshot.recipient_name}</p>
                                <p className="text-gray-600">{order.address_snapshot.phone_number}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Alamat Lengkap</p>
                                <p className="font-medium text-gray-900">{order.address_snapshot.full_address}</p>
                                <p className="text-gray-600">{order.address_snapshot.subdistrict_name}, {order.address_snapshot.district_name}, {order.address_snapshot.city_name}, {order.address_snapshot.province_name} {order.address_snapshot.postal_code}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="col-span-1 space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-gray-500" /> Update Status
                            </h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleStatusUpdate} className="space-y-4">
                                {errors.order_status && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md mb-2">
                                        {errors.order_status}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Pesanan</label>
                                    <select
                                        value={statusData.order_status}
                                        onChange={(e) => setStatusData('order_status', e.target.value)}
                                        disabled={order.order_status === 'completed' || order.order_status === 'cancelled'}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="pending" disabled={['processing', 'shipped', 'completed'].includes(order.order_status)}>Menunggu Pembayaran</option>
                                        <option value="processing" disabled={['shipped', 'completed'].includes(order.order_status)}>Sedang Diproses</option>
                                        <option value="shipped" disabled={['completed'].includes(order.order_status)}>Sedang Dikirim</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled" disabled={order.order_status === 'completed'}>Dibatalkan</option>
                                    </select>
                                </div>

                                {statusData.order_status === 'shipped' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Resi</label>
                                        <input
                                            type="text"
                                            value={statusData.tracking_number}
                                            onChange={(e) => setStatusData('tracking_number', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Masukkan No. Resi"
                                        />
                                        {errors.tracking_number && <p className="text-red-500 text-xs mt-1">{errors.tracking_number}</p>}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing || order.order_status === 'completed' || order.order_status === 'cancelled'}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Perubahan
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Payment Info Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-500" /> Pembayaran
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Status Pembayaran</span>
                                {order.payment_status === 'paid' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                        <CheckCircle className="w-3 h-3" />
                                        LUNAS (PAID)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                        BELUM BAYAR
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Reason Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-red-600">Alasan Pembatalan</h2>
                            <button onClick={() => setIsCancelModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-6">Tuliskan pesan kepada pelanggan mengenai mengapa pesanan ini dibatalkan.</p>

                        <div className="mb-6">
                            <textarea
                                value={statusData.cancel_reason}
                                onChange={(e) => setStatusData('cancel_reason', e.target.value)}
                                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-red-500 focus:border-red-500 transition-colors px-4 py-3 resize-none"
                                rows="4"
                                placeholder="Contoh: Stok barang saat ini habis atau alamat tujuan tidak terjangkau kurir..."
                            ></textarea>
                            {errors.cancel_reason && <p className="text-red-500 text-xs mt-1">{errors.cancel_reason}</p>}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsCancelModalOpen(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleStatusUpdate}
                                disabled={processing || !statusData.cancel_reason.trim()}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Menyimpan...' : 'Kirim & Batalkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
