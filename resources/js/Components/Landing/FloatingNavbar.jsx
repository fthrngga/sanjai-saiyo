import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingNavbar() {
    const { auth, cart_count } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[90%] max-w-4xl ${scrolled ? 'top-4 scale-95' : ''}`}>
                <nav className={`
                    backdrop-blur-md border border-white/20 shadow-2xl rounded-full px-6 py-3
                    flex items-center justify-between transition-colors duration-500
                    ${scrolled ? 'bg-black/80 text-white' : 'bg-white/90 text-black'}
                `}>
                    {/* Logo */}
                    <Link href="/" className="font-black text-xl tracking-tighter shrink-0 mr-4">
                        SANJAI<span className={scrolled ? 'text-yellow-400' : 'text-yellow-600'}>.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                        <Link href="/" className="hover:opacity-70 transition-opacity">Beranda</Link>
                        <Link href="#catalog" className="hover:opacity-70 transition-opacity">Katalog</Link>
                        <Link href="/about" className="hover:opacity-70 transition-opacity">Tentang</Link>
                        <Link href="/contact" className="hover:opacity-70 transition-opacity">Kontak</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon */}
                        <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Cart */}
                        <Link href={route('cart.index')} className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group">
                            <ShoppingCart className="w-5 h-5" />
                            {cart_count > 0 && (
                                <span className="absolute top-1 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {cart_count}
                                </span>
                            )}
                        </Link>

                        {/* Auth Button */}
                        <div className="hidden md:block pl-2 border-l border-gray-300/30">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                                        ${scrolled
                                            ? 'bg-white text-black hover:bg-gray-200'
                                            : 'bg-black text-white hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                                        ${scrolled
                                            ? 'bg-white text-black hover:bg-gray-200'
                                            : 'bg-black text-white hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    Masuk
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-1"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex items-center justify-center md:hidden">
                    <div className="flex flex-col items-center gap-8 text-white text-2xl font-bold">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>Beranda</Link>
                        <Link href="#catalog" onClick={() => setMobileMenuOpen(false)}>Katalog</Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)}>Tentang</Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Kontak</Link>
                        <div className="w-12 h-1 bg-white/10 rounded-full" />
                        {auth.user ? (
                            <Link href={route('dashboard')} onClick={() => setMobileMenuOpen(false)} className="text-yellow-400">Ke Dashboard</Link>
                        ) : (
                            <Link href={route('login')} onClick={() => setMobileMenuOpen(false)} className="text-yellow-400">Masuk / Daftar</Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
