import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Package, Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

export default function OrderIndex({ auth, orders, filters, newOrderIds = [] }) {
    const { data, setData, get, processing } = useForm({
        status: filters.status || 'all',
    });

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['orders', 'newOrderIds'],
                preserveScroll: true,
                preserveState: true,
            });
        }, 10000); // Polling every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const handleFilterChange = (newStatus) => {
        setData('status', newStatus);
        router.get(route('admin.orders.index'), { status: newStatus }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (status) => {
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
        <AdminLayout title="Manajemen Pesanan">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Pesanan</h2>
                        <p className="text-sm text-gray-500">Pantau dan kelola semua pesanan masuk.</p>
                    </div>

                        <div className="flex bg-gray-100 p-1 rounded-lg mt-4 md:mt-0 overflow-x-auto max-w-full no-scrollbar">
                            {[
                                { id: 'all', label: 'Semua Pesanan' },
                                { id: 'pending', label: 'Menunggu' },
                                { id: 'processing', label: 'Diproses' },
                                { id: 'shipped', label: 'Dikirim' },
                                { id: 'completed', label: 'Selesai' },
                                { id: 'cancelled', label: 'Dibatalkan' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleFilterChange(tab.id)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                                        filters.status === tab.id
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Order ID</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => {
                                    const isNew = newOrderIds.includes(order.id);
                                    return (
                                    <TableRow key={order.id} className={isNew ? 'bg-yellow-50/50 hover:bg-yellow-50 transition-colors' : ''}>
                                        <TableCell className="font-bold relative">
                                            {isNew && (
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" title="Pesanan Baru!"></span>
                                            )}
                                            <span className={isNew ? 'pl-2' : ''}>#{order.id}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{order.user.name}</span>
                                                <span className="text-xs text-gray-500">{order.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            Rp {Number(order.grand_total || order.total_price).toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.order_status)} capitalize`}>
                                                    {order.order_status}
                                                </span>
                                                {order.payment_status === 'paid' && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> Paid
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild className="h-8 gap-1">
                                                <Link href={route('admin.orders.show', order.id)}>
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Detail
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        Belum ada pesanan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-end gap-2">
                        {orders.links.map((link, i) => (
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
                </div>
            </div>
        </AdminLayout>
    );
}
