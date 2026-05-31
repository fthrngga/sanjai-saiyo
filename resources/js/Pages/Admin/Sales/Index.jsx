import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { TrendingUp, ShoppingBag, PieChart, Info, Package, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

export default function SalesIndex({ auth, sales, metrics, filters, availableYears }) {
    const { month = '', year = '' } = filters || {};

    const months = [
        { value: '', label: 'Semua Bulan' },
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    const handleFilterChange = (newMonth, newYear) => {
        const params = {};
        if (newMonth) params.month = newMonth;
        if (newYear) params.year = newYear;

        router.get(route('admin.sales.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    // Helper function to calculate total items in one order
    const calculateTotalItems = (items) => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <AdminLayout title="Laporan Penjualan (Pesanan Selesai)">

            {/* Analytics Dashboard top row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Revenue Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Pendapatan</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Rp {Number(metrics.total_revenue).toLocaleString('id-ID')}
                        </h3>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Pesanan Selesai</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {metrics.total_orders} <span className="text-sm font-normal text-gray-500">Transaksi</span>
                        </h3>
                    </div>
                </div>

                {/* Total Item Sold Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Produk Terjual</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {metrics.total_items_sold} <span className="text-sm font-normal text-gray-500">Item</span>
                        </h3>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Riwayat Penjualan</h2>
                        <p className="text-sm text-gray-500">Daftar transaksi pesanan yang telah diselesaikan oleh pelanggan (Status: Completed).</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select
                            value={month || ''}
                            onChange={(e) => handleFilterChange(e.target.value, year)}
                            className="bg-white border border-gray-200 rounded-lg text-sm pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer"
                        >
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        <select
                            value={year || ''}
                            onChange={(e) => handleFilterChange(month, e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg text-sm pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer"
                        >
                            <option value="">Semua Tahun</option>
                            {availableYears.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        {(month || year) && (
                            <button
                                onClick={() => handleFilterChange('', '')}
                                className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 flex items-center transition-colors"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Order ID</TableHead>
                                <TableHead>Tanggal Selesai</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Produk Dibeli</TableHead>
                                <TableHead>Total Transaksi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.data.length > 0 ? (
                                sales.data.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-bold">#{sale.id}</TableCell>
                                        <TableCell className="text-gray-500">
                                            {new Date(sale.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{sale.user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                                <Package size={12} />
                                                {calculateTotalItems(sale.items)} Item
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium text-green-700">
                                            Rp {Number(sale.total_price).toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild className="h-8 gap-1">
                                                <Link href={route('admin.orders.show', sale.id)}>
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Detail Transaksi
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        Data penjualan belum tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {sales.links.length > 3 && (
                        <div className="mt-4 flex justify-end gap-2">
                            {sales.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${link.active ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-sm text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
