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
import { Link, usePage, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function Index({ products }) {
    const { links } = products;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        router.delete(route('admin.products.destroy', productToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AdminLayout title="Produk">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Produk</h2>
                        <p className="text-sm text-gray-500">Kelola katalog produk anda.</p>
                    </div>

                    <Link href={route('admin.products.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tambah
                        </Button>
                    </Link>
                </div>

                <div className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nama Produk</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.length > 0 ? (
                                products.data.map((product, index) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{index + 1 + (products.current_page - 1) * products.per_page}</TableCell>
                                        <TableCell>
                                            <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                                {(product.gambar && product.gambar !== 'null') ? (
                                                    <img src={`/storage/${product.gambar}`} alt={product.nama_produk} className="w-full h-full object-cover" />
                                                ) : (product.variants && product.variants.length > 0 && product.variants[0].image_path) ? (
                                                    <img src={`/storage/${product.variants[0].image_path}`} alt={product.nama_produk} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No IMG</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.nama_produk}</TableCell>
                                        <TableCell>{product.category?.nama_kategori}</TableCell>
                                        <TableCell>{product.stok}</TableCell>
                                        <TableCell>Rp {product.harga.toLocaleString('id-ID')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('admin.products.edit', product.id)}>
                                                        <Pencil className="h-4 w-4 text-orange-500" />
                                                    </Link>
                                                </Button>

                                                <button
                                                    onClick={() => confirmDelete(product)}
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-10 w-10"
                                                    title="Hapus Produk"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        Belum ada produk.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination placeholder - can be improved */}
                    <div className="mt-4 flex justify-end gap-2">
                        {products.links.map((link, i) => (
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
                            Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-gray-800">"{productToDelete?.nama_produk}"</span>? Aksi ini tidak dapat dibatalkan.
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
