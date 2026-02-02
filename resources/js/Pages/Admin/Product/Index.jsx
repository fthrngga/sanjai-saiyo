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
import { Link, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Index({ products }) {
    const { links } = products;

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
                                                {product.gambar ? (
                                                    <img src={`/storage/${product.gambar}`} alt={product.nama_produk} className="w-full h-full object-cover" />
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

                                                <Link
                                                    href={route('admin.products.destroy', product.id)}
                                                    method="delete"
                                                    as="button"
                                                    preserveScroll
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-10 w-10"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Link>
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
        </AdminLayout>
    );
}
