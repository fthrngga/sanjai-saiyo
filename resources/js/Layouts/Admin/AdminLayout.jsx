import AdminSidebar from './AdminSidebar';
import { Head, usePage, router } from '@inertiajs/react';
import { User, CheckCircle, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children, title }) {
    const { auth, flash, notifications = [], unread_notifications_count = 0 } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const markAsRead = () => {
        router.post(route('notifications.markRead'), {}, { preserveScroll: true });
    };

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
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotif(!showNotif)}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition relative"
                            >
                                <Bell size={20} />
                                {unread_notifications_count > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                                        {unread_notifications_count}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotif && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-bold text-gray-900">Notifikasi</h3>
                                        {unread_notifications_count > 0 && (
                                            <button 
                                                onClick={markAsRead} 
                                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                            >
                                                Tandai semua dibaca
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${notif.read_at ? 'opacity-60' : 'bg-blue-50/30'}`}>
                                                    <p className="text-sm text-gray-800">{notif.data.message || 'Notifikasi baru'}</p>
                                                    <span className="text-xs text-gray-400 mt-1 block">
                                                        {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-gray-500 text-sm">
                                                Tidak ada notifikasi
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
