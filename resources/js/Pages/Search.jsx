import Navbar from '@/Components/Landing/Navbar';
import ProductCard from '@/Components/Landing/ProductCard';
import { Head, Link } from '@inertiajs/react';

export default function Search({ results, query }) {
    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 antialiased">
            <Head title={`Pencarian: ${query}`} />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Hasil Pencarian
                    </h1>
                    <p className="text-gray-500">
                        Menampilkan hasil untuk potential match dengan <span className="font-semibold text-black">"{query}"</span>
                    </p>
                </div>

                {results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Tidak ada produk ditemukan</h3>
                        <p className="text-gray-500 mt-1">Coba kata kunci lain atau cek ejaan anda.</p>
                        <Link href="/" className="mt-6 inline-block px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                            Kembali ke Beranda
                        </Link>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Sanjai Saiyo. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
