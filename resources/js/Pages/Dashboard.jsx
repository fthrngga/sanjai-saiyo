import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Wallet,
    CreditCard,
    TrendingUp,
    Package,
    Users,
    ArrowRight,
    Clock,
    CheckCircle,
    Activity,
    Calendar,
    BarChart3,
    Download,
    Upload
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

export default function Dashboard({ auth, metrics = {}, recent_orders = [], top_products = [], chart_data = [], chart_labels = [], available_years = [], filters = {} }) {
    // Determine greeting based on local time
    const currentHour = new Date().getHours();
    let greeting = 'Selamat Pagi';
    if (currentHour >= 12 && currentHour < 15) greeting = 'Selamat Siang';
    else if (currentHour >= 15 && currentHour < 18) greeting = 'Selamat Sore';
    else if (currentHour >= 18) greeting = 'Selamat Malam';

    // State untuk Filter Periode
    const [selectedYear, setSelectedYear] = useState(filters.year || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(filters.month || 'all');

    // Helper Function untuk Format Rupiah dengan titik
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(angka || 0);
    };

    const handleYearChange = (e) => {
        const value = e.target.value;
        setSelectedYear(value);
        router.get(route('dashboard'), { year: value, month: selectedMonth }, { preserveState: true });
    };

    const handleMonthChange = (e) => {
        const value = e.target.value;
        setSelectedMonth(value);
        router.get(route('dashboard'), { year: selectedYear, month: value }, { preserveState: true });
    };

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

    // Calculate dynamic chart percentage
    const maxChartValue = Math.max(...chart_data, 1); // fallback to 1 if all 0 to avoid Infinity
    const getChartHeight = (val) => {
        const height = (val / maxChartValue) * 100;
        return height > 0 ? height : 5; // minimum 5% height just for visibility if it's 0
    };

    const monthsList = [
        { value: 'all', label: 'Semua Bulan' },
        { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
        { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
    ];

    return (
        <AdminLayout title="Overview">
            {/* Header Section dengan Sentuhan UI Baru */}
            <div className="bg-gradient-to-r from-yellow-50 via-white to-white border border-yellow-100 p-8 rounded-3xl mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm relative overflow-hidden">
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-700">{auth.user.name}</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Ini adalah ringkasan performa penjualan Anda. Pantau terus perkembangannya!</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 relative z-10 w-full xl:w-auto justify-start xl:justify-end">
                    


                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                        <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                        <select 
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer outline-none w-auto pr-6"
                        >
                            {monthsList.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <select 
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer outline-none w-auto pr-6"
                        >
                            {available_years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Online Badge */}
                    <div className="hidden md:flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm shrink-0">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-bold text-gray-700">Online</span>
                    </div>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <Link
                    href={route('admin.sales.index')}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 cursor-pointer transition-all relative overflow-hidden group block"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full shadow-sm">
                            <TrendingUp className="w-3 h-3" /> Periode Filtered
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Total Pendapatan</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {formatRupiah(metrics.total_revenue)}
                        </h3>
                        <p className="text-xs text-amber-600 mt-2 font-bold bg-amber-50 inline-block px-2 py-1 rounded-md">Berdasarkan filter aktif</p>
                    </div>
                </Link>

                {/* Processing Orders Card */}
                <Link
                    href={route('admin.orders.index', { status: 'processing' })}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all relative overflow-hidden group block"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Perlu Diproses</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {metrics.processing_orders || 0} <span className="text-sm text-gray-400 font-medium">Pesanan</span>
                        </h3>
                        <p className="text-xs text-blue-600 mt-2 font-bold bg-blue-50 inline-block px-2 py-1 rounded-md">Bungkus & proses pesanan</p>
                    </div>
                </Link>

                {/* Pending Actions Card */}
                <Link
                    href={route('admin.orders.index', { status: 'pending' })}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 cursor-pointer transition-all relative overflow-hidden group block"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Menunggu Pembayaran</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {metrics.pending_orders || 0} <span className="text-sm text-gray-400 font-medium">Pesanan</span>
                        </h3>
                        <p className="text-xs text-orange-600 mt-2 font-bold bg-orange-50 inline-block px-2 py-1 rounded-md">Belum dibayar oleh pembeli</p>
                    </div>
                </Link>

                {/* User Base Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-200 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-700 shadow-sm border border-gray-200">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Total Pelanggan</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {metrics.total_users || 0} <span className="text-sm text-gray-400 font-medium">Orang</span>
                        </h3>
                        <p className="text-xs text-gray-600 mt-2 font-bold bg-gray-100 inline-block px-2 py-1 rounded-md">Telah terdaftar di sistem</p>
                    </div>
                </div>
            </div>

            {/* Bagian Grafik Pendapatan */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-amber-500" /> Tren Pendapatan
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            Visualisasi grafik pendapatan untuk tahun {selectedYear}
                        </p>
                    </div>
                </div>
                
                {/* Visualisasi Grafik Murni dengan Tailwind */}
                <div className="h-64 flex items-end justify-between gap-2 border-b border-gray-100 pb-2 relative">
                    {/* Garis Horizontal Latar */}
                    <div className="absolute w-full h-full flex flex-col justify-between -z-10 pb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="border-t border-dashed border-gray-200 w-full h-0"></div>
                        ))}
                    </div>

                    {chart_data.map((val, i) => {
                        const isSelectedMonth = selectedMonth !== 'all' && Number(selectedMonth) === i + 1;
                        const isAnyMonthSelected = selectedMonth !== 'all';
                        
                        let barColorClass = 'bg-gray-100 group-hover:bg-gray-300';
                        if (val > 0) {
                            if (isSelectedMonth) {
                                barColorClass = 'bg-amber-400 shadow-sm';
                            } else if (isAnyMonthSelected) {
                                barColorClass = 'bg-amber-100 opacity-40 hover:opacity-100';
                            } else {
                                barColorClass = 'bg-amber-100 group-hover:bg-amber-400';
                            }
                        }

                        return (
                            <div key={i} className={`w-full h-full flex flex-col justify-end items-center gap-3 group relative ${isSelectedMonth ? 'scale-105 origin-bottom' : ''}`}>
                                {/* Tooltip Hover */}
                                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl z-20">
                                    {formatRupiah(val)}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                                
                                {/* Bar Grafik */}
                                <div
                                    className={`w-full max-w-[40px] ${barColorClass} rounded-t-md transition-all duration-500 relative cursor-pointer`}
                                    style={{ height: `${getChartHeight(val)}%` }}
                                >
                                    {val > 0 && (
                                        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-200 to-transparent rounded-b-md opacity-50"></div>
                                    )}
                                </div>
                                {/* Label Bawah */}
                                <span className={`text-[10px] sm:text-xs font-bold group-hover:text-black transition-colors text-center truncate w-full px-1 ${isSelectedMonth ? 'text-amber-600' : 'text-gray-400'}`}>
                                    {chart_labels[i]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Split Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Orders Section (Left - Takes up 2/3) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">Pesanan Terbaru</h2>
                            <p className="text-sm text-gray-500 font-medium mt-1">Transaksi yang baru saja masuk</p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="text-xs font-bold rounded-full px-4 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors">
                            <Link href={route('admin.orders.index')} className="flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </Button>
                    </div>

                    <div className="p-0 flex-1 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-transparent hover:bg-transparent">
                                    <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider text-gray-400">KODE</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">PELANGGAN</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">JUMLAH</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-400">STATUS</TableHead>
                                    <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-400">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent_orders.length > 0 ? (
                                    recent_orders.map((order) => (
                                        <TableRow key={order.id} className="cursor-pointer group hover:bg-yellow-50/30 transition-colors">
                                            <TableCell className="font-bold text-gray-900">#{order.id}</TableCell>
                                            <TableCell>
                                                <div className="font-bold text-gray-900">{order.user?.name || 'Pelanggan'}</div>
                                                <div className="text-xs text-gray-500 font-medium">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                                            </TableCell>
                                            <TableCell className="font-extrabold text-gray-700">
                                                {formatRupiah(order.total_price)}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wider shadow-sm ${getStatusStyle(order.order_status)}`}>
                                                    {order.order_status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right w-10">
                                                <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={route('admin.orders.show', order.id)}>
                                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600" />
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
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-amber-500" /> Top Terjual
                            </h2>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Produk dengan performa terbaik keseluruhan</p>
                        </div>
                        <div className="p-6">
                            {top_products.length > 0 ? (
                                <div className="space-y-6">
                                    {top_products.map((product, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center shrink-0 font-black text-amber-600 text-lg shadow-sm group-hover:scale-110 transition-transform">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-extrabold text-gray-900 truncate group-hover:text-amber-600 transition-colors">{product.product_name_snapshot}</h4>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                    <span className="text-green-600 font-black">{product.total_sold}</span> Terjual
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <Package className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 font-bold">Belum ada data penjualan.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-center">
                            <Button variant="ghost" size="sm" asChild className="w-full text-xs font-extrabold text-gray-600 hover:text-black hover:bg-gray-200 rounded-xl transition-all">
                                <Link href={route('admin.products.index')}>Manajemen Produk</Link>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}