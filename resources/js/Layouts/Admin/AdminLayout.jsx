import AdminSidebar from './AdminSidebar';
import { Head, usePage } from '@inertiajs/react';
import { User } from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <Head title={title} />

            <AdminSidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-none">
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-900">{auth.user.name}</span>
                            <span className="text-xs text-gray-500 capitalize">{auth.user.role}</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="text-gray-600" size={20} />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
