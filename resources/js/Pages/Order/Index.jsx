import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Package, Truck, Clock, CheckCircle } from 'lucide-react';

export default function OrderIndex({ orders }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Menunggu Pembayaran';
            case 'processing': return 'Diproses'; // Or 'Dibayar'
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">
            <Head title="Pesanan Saya" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Pesanan Saya
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada pesanan</h3>
                        <p className="text-gray-500 mb-6">Yuk mulai belanja sekarang!</p>
                        <Link href="/" className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                            Belanja Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-200">
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <div>
                                            <span className="block text-xs uppercase font-bold tracking-wider">Order ID</span>
                                            <span className="font-medium text-gray-900">#{order.id}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase font-bold tracking-wider">Tanggal</span>
                                            <span className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase font-bold tracking-wider">Total</span>
                                            <span className="font-medium text-gray-900">Rp {order.total_price.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    {(order.payment_status === 'pending' || order.order_status === 'pending') && (
                                        <Link href={route('payment.show', order.id)} className="px-4 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 shadow-sm transition-colors">
                                            Bayar Sekarang
                                        </Link>
                                    )}
                                    {order.order_status === 'shipped' && (
                                        <Link
                                            href={route('orders.complete', order.id)}
                                            method="post"
                                            as="button"
                                            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                                        >
                                            Pesanan Diterima
                                        </Link>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.order_status)}`}>
                                        {getStatusText(order.order_status)}
                                    </span>
                                </div>


                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.product.gambar ? (
                                                            <img src={`/storage/${item.product.gambar}`} alt={item.product.nama_produk} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{item.product_name_snapshot || item.product.nama_produk}</h4>
                                                        <p className="text-sm text-gray-500">{item.quantity} x Rp {(item.price_at_purchase || 0).toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 text-sm">
                                            <h5 className="font-bold text-gray-900 mb-2">Detail Pengiriman</h5>
                                            <p className="text-gray-600 mb-1">{order.address_snapshot.recipient_name}</p>
                                            <p className="text-gray-500 mb-2">{order.address_snapshot.full_address}</p>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Truck className="w-4 h-4" />
                                                <span className="uppercase">{order.shipping_courier} - {order.shipping_service}</span>
                                            </div>
                                            {order.tracking_number && (
                                                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                                                    Resi: {order.tracking_number}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }
            </main >
        </div >
    );
}
