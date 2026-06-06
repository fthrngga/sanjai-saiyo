import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, AlertTriangle, Ticket } from 'lucide-react';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Index({ vouchers }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = (voucher) => {
        setVoucherToDelete(voucher);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!voucherToDelete) return;
        setIsDeleting(true);
        router.delete(route('admin.vouchers.destroy', voucherToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setVoucherToDelete(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout title="Voucher">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Voucher</h2>
                        <p className="text-sm text-gray-500">Kelola kupon potongan harga ongkir dan produk.</p>
                    </div>

                    <Link href={route('admin.vouchers.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Tambah Voucher
                        </Button>
                    </Link>
                </div>

                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama Voucher</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Potongan</TableHead>
                                <TableHead>Min. Belanja</TableHead>
                                <TableHead>Kuota</TableHead>
                                <TableHead>Masa Berlaku</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vouchers.data.length > 0 ? (
                                vouchers.data.map((voucher, index) => (
                                    <TableRow key={voucher.id}>
                                        <TableCell>{index + 1 + (vouchers.current_page - 1) * vouchers.per_page}</TableCell>
                                        <TableCell className="font-bold text-amber-600">
                                            <span className="bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 uppercase tracking-wider text-xs">
                                                {voucher.code}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-950">{voucher.name}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                voucher.type === 'shipping' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                            }`}>
                                                {voucher.type === 'shipping' ? 'Potong Ongkir' : 'Potong Produk'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {voucher.discount_type === 'fixed' 
                                                ? `Rp ${voucher.discount_value.toLocaleString('id-ID')}` 
                                                : `${voucher.discount_value}%`
                                            }
                                            {voucher.discount_type === 'percentage' && voucher.max_discount && (
                                                <span className="block text-[10px] text-gray-400 font-normal">
                                                    Maks: Rp {voucher.max_discount.toLocaleString('id-ID')}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>Rp {voucher.min_spend.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>
                                            {voucher.quota === -1 ? 'Tanpa Batas' : `${voucher.quota} pcs`}
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-600">
                                            {formatDate(voucher.start_date)} s/d {formatDate(voucher.end_date)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                voucher.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                                {voucher.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('admin.vouchers.edit', voucher.id)}>
                                                        <Pencil className="h-4 w-4 text-orange-500" />
                                                    </Link>
                                                </Button>

                                                <button
                                                    onClick={() => confirmDelete(voucher)}
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-10 w-10"
                                                    title="Hapus Voucher"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                                        Belum ada voucher.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {vouchers.links && vouchers.links.length > 3 && (
                        <div className="mt-4 flex justify-end gap-2">
                            {vouchers.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-3 py-1 rounded-md text-sm ${link.active ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi Penghapusan</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Apakah Anda yakin ingin menghapus voucher <span className="font-semibold text-gray-800">"{voucherToDelete?.code}"</span>? Aksi ini tidak dapat dibatalkan.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Ya, Hapus
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
