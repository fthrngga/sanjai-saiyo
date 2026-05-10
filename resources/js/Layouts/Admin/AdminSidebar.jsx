import { useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, ShoppingBag, Package, FileText, Star, LogOut } from 'lucide-react';

export default function AdminSidebar() {
    // usePage().url gives us the current URL path, e.g. "/admin/products"
    const { url: currentUrl, unread_orders_count } = usePage().props;
    const pageUrl = usePage().url; // This is the reliable source

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['unread_orders_count'], preserveState: true, preserveScroll: true });
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const links = [
        { name: 'Dashboard',  href: route('dashboard'),             icon: LayoutDashboard },
        { name: 'Penjualan',  href: route('admin.sales.index'),     icon: ShoppingBag },
        { name: 'Produk',     href: route('admin.products.index'),  icon: Package },
        { name: 'Pesanan',    href: route('admin.orders.index'),    icon: FileText },
        { name: 'Ulasan',     href: route('admin.reviews.index'),   icon: Star },
    ];

    const isActive = (href) => {
        try {
            const linkPath = new URL(href).pathname;
            // Exact match for dashboard, prefix match for others
            if (linkPath === '/dashboard') {
                return pageUrl === linkPath;
            }
            return pageUrl === linkPath || pageUrl.startsWith(linkPath + '/');
        } catch {
            return false;
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm">
            {/* Branding */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mr-3 flex items-center justify-center text-white font-black text-sm shadow">
                    S
                </div>
                <span className="font-extrabold text-lg tracking-tight text-gray-900">
                    Sanjai <span className="text-amber-500">Admin</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={[
                                'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 relative overflow-hidden',
                                active
                                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                    : 'text-gray-500 hover:bg-amber-50 hover:text-amber-700',
                            ].join(' ')}
                        >
                            <div className="flex items-center gap-3">
                                <Icon
                                    size={20}
                                    className={active ? 'text-white' : 'text-gray-400'}
                                />
                                <span>{link.name}</span>
                            </div>

                            {link.name === 'Pesanan' && unread_orders_count > 0 && (
                                <span className={[
                                    'min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-bold animate-pulse',
                                    active ? 'bg-white text-amber-600' : 'bg-red-500 text-white',
                                ].join(' ')}>
                                    {unread_orders_count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-gray-100">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl text-sm font-semibold transition-all duration-150"
                >
                    <LogOut size={20} />
                    Keluar
                </Link>
            </div>
        </aside>
    );
}
