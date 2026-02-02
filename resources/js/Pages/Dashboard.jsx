import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Penjualan</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">Rp 12.500.000</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Pesanan</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">150</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Produk Aktif</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
                </div>
            </div>
        </AdminLayout>
    );
}
