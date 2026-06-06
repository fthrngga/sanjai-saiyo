import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Search, Menu, X, User, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

import Dropdown from '@/Components/Dropdown';
import SearchInput from '@/Components/Landing/SearchInput';

export default function FloatingNavbar() {
    const { url, props } = usePage();
    const { auth, cart_count, notifications = [], unread_notifications_count = 0 } = props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = (path) => {
        let active = false;
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const linkPath = path.split('#')[0] || '/';
            const linkHash = path.includes('#') ? '#' + path.split('#')[1] : '';

            if (linkHash) {
                // Example: path is "/#catalog" -> linkPath: "/", linkHash: "#catalog"
                active = currentPath === linkPath && currentHash === linkHash;
            } else if (linkPath === '/') {
                // Example: path is "/"
                active = currentPath === '/' && !currentHash;
            } else {
                // Example: path is "/about"
                active = currentPath === linkPath || currentPath.startsWith(linkPath + '/');
            }
        }
        
        return `transition-all whitespace-nowrap font-medium ${
            active 
                ? (scrolled ? 'text-yellow-400 font-bold' : 'text-yellow-600 font-bold')
                : 'hover:opacity-70'
        }`;
    };

    const mobileNavLinkClass = (path) => {
        let active = false;
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const linkPath = path.split('#')[0] || '/';
            const linkHash = path.includes('#') ? '#' + path.split('#')[1] : '';

            if (linkHash) {
                active = currentPath === linkPath && currentHash === linkHash;
            } else if (linkPath === '/') {
                active = currentPath === '/' && !currentHash;
            } else {
                active = currentPath === linkPath || currentPath.startsWith(linkPath + '/');
            }
        }

        return `transition-all ${
            active ? 'text-yellow-400 font-black text-2xl' : 'text-white hover:text-yellow-200 text-2xl font-bold'
        }`;
    };

    return (
        <>
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] xl:w-fit xl:min-w-[900px] max-w-[95%] xl:max-w-6xl ${scrolled ? 'top-4 scale-95' : ''}`}>
                <nav className={`
                    backdrop-blur-md border border-white/20 shadow-2xl rounded-full px-6 py-3
                    flex items-center justify-between transition-colors duration-500
                    ${scrolled ? 'bg-black/80 text-white' : 'bg-white/90 text-black'}
                `}>
                    {/* Logo */}
                    <Link href="/" className="font-black text-xl tracking-tighter shrink-0 mr-4">
                        SAIYO<span className={scrolled ? 'text-yellow-400' : 'text-yellow-600'}>.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm mx-2">
                        <Link href="/" className={navLinkClass('/')}>Beranda</Link>
                        <Link href={route('catalog.index')} className={navLinkClass('/catalog')}>Katalog</Link>
                        <Link href={route('vouchers.index')} className={navLinkClass('/vouchers')}>Voucher</Link>
                        <Link href="/about" className={navLinkClass('/about')}>Tentang</Link>
                        <Link href="/contact" className={navLinkClass('/contact')}>Kontak</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 lg:gap-4 ml-4">
                        {/* Search Input (Desktop) */}
                        <div className="hidden lg:block w-48 xl:w-64 shrink-0">
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
                        <Link href={route('cart.index')} className={`relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group ${url.startsWith('/cart') ? (scrolled ? 'text-yellow-400' : 'text-yellow-600') : ''}`}>
                            <ShoppingCart className="w-5 h-5" />
                            {cart_count > 0 && (
                                <span className="absolute top-1 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {cart_count}
                                </span>
                            )}
                        </Link>

                        {/* Notifications */}
                        {auth.user && (
                            <div className="relative flex items-center h-full">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className={`relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${scrolled ? 'text-white' : 'text-black'}`}>
                                            <Bell className="w-5 h-5" />
                                            {unread_notifications_count > 0 && (
                                                <span className="absolute top-1 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                                    {unread_notifications_count}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="96" contentClasses="py-2 bg-white ring-1 ring-black ring-opacity-5 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                                            <h3 className="font-bold text-gray-900">Notifikasi</h3>
                                            {unread_notifications_count > 0 && (
                                                <Link href={route('notifications.markRead')} method="post" as="button" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                                                    Tandai sudah dibaca
                                                </Link>
                                            )}
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif) => (
                                                    <Link key={notif.id} href={route('orders.index')} className={`block p-4 hover:bg-gray-50 transition-colors ${!notif.read_at ? 'bg-blue-50/50' : ''}`}>
                                                        <p className="text-sm text-gray-800 mb-1 leading-snug">{notif.data.message}</p>
                                                        {notif.data.cancel_reason && (
                                                            <p className="text-xs text-red-600 italic mt-1 line-clamp-1">" {notif.data.cancel_reason} "</p>
                                                        )}
                                                        <span className="text-xs text-gray-500 mt-2 block">{new Date(notif.created_at).toLocaleString('id-ID')}</span>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-gray-500 text-sm">
                                                    Tidak ada notifikasi
                                                </div>
                                            )}
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        )}

                        {/* Auth Button / Profile */}
                        <div className="hidden md:block pl-2 border-l border-gray-300/30">
                            {auth.user ? (
                                <div className="relative flex items-center h-full">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:opacity-70 whitespace-nowrap ${url.startsWith('/profile') || url.startsWith('/orders') ? (scrolled ? 'text-yellow-400' : 'text-yellow-600') : (scrolled ? 'text-white' : 'text-black')}`}>
                                                <User className="w-5 h-5 shrink-0" />
                                                <span className="hidden lg:inline-block whitespace-nowrap leading-tight mt-0.5">{auth.user.name}</span>
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

                    <div className="flex flex-col items-center gap-8 w-full overflow-y-auto pb-20">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/')}>Beranda</Link>
                        <Link href={route('catalog.index')} onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/catalog')}>Katalog</Link>
                        <Link href={route('vouchers.index')} onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/vouchers')}>Voucher</Link>
                        <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/about')}>Tentang</Link>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass('/contact')}>Kontak</Link>

                        <div className="w-12 h-1 bg-white/10 rounded-full" />

                        {auth.user ? (
                            <>
                                <span className="text-sm font-normal text-gray-400 uppercase tracking-widest mt-4">Halo, {auth.user.name}</span>
                                <Link href={route('profile.edit')} onClick={() => setMobileMenuOpen(false)} className="text-white text-xl">Profile</Link>
                                <Link href={route('orders.index')} onClick={() => setMobileMenuOpen(false)} className="text-white text-xl">Pesanan Saya</Link>
                                <Link href={route('logout')} method="post" as="button" onClick={() => setMobileMenuOpen(false)} className="text-red-400 text-xl mt-4">Log Out</Link>
                            </>
                        ) : (
                            <Link href={route('login')} onClick={() => setMobileMenuOpen(false)} className="text-yellow-400 text-xl font-bold">Masuk / Daftar</Link>
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
