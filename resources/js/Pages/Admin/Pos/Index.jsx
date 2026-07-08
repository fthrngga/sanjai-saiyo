import React, { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function PosIndex({ auth, products }) {
    const { flash } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Variant Selection Modal State
    const [variantModalOpen, setVariantModalOpen] = useState(false);
    const [selectedProductForVariant, setSelectedProductForVariant] = useState(null);

    // Extract unique categories for filtering
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category?.nama_kategori || 'Uncategorized'));
        return ['All', ...Array.from(cats)];
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase());
            const catName = product.category?.nama_kategori || 'Uncategorized';
            const matchesCategory = selectedCategory === 'All' || catName === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    const addToCart = (product, variant = null) => {
        setCart(prev => {
            const existingItemIndex = prev.findIndex(item => 
                item.id === product.id && item.variant_id === (variant ? variant.id : null)
            );

            if (existingItemIndex >= 0) {
                // Determine max stock available
                const maxStock = variant ? variant.stock : product.stok;
                if (prev[existingItemIndex].quantity < maxStock) {
                    const newCart = [...prev];
                    newCart[existingItemIndex].quantity += 1;
                    return newCart;
                }
                alert('Stok tidak mencukupi!');
                return prev;
            }

            return [...prev, {
                id: product.id,
                variant_id: variant ? variant.id : null,
                name: product.nama_produk,
                variant_name: variant ? variant.name : null,
                price: variant ? (product.harga + variant.additional_price) : product.harga,
                quantity: 1,
                image: variant?.image_path || product.gambar,
                max_stock: variant ? variant.stock : product.stok
            }];
        });
        
        if (variantModalOpen) {
            setVariantModalOpen(false);
            setSelectedProductForVariant(null);
        }
    };

    const handleProductClick = (product) => {
        if (product.variants && product.variants.length > 0) {
            setSelectedProductForVariant(product);
            setVariantModalOpen(true);
        } else {
            addToCart(product);
        }
    };

    const updateQuantity = (index, delta) => {
        setCart(prev => {
            const newCart = [...prev];
            const item = newCart[index];
            const newQuantity = item.quantity + delta;
            
            if (newQuantity > 0 && newQuantity <= item.max_stock) {
                item.quantity = newQuantity;
            }
            return newCart;
        });
    };

    const removeItem = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        setIsProcessing(true);
        router.post(route('admin.pos.store'), {
            cart: cart.map(item => ({
                id: item.id,
                variant_id: item.variant_id,
                name: item.name,
                variant_name: item.variant_name,
                quantity: item.quantity,
                price: item.price
            }))
        }, {
            onSuccess: () => {
                setCart([]);
                setIsProcessing(false);
            },
            onError: (err) => {
                setIsProcessing(false);
                if (err.error) alert(err.error);
                else alert('Terjadi kesalahan saat memproses pesanan.');
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Kasir (POS)" />

            <div className="flex h-[calc(100vh-theme(spacing.16))] bg-gray-50 overflow-hidden">
                {/* Left Side: Product Grid */}
                <div className="flex-1 flex flex-col h-full border-r border-gray-200">
                    <div className="p-4 bg-white border-b border-gray-200 z-10 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <span className="bg-amber-500 text-white p-1.5 rounded-lg">
                                    <ShoppingCart size={20} />
                                </span>
                                Point of Sale
                            </h1>
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Cari produk..." 
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                        selectedCategory === cat 
                                            ? 'bg-gray-900 text-white' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200">
                        {flash.success && (
                            <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                <CheckCircle2 className="text-green-500" />
                                <span className="font-semibold">{flash.success}</span>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map(product => (
                                <div 
                                    key={product.id} 
                                    onClick={() => handleProductClick(product)}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group flex flex-col"
                                >
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                        <img 
                                            src={product.gambar ? `/${product.gambar}` : '/placeholder.png'} 
                                            alt={product.nama_produk} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.variants && product.variants.length > 0 && (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                                {product.variants.length} Varian
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight mb-1">{product.nama_produk}</h3>
                                        <div className="mt-auto flex items-end justify-between">
                                            <span className="font-black text-amber-600">Rp {product.harga.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <ShoppingCart size={48} className="mb-4 opacity-20" />
                                <p>Tidak ada produk ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Cart */}
                <div className="w-96 bg-white flex flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Keranjang Belanja
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <p>Belum ada produk dipilih</p>
                            </div>
                        ) : (
                            cart.map((item, index) => (
                                <div key={index} className="flex gap-3 items-center group bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img src={item.image ? `/${item.image}` : '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                                        {item.variant_name && (
                                            <p className="text-xs text-gray-500 font-medium">{item.variant_name}</p>
                                        )}
                                        <p className="text-amber-600 font-bold text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                            <button 
                                                onClick={() => updateQuantity(index, -1)}
                                                className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded text-gray-600"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(index, 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-amber-50 hover:bg-amber-100 rounded text-amber-700"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200 space-y-4 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
                                <span>Total Bayar</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <Button 
                            className="w-full h-12 text-lg font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg shadow-gray-200"
                            disabled={cart.length === 0 || isProcessing}
                            onClick={handleCheckout}
                        >
                            {isProcessing ? 'Memproses...' : 'Proses Pembayaran'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Variant Selection Modal */}
            {variantModalOpen && selectedProductForVariant && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">Pilih Varian</h3>
                            <button onClick={() => setVariantModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 flex gap-4">
                            <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                <img src={`/${selectedProductForVariant.gambar}`} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{selectedProductForVariant.nama_produk}</h4>
                                <p className="text-amber-600 font-bold">Mulai Rp {selectedProductForVariant.harga.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 max-h-[60vh] overflow-y-auto space-y-2">
                            {selectedProductForVariant.variants.filter(v => v.stock > 0).map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => addToCart(selectedProductForVariant, variant)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        {variant.image_path && (
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                                                <img src={`/${variant.image_path}`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-amber-900">{variant.name}</p>
                                            <p className="text-xs text-gray-500">Sisa stok: {variant.stock}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            Rp {(selectedProductForVariant.harga + variant.additional_price).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
