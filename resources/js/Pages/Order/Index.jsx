import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Package, Truck, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OrderIndex({ orders }) {
    // orders is now a Laravel paginator object: { data, current_page, last_page, links, ... }
    const orderList = orders.data ?? orders;
    const [reviewData, setReviewData] = React.useState(null);

    const goToPage = (url) => {
        if (url) router.get(url, {}, { preserveScroll: false });
    };

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

                {orderList.length === 0 ? (
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
                        {orderList.map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-200">
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                                            {order.items.map((item) => {
                                                const hasReviewed = order.reviews && order.reviews.some(r => r.product_id === item.product_id);
                                                return (
                                                    <div key={item.id} className="flex gap-4">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            {item.product && item.product.gambar ? (
                                                                <img src={`/storage/${item.product.gambar}`} alt={item.product_name_snapshot || "Product"} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center border">No Img</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900">{item.product_name_snapshot || (item.product && item.product.nama_produk)}</h4>
                                                            <p className="text-sm text-gray-500">{item.quantity} x Rp {(item.price_at_purchase || 0).toLocaleString('id-ID')}</p>
                                                        </div>
                                                        {order.order_status === 'completed' && item.product && (
                                                            <div className="flex items-center">
                                                                {hasReviewed ? (
                                                                    <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                                                        <CheckCircle className="w-3 h-3" /> Diulas
                                                                    </span>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => setReviewData({ order_id: order.id, product_id: item.product_id, product_name: item.product_name_snapshot || item.product.nama_produk })}
                                                                        className="text-yellow-600 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                                    >
                                                                        Beri Ulasan
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
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
                                            {order.order_status === 'cancelled' && order.cancel_reason && (
                                                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                                                    <h6 className="text-xs font-bold text-red-800 mb-1 uppercase tracking-wider">Alasan Pembatalan:</h6>
                                                    <p className="text-sm text-red-700">{order.cancel_reason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        {/* Prev button */}
                        <button
                            onClick={() => goToPage(orders.prev_page_url)}
                            disabled={!orders.prev_page_url}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Sebelumnya
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {orders.links
                                .filter(link => !link.label.includes('Previous') && !link.label.includes('Next'))
                                .map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToPage(link.url)}
                                        disabled={!link.url}
                                        className={[
                                            'w-10 h-10 rounded-xl text-sm font-bold transition-all',
                                            link.active
                                                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                                : 'border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200',
                                        ].join(' ')}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))
                            }
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => goToPage(orders.next_page_url)}
                            disabled={!orders.next_page_url}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Selanjutnya <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </main>

            <ReviewModal 
                isOpen={!!reviewData} 
                onClose={() => setReviewData(null)} 
                data={reviewData} 
            />
        </div>
    );
}

function ReviewModal({ isOpen, onClose, data }) {
    const form = useForm({
        rating: 5,
        comment: '',
        order_id: '',
        product_id: '',
    });

    React.useEffect(() => {
        if (data) {
            form.setData({
                rating: 5,
                comment: '',
                order_id: data.order_id,
                product_id: data.product_id,
            });
        }
    }, [data]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        form.post(route('reviews.store'), {
            onSuccess: () => {
                form.reset();
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Nilai Produk</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-6">Bagaimana kualitas dari <strong className="text-black">{data?.product_name}</strong>?</p>

                <form onSubmit={submit}>
                    <div className="mb-6 flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => form.setData('rating', star)}
                                className="group p-1"
                            >
                                <svg 
                                    className={`w-10 h-10 transition-colors ${form.data.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current group-hover:text-yellow-200'}`} 
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                >
                                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                                </svg>
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Tuliskan pengalaman Anda</label>
                        <textarea
                            value={form.data.comment}
                            onChange={e => form.setData('comment', e.target.value)}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-black focus:border-black transition-colors px-4 py-3 resize-none"
                            rows="4"
                            placeholder="Rasa keripiknya enak, renyah, dan pengiriman super cepat..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {form.processing ? 'Menyimpan...' : 'Kirim Ulasan'}
                    </button>
                </form>
            </div>
        </div>
    );
}
