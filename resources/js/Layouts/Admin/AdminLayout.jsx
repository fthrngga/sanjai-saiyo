import AdminSidebar from './AdminSidebar';
import { Head, usePage } from '@inertiajs/react';
import { User, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

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

            {/* Flash Success Toast */}
            <div className={`fixed bottom-6 right-6 z-[9999] transform transition-all duration-500 ease-in-out ${showSuccess ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-white border-l-4 border-green-500 shadow-xl rounded-r-lg rounded-l-sm p-4 max-w-sm flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900">Sukses!</h3>
                        <p className="text-sm text-gray-600 mt-1 leading-snug">{flash?.success}</p>
                    </div>
                    <button onClick={() => setShowSuccess(false)} className="text-gray-400 hover:text-gray-600 shrink-0 p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
