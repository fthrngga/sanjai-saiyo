import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';

import Dropdown from '@/Components/Dropdown';
import SearchInput from '@/Components/Landing/SearchInput';

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
                        {/* Search Input (Desktop) */}
                        <div className="hidden md:block w-48 xl:w-64">
                            <SearchInput />
                        </div>

                        {/* Search Icon (Mobile) */}
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                        >
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

                        {/* Auth Button / Profile */}
                        <div className="hidden md:block pl-2 border-l border-gray-300/30">
                            {auth.user ? (
                                <div className="relative flex items-center h-full">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:opacity-70 ${scrolled ? 'text-white' : 'text-black'}`}>
                                                <User className="w-5 h-5" />
                                                <span className="hidden lg:inline">{auth.user.name}</span>
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white ring-1 ring-black ring-opacity-5 rounded-xl shadow-xl z-50">
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('orders.index')}>Pesanan Saya</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
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
                <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center md:hidden pt-20 px-6">
                    {/* Mobile Search */}
                    <div className="w-full max-w-sm mb-12">
                        <SearchInput className="w-full text-black" />
                    </div>

                    <div className="flex flex-col items-center gap-8 text-white text-2xl font-bold w-full overflow-y-auto pb-20">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>Beranda</Link>
                        <Link href="#catalog" onClick={() => setMobileMenuOpen(false)}>Katalog</Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)}>Tentang</Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Kontak</Link>

                        <div className="w-12 h-1 bg-white/10 rounded-full" />

                        {auth.user ? (
                            <>
                                <span className="text-sm font-normal text-gray-400 uppercase tracking-widest mt-4">Halo, {auth.user.name}</span>
                                <Link href={route('profile.edit')} onClick={() => setMobileMenuOpen(false)} className="text-white text-xl">Profile</Link>
                                <Link href={route('orders.index')} onClick={() => setMobileMenuOpen(false)} className="text-white text-xl">Pesanan Saya</Link>
                                <Link href={route('logout')} method="post" as="button" onClick={() => setMobileMenuOpen(false)} className="text-red-400 text-xl mt-4">Log Out</Link>
                            </>
                        ) : (
                            <Link href={route('login')} onClick={() => setMobileMenuOpen(false)} className="text-yellow-400">Masuk / Daftar</Link>
                        )}
                    </div>

                    {/* Close Button top right */}
                    <button
                        className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>
            )}
        </>
    );
}
