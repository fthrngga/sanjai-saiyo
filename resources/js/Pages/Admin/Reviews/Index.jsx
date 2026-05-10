import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import Modal from '@/Components/Modal';
import { Star, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function Index({ reviews }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedReviews(reviews.data.map(r => r.id));
        } else {
            setSelectedReviews([]);
        }
    };

    const handleSelect = (id) => {
        if (selectedReviews.includes(id)) {
            setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id));
        } else {
            setSelectedReviews([...selectedReviews, id]);
        }
    };

    const confirmBulkDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleBulkDelete = () => {
        setIsDeleting(true);
        router.post(route('admin.reviews.bulkDestroy'), { ids: selectedReviews }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedReviews([]);
                setIsDeleteModalOpen(false);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Ulasan" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ulasan Pelanggan</h1>
                    <p className="text-sm text-gray-500 mt-1">Pantau dan kelola ulasan yang masuk dari pelanggan</p>
                </div>
                {selectedReviews.length > 0 && (
                    <button
                        onClick={confirmBulkDelete}
                        disabled={isDeleting}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus {selectedReviews.length} Terpilih
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-black shadow-sm focus:border-black focus:ring-black"
                                        onChange={handleSelectAll}
                                        checked={reviews.data.length > 0 && selectedReviews.length === reviews.data.length}
                                    />
                                </th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium">Pelanggan</th>
                                <th className="px-6 py-4 font-medium">Produk</th>
                                <th className="px-6 py-4 font-medium">Rating</th>
                                <th className="px-6 py-4 font-medium">Komentar</th>
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
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-black shadow-sm focus:border-black focus:ring-black"
                                                checked={selectedReviews.includes(review.id)}
                                                onChange={() => handleSelect(review.id)}
                                            />
                                        </td>
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

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi Penghapusan</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Apakah Anda yakin ingin menghapus {selectedReviews.length} ulasan yang dipilih? Aksi ini tidak dapat dibatalkan.
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
                            onClick={handleBulkDelete}
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
