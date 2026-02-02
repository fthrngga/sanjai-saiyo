import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function CartIndex({ cartItems }) {
    // Calculate total for SELECTED items only
    const selectedItems = cartItems.filter(item => item.is_selected);
    const total = selectedItems.reduce((sum, item) => {
        const price = item.product.harga + (item.variant ? item.variant.additional_price : 0);
        return sum + (price * item.quantity);
    }, 0);

    const toggleSelection = (item) => {
        router.patch(route('cart.update', item.id), {
            is_selected: !item.is_selected
        }, { preserveScroll: true });
    };

    const updateQuantity = (item, newQty) => {
        if (newQty < 1) return;
        router.patch(route('cart.update', item.id), { quantity: newQty }, { preserveScroll: true });
    };

    const removeItem = (item) => {
        if (confirm('Hapus item ini dari keranjang?')) {
            router.delete(route('cart.destroy', item.id), { preserveScroll: true });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <Head title="Keranjang Belanja - Sanjai Saiyo" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

                {cartItems.length > 0 ? (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {cartItems.map((item) => {
                                const price = item.product.harga + (item.variant ? item.variant.additional_price : 0);
                                return (
                                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 md:gap-6 items-center">
                                        <div className="shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={!!item.is_selected}
                                                onChange={() => toggleSelection(item)}
                                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all"
                                            />
                                        </div>
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                            {item.product.gambar ? (
                                                <img
                                                    src={`/storage/${item.product.gambar}`}
                                                    alt={item.product.nama_produk}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 truncate pr-4">
                                                        <Link href={route('products.show', item.product.id)} className="hover:underline">
                                                            {item.product.nama_produk}
                                                        </Link>
                                                    </h3>
                                                    {item.variant && (
                                                        <p className="text-sm text-gray-500">Varian: {item.variant.name}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-2">
                                                <p className="font-bold text-lg">Rp {price.toLocaleString('id-ID')}</p>

                                                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-black hover:bg-gray-100 disabled:opacity-50"
                                                        disabled={item.variant ? item.quantity >= item.variant.stock : item.quantity >= item.product.stok}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-lg font-bold mb-4">Ringkasan Pesanan</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total Item ({selectedItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                                        <span>Rp {total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Diskon</span>
                                        <span>Rp 0</span>
                                    </div>
                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <div className="flex justify-between font-bold text-lg text-black">
                                        <span>Total Harga</span>
                                        <span>Rp {total.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                {selectedItems.length > 0 ? (
                                    <Link
                                        href={route('checkout.index')}
                                        className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Lanjut ke Checkout
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-3 bg-gray-200 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        Pilih Barang Dulu
                                    </button>
                                )}
                                <p className="text-xs text-gray-400 mt-4 text-center">
                                    Ongkir akan dihitung di halaman checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowRight className="w-8 h-8 text-gray-300 transform rotate-180" /> {/* Just an icon */}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Anda Kosong</h2>
                        <p className="text-gray-500 mb-6">Yuk isi dengan cemilan favoritmu!</p>
                        <Link href="/" className="inline-block px-6 py-2.5 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors">
                            Mulai Belanja
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
