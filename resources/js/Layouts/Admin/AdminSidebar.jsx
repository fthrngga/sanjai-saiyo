import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ShoppingBag, Package, FileText, Star, CheckSquare, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
    const { url } = usePage();

    const links = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard },
        { name: 'Penjualan', href: '#', icon: ShoppingBag }, // Placeholder
        { name: 'Produk', href: route('admin.products.index'), icon: Package },
        { name: 'Pesanan', href: route('admin.orders.index'), icon: FileText },
        { name: 'Ulasan', href: '#', icon: Star },
        { name: 'Konfirmasi', href: '#', icon: CheckSquare },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="w-8 h-8 bg-gray-900 rounded-md mr-3"></div>
                <span className="font-bold text-lg">Sanjai Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    let isActive = false;

                    if (link.href !== '#' && link.href) {
                        try {
                            const linkPath = new URL(link.href).pathname;
                            isActive = url === linkPath || url.startsWith(linkPath + '/');
                        } catch (e) {
                            // If link.href is likely relative or invalid (though route() usually gives absolute)
                            isActive = false;
                        }
                    }

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
