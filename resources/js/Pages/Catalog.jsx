import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { Head, Link, router } from '@inertiajs/react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowUpDown } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function Catalog({ products, categories, filters }) {
    const [localQuery, setLocalQuery] = useState(filters.query || '');
    const [showFilters, setShowFilters] = useState(false);

    const applyFilter = useCallback((overrides = {}) => {
        const params = {
            query: overrides.query !== undefined ? overrides.query : (filters.query || ''),
            category: overrides.category !== undefined ? overrides.category : (filters.category || ''),
            sort: overrides.sort !== undefined ? overrides.sort : (filters.sort || 'latest'),
        };
        // Remove empty values
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
        router.get('/catalog', params, { preserveScroll: false });
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter({ query: localQuery });
    };

    const handleCategoryClick = (catId) => {
        const newCat = filters.category == catId ? '' : catId;
        applyFilter({ category: newCat });
    };

    const goToPage = (url) => {
        if (url) router.get(url, {}, { preserveScroll: false });
    };

    const sortOptions = [
        { value: 'latest', label: 'Terbaru' },
        { value: 'price_asc', label: 'Harga: Rendah → Tinggi' },
        { value: 'price_desc', label: 'Harga: Tinggi → Rendah' },
    ];

    const activeSort = sortOptions.find(s => s.value === filters.sort) || sortOptions[0];

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 antialiased">
            <Head title="Katalog Produk - Sanjai Saiyo" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ── Page Header ── */}
                <div className="mb-8">
                    <span className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-1 block">
                        Semua Produk
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Katalog Produk
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {products.total} produk ditemukan
                        </p>
                    </div>
                </div>

                {/* ── Product Grid ── */}
                {products.data.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
                        {products.data.map((product) => (
                            <Link
                                key={product.id}
                                href={route('products.show', product.id)}
                                className="group block"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 shadow-sm group-hover:shadow-md transition-all rounded-lg">
                                    {product.gambar ? (
                                        <img
                                            src={`/storage/${product.gambar}`}
                                            alt={product.nama_produk}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                                            Tidak Ada Gambar
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider text-black rounded-sm">
                                                {product.category.nama_kategori}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {product.nama_produk}
                                </h3>
                                <p className="text-gray-600 font-semibold text-sm">
                                    Rp {Number(product.harga).toLocaleString('id-ID')}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Produk tidak ditemukan</h3>
                        <p className="text-gray-500 mb-6">Coba kata kunci atau filter yang berbeda.</p>
                        <button
                            onClick={() => { setLocalQuery(''); applyFilter({ query: '', category: '' }); }}
                            className="px-6 py-2.5 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                        >
                            Tampilkan Semua Produk
                        </button>
                    </div>
                )}

                {/* ── Pagination ── */}
                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => goToPage(products.prev_page_url)}
                            disabled={!products.prev_page_url}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Sebelumnya
                        </button>

                        <div className="flex items-center gap-1">
                            {products.links
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
                                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700',
                                        ].join(' ')}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))
                            }
                        </div>

                        <button
                            onClick={() => goToPage(products.next_page_url)}
                            disabled={!products.next_page_url}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Selanjutnya <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </main>

            <Footer categories={categories} />
        </div>
    );
}
