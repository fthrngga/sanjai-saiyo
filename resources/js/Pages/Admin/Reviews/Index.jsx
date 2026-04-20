import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({ reviews }) {
    const { delete: destroy } = useForm();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
            setIsDeleting(true);
            destroy(route('admin.reviews.destroy', id), {
                onFinish: () => setIsDeleting(false),
                preserveScroll: true
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Ulasan" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ulasan Pelanggan</h1>
                    <p className="text-sm text-gray-500 mt-1">Pantau dan kelola ulasan yang masuk dari pelanggan</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium">Pelanggan</th>
                                <th className="px-6 py-4 font-medium">Produk</th>
                                <th className="px-6 py-4 font-medium">Rating</th>
                                <th className="px-6 py-4 font-medium">Komentar</th>
                                <th className="px-6 py-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reviews.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Belum ada ulasan yang masuk.
                                    </td>
                                </tr>
                            ) : (
                                reviews.data.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {review.user?.name || 'User Dihapus'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {review.product?.nama_produk || 'Produk Dihapus'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                <span>{review.rating}</span>
                                                <Star className="w-4 h-4 fill-current" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                            {review.comment || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                disabled={isDeleting}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                                title="Hapus Ulasan"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {reviews.links && reviews.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex gap-1">
                        {reviews.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                    link.active
                                        ? 'bg-black text-white font-medium'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
