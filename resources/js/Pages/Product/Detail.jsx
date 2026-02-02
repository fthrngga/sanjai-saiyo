import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Minus, Plus, Heart, Share2, ShoppingCart, MessageSquare, Check, Truck } from 'lucide-react';

export default function Detail({ product, related_products }) {
    const [quantity, setQuantity] = useState(1);


    const [selectedVariant, setSelectedVariant] = useState(0);
    const [note, setNote] = useState('');

    // Use real variants from DB or fallback
    const variants = product.variants && product.variants.length > 0
        ? product.variants
        : [{ id: 'default', name: 'Original', additional_price: 0, stock: product.stok }];

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= (product.stok || 999)) {
            setQuantity(newQty);
        }
    };

    const currentPrice = product.harga + (variants[selectedVariant]?.additional_price || 0);
    const subtotal = currentPrice * quantity;

    const { auth } = usePage().props;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleAddToCart = () => {
        if (!auth.user) {
            setShowLoginModal(true);
            return;
        }

        const variant = variants[selectedVariant];

        router.post(route('cart.store'), {
            product_id: product.id,
            product_variant_id: variant.id === 'default' ? null : variant.id,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <Head title={`${product.nama_produk} - Sanjai Saiyo`} />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-8 space-x-2">
                    <Link href="/" className="hover:text-black">Beranda</Link>
                    <span>/</span>
                    <Link href={`/search?query=${product.category?.nama_kategori || ''}`} className="hover:text-black">
                        {product.category?.nama_kategori || 'Kategori'}
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-black truncate max-w-[200px]">{product.nama_produk}</span>
                </nav>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Images (4 cols) */}
                    <div className="lg:col-span-4 mb-8 lg:mb-0">
                        <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm sticky top-24">
                            {product.gambar ? (
                                <img
                                    src={`/storage/${product.gambar}`}
                                    alt={product.nama_produk}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                    <span className="text-lg">No Image</span>
                                </div>
                            )}
                        </div>
                        {/* Thumbnail Grid (Mock) */}
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-square bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-black transition-colors overflow-hidden">
                                    {product.gambar && <img src={`/storage/${product.gambar}`} className="w-full h-full object-cover opacity-70 hover:opacity-100" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Middle Column: Product Info (5 cols) */}
                    <div className="lg:col-span-12 xl:col-span-5 lg:w-full space-y-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-2">
                                {product.nama_produk}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center text-yellow-500">
                                    ★ {product.rating_average || '0.0'} <span className="text-gray-400 ml-1">({product.reviews?.length || 0} Ulasan)</span>
                                </div>
                                <span>•</span>
                                <span>Terjual {product.total_sold || 0}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-black">
                                Rp {(product.harga + (variants[selectedVariant]?.additional_price || 0)).toLocaleString('id-ID')}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-900">Pilih Varian</label>
                            <div className="flex flex-wrap gap-3">
                                {variants.map((v, idx) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(idx)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedVariant === idx
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="prose prose-sm text-gray-600 border-t border-gray-100 pt-6">
                            <h3 className="text-gray-900 font-semibold mb-2">Deskripsi</h3>
                            <p className="whitespace-pre-line">{product.deskripsi}</p>
                            <p className="mt-4 text-xs text-gray-400">
                                *Berat bersih 250gr per kemasan. Tahan hingga 1 bulan dalam wadah tertutup.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Action Card (3 cols) */}
                    <div className="lg:col-span-12 xl:col-span-3 lg:mt-0 mt-8">
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100 p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Atur Jumlah & Catatan</h3>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                    {product.gambar && <img src={`/storage/${product.gambar}`} className="w-full h-full object-cover" />}
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p className="font-medium text-gray-900 truncate max-w-[150px]">{variants[selectedVariant]?.name || 'Original'}</p>
                                    <p>Stok: {variants[selectedVariant]?.stock || product.stok}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1.5 mb-2">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-medium w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stok}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Tulis catatan... (opsional)"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full border-none bg-transparent text-sm focus:ring-0 p-0 placeholder-gray-400"
                                />
                                <div className="h-px bg-gray-200 mt-1"></div>
                            </div>

                            <div className="flex items-center justify-between text-sm mb-6">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold text-lg">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Keranjang
                                </button>
                                <button className="w-full py-3 px-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors shadow-lg">
                                    Beli Langsung
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100 text-gray-400">
                                <button className="flex items-center gap-1.5 hover:text-red-500 text-sm font-medium transition-colors">
                                    <Heart className="w-4 h-4" /> Wishlist
                                </button>
                                <button className="flex items-center gap-1.5 hover:text-blue-500 text-sm font-medium transition-colors">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related_products.length > 0 && (
                    <div className="mt-20 border-t border-gray-100 pt-10">
                        <h2 className="text-2xl font-bold mb-6">Mungkin Kamu Suka</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {related_products.map(p => (
                                <Link key={p.id} href={route('products.show', p.id)} className="group block">
                                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                                        {p.gambar && <img src={`/storage/${p.gambar}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-black">{p.nama_produk}</h3>
                                    <p className="text-gray-500 text-sm">Rp {p.harga.toLocaleString('id-ID')}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-200 mt-20 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">&copy; 2024 Sanjai Saiyo. Premium Authentic Padang Chips.</p>
                </div>
            </footer>
            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-8 h-8 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Masuk untuk Belanja</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Anda perlu masuk ke akun terlebih dahulu untuk menambahkan produk ke keranjang.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href={route('login')}
                                className="block w-full py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Masuk Sekarang
                            </Link>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="block w-full py-2.5 text-gray-500 font-semibold hover:text-black transition-colors"
                            >
                                Nanti Saja
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-24 right-4 md:right-8 z-[100] animate-in slide-in-from-right duration-300">
                    <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-xl p-4 flex items-start gap-3 max-w-sm">
                        <div className="bg-green-50 p-2 rounded-full shrink-0">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Berhasil Ditambahkan!</h4>
                            <p className="text-gray-500 text-xs mt-1">
                                {product.nama_produk} ({variants[selectedVariant]?.name || 'Original'}) x {quantity}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
