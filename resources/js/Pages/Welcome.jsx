import FloatingNavbar from '@/Components/Landing/FloatingNavbar';
import CategoryList from '@/Components/Landing/CategoryList';
import Footer from '@/Components/Landing/Footer';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Star, Truck, ShieldCheck } from 'lucide-react';

export default function Welcome({ auth, products, categories }) {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 antialiased selection:bg-yellow-200 selection:text-black">
            <Head title="Cita Rasa Asli Premium" />

            <FloatingNavbar />

            <main>
                {/* HERO SECTION */}
                <section className="relative w-full h-screen min-h-[700px] flex flex-col md:flex-row overflow-hidden">
                    {/* Left Column - Text & Brand */}
                    <div className="w-full md:w-1/2 h-full bg-white flex flex-col justify-center px-8 md:px-24 xl:px-32 relative z-10 order-2 md:order-1 pt-24 md:pt-0">
                        {/* Background typography decoration */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 opacity-[0.03] select-none pointer-events-none">
                            <span className="text-[400px] font-black leading-none">SS</span>
                        </div>

                        <div className="relative">

                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
                                SANJAI <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700 italic font-serif pr-2">SAIYO</span>
                            </h1>
                            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md leading-relaxed mb-8">
                                Rasakan sentuhan bumbu rempah Minangkabau di setiap gigitannya. Dibuat dengan sepenuh hati, Hadirkan kemewahan cita rasa di setiap momen istimewa Anda.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="#catalog"
                                    className="group flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl"
                                >
                                    Belanja Sekarang
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border border-gray-200 hover:border-black hover:bg-gray-50 transition-all"
                                >
                                    Tentang Kami
                                </Link>
                            </div>

                        </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-gray-100 relative order-1 md:order-2 group overflow-hidden">
                        <img
                            src="/img/hero_sanjai_hd.png"
                            alt="Lifestyle"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-l md:from-transparent md:to-white/10 opacity-60"></div>
                    </div>
                </section>

                {/* MARQUEE CATEGORIES */}
                <CategoryList categories={categories} />

                {/* FEATURED BENEFITS */}
                <section className="py-24 bg-black text-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                            <div className="group">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Tersertifikasi 100% Halal</h3>
                                <p className="text-gray-400 leading-relaxed">Nikmati tanpa ragu dengan bahan dan proses pengolahan yang telah diverifikasi halal.</p>
                            </div>
                            <div className="group">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300">
                                    <Star className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Kualitas Premium</h3>
                                <p className="text-gray-400 leading-relaxed">Singkong pilihan dan rempah-rempah asli untuk menghasilkan cita rasa terbaik.</p>
                            </div>
                            <div className="group">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300">
                                    <Truck className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Pengiriman Cepat</h3>
                                <p className="text-gray-400 leading-relaxed">Melayani pengiriman ke seluruh Indonesia dengan pengemasan yang aman dan terpercaya.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCT CATALOG */}
                <div id="catalog" className="bg-gray-50 pt-24 pb-32">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                            <div className="max-w-xl">
                                <span className="text-yellow-600 font-bold tracking-widest uppercase text-sm mb-2 block">Pilih Rasa Favoritmu</span>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                    Menu Terlaris
                                </h2>
                            </div>
                            <Link href={route('catalog.index')} className="hidden md:inline-flex items-center gap-2 font-bold border-b-2 border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                            Lihat Semua Menu <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
                            {/* Tampil 4 produk terlaris di beranda, lengkapnya di /catalog */}
                            {products.slice(0, 4).map((product) => (
                                <Link
                                    key={product.id}
                                    href={route('products.show', product.id)}
                                    className="group block"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6 shadow-sm group-hover:shadow-md transition-all">
                                        {/* Image */}
                                        {product.gambar ? (
                                            <img
                                                src={`/storage/${product.gambar}`}
                                                alt={product.nama_produk}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">Tidak Ada Gambar</div>
                                        )}
                                        {/* Floating Tag */}
                                        <div className="absolute top-4 left-4">
                                            {product.category && (
                                                <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1 uppercase tracking-wider text-black">
                                                    {product.category.nama_kategori}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:underline decoration-2 underline-offset-4 decoration-yellow-500">
                                            {product.nama_produk}
                                        </h3>
                                        <p className="text-gray-500 font-medium">
                                            Rp {Number(product.harga).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 text-center md:hidden">
                            <Link href={route('catalog.index')} className="inline-flex items-center gap-2 font-bold border-b-2 border-black pb-1 hover:text-yellow-600 transition-colors">
                                Lihat Semua Menu <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer categories={categories} />
            </main>
        </div>
    );
}