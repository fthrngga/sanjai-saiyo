import FloatingNavbar from '@/Components/Landing/FloatingNavbar';
import CategoryList from '@/Components/Landing/CategoryList';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Star, Truck, ShieldCheck } from 'lucide-react';

export default function Welcome({ auth, products, categories }) {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 antialiased selection:bg-yellow-200 selection:text-black">
            <Head title="Premium Authenticity" />

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
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-xs font-bold uppercase tracking-wider mb-6 bg-gray-50">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                New Collection 2026
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
                                SANJAI <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700 italic font-serif pr-2">SAIYO</span>
                            </h1>
                            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md leading-relaxed mb-8">
                                Taste the authentic heritage of Minangkabau in every crunch. Crafted with passion, delivered with pride.
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

                            {/* Trust Indicators */}
                            <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-400">
                                            {/* Placeholder for user avatars */}
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex text-yellow-500 text-sm">
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 mt-1">10k+ Happy Customers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-gray-100 relative order-1 md:order-2 group overflow-hidden">
                        <img
                            src="/img/hero-lifestyle.png"
                            alt="Lifestyle"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-l md:from-transparent md:to-white/10 opacity-60"></div>

                        {/* Floating Card */}
                        <div className="absolute bottom-8 left-8 right-8 md:left-auto md:right-12 md:bottom-12 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white max-w-xs transform md:translate-y-8 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-700 delay-300">
                            <p className="font-serif italic text-lg opacity-90">"The best keripik sanjai I've ever tasted. Authentic and spicy!"</p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                <span className="text-xs font-bold tracking-widest uppercase">Sarah M.</span>
                            </div>
                        </div>
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
                                <h3 className="text-xl font-bold mb-3">100% Halal Verified</h3>
                                <p className="text-gray-400 leading-relaxed">Ensure peace of mind with our certified Halal ingredients and processing.</p>
                            </div>
                            <div className="group">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300">
                                    <Star className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                                <p className="text-gray-400 leading-relaxed">Hand-picked cassavas and genuine spices for the ultimate taste.</p>
                            </div>
                            <div className="group">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300">
                                    <Truck className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
                                <p className="text-gray-400 leading-relaxed">Shipping across Indonesia with secure and safe packaging.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCT CATALOG */}
                <div id="catalog" className="bg-gray-50 pt-24 pb-32">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                            <div className="max-w-xl">
                                <span className="text-yellow-600 font-bold tracking-widest uppercase text-sm mb-2 block">Our Selection</span>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                    Curated Delicacies
                                </h2>
                            </div>
                            <a href="#" className="hidden md:inline-flex items-center gap-2 font-bold border-b-2 border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
                                View Full Menu <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
                            {products.map((product) => (
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
                                            <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
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
                            <a href="#" className="inline-flex items-center gap-2 font-bold border-b-2 border-black pb-1">
                                View Full Menu <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                            <div className="max-w-sm">
                                <h2 className="text-3xl font-black tracking-tighter mb-6">SANJAI SAIYO.</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Bringing the authentic taste of Padang to the world. Experience the tradition, feel the spice.
                                </p>
                            </div>
                            <div className="flex gap-16 text-sm text-gray-400">
                                <div className="flex flex-col gap-4">
                                    <strong className="text-white uppercase tracking-wider">Shop</strong>
                                    <a href="#" className="hover:text-white transition-colors">Best Sellers</a>
                                    <a href="#" className="hover:text-white transition-colors">New Arrivals</a>
                                    <a href="#" className="hover:text-white transition-colors">Gift Packs</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <strong className="text-white uppercase tracking-wider">Company</strong>
                                    <a href="#" className="hover:text-white transition-colors">About Us</a>
                                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                            <p>&copy; {new Date().getFullYear()} Sanjai Saiyo. All rights reserved.</p>
                            <p>Designed with passion.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
