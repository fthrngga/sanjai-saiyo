import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Wallet,
    CreditCard,
    TrendingUp,
    Package,
    Users,
    ArrowRight,
    Clock,
    CheckCircle,
    Activity
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';

export default function Dashboard({ auth, metrics = {}, recent_orders = [], top_products = [] }) {
    // Determine greeting based on local time
    const currentHour = new Date().getHours();
    let greeting = 'Selamat Pagi';
    if (currentHour >= 12 && currentHour < 15) greeting = 'Selamat Siang';
    else if (currentHour >= 15 && currentHour < 18) greeting = 'Selamat Sore';
    else if (currentHour >= 18) greeting = 'Selamat Malam';

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AdminLayout title="Overview">
            {/* Header Greeting Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700">{auth.user.name}</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Berikut adalah ringkasan kinerja toko Anda hari ini.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-gray-700">Sistem Online & Berjalan</span>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" /> +Bulan Ini
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Pendapatan</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            Rp {(metrics.total_revenue || 0).toLocaleString('id-ID')}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Bulan ini: Rp {(metrics.this_month_revenue || 0).toLocaleString('id-ID')}</p>
                    </div>
                </div>

                {/* Processing Orders Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Perlu Diproses</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {metrics.processing_orders || 0}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Bungkus & proses pesanan</p>
                    </div>
                </div>

                {/* Pending Actions Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Menunggu Pembayaran</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {metrics.pending_orders || 0}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Belum dibayar oleh pembeli</p>
                    </div>
                </div>

                {/* User Base Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-50 to-purple-100 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Pelanggan</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {metrics.total_users || 0}
                        </h3>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Telah terdaftar di sistem</p>
                    </div>
                </div>
            </div>

            {/* Split Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Orders Section (Left - Takes up 2/3) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h2>
                            <p className="text-sm text-gray-500 font-medium">Transaksi yang baru saja masuk</p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="text-xs font-semibold rounded-full px-4 border-gray-200">
                            <Link href={route('admin.orders.index')} className="flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </Button>
                    </div>

                    <div className="p-0 flex-1 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-transparent hover:bg-transparent">
                                    <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider text-gray-500">KODE</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">PELANGGAN</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">JUMLAH</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">STATUS</TableHead>
                                    <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent_orders.length > 0 ? (
                                    recent_orders.map((order) => (
                                        <TableRow key={order.id} className="cursor-pointer group">
                                            <TableCell className="font-bold text-gray-900">#{order.id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">{order.user?.name || 'Pelanggan'}</div>
                                                <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-600">
                                                Rp {order.total_price.toLocaleString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusStyle(order.order_status)}`}>
                                                    {order.order_status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right w-10">
                                                <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={route('admin.orders.show', order.id)}>
                                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-gray-400 text-sm font-medium">
                                            Belum ada pesanan terbaru hari ini.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Top Products / Sidebar Content (Right - Takes up 1/3) */}
                <div className="flex flex-col gap-8">
                    {/* Top Selling Products Component */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-yellow-500" /> Top Terjual
                            </h2>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Produk dengan performa terbaik keseluruhan</p>
                        </div>
                        <div className="p-6">
                            {top_products.length > 0 ? (
                                <div className="space-y-6">
                                    {top_products.map((product, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-yellow-50 border border-yellow-100 rounded-xl flex items-center justify-center shrink-0 font-black text-yellow-600 text-lg">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 truncate">{product.product_name_snapshot}</h4>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    <span className="text-green-600 font-bold">{product.total_sold}</span> Terjual
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Package className="w-10 h-10 text-gray-200 mb-3" />
                                    <p className="text-gray-400 font-medium">Belum ada data penjualan.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex justify-center">
                            <Button variant="ghost" size="sm" asChild className="w-full text-xs font-semibold text-gray-600 hover:text-black">
                                <Link href={route('admin.products.index')}>Manajemen Produk</Link>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
