import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, User, Search, LogOut } from 'lucide-react';

import Dropdown from '@/Components/Dropdown';
import SearchInput from '@/Components/Landing/SearchInput';

export default function Navbar() {
    const { auth, cart_count } = usePage().props;

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo & Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-xs">S</div>
                            <span className="font-bold text-xl">Sanjai Saiyo</span>
                        </Link>
                        <div className="hidden md:flex gap-6 text-gray-600 font-medium text-sm">
                            <Link href="/">Beranda</Link>
                            <Link href="/kontak">Kontak</Link>
                            <Link href="/tentang">Tentang Kami</Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 mx-8 hidden md:block">
                        <SearchInput />
                    </div>

                    {/* Auth / Profile */}
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <>
                                <Link href={route('cart.index')} className="text-gray-600 hover:text-black relative p-1">
                                    <ShoppingCart className="w-6 h-6" />
                                    {cart_count > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                                            {cart_count > 99 ? '99+' : cart_count}
                                        </span>
                                    )}
                                </Link>

                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center">
                                                <div className="flex items-center gap-2 text-gray-600 hover:text-black font-medium">
                                                    <User className="w-6 h-6" />
                                                    <span className="hidden sm:inline">{auth.user.name}</span>
                                                </div>
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('orders.index')}>Pesanan Saya</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 font-medium text-sm">
                                <Link href={route('login')} className="text-gray-600 hover:text-black">Masuk</Link>
                                <span className="text-gray-300">|</span>
                                <Link href={route('register')} className="text-gray-600 hover:text-black">Daftar</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search - Visible only on small screens */}
            <div className="md:hidden px-4 pb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full rounded-full border-gray-300 pl-4 pr-10 py-2"
                    />
                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
            </div>
        </nav>
    );
}
