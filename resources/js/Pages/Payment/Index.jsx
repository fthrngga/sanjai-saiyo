import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { CreditCard, CheckCircle, Upload, FileImage, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PaymentIndex({ order, dynamic_qris }) {
    const { data, setData, post, processing, errors } = useForm({
        bukti_pembayaran: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('bukti_pembayaran', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.uploadProof', order.id));
    };

    const isPendingVerification = order.status_pembayaran === 'pending_verification';
    const isPaid = order.status_pembayaran === 'paid';
    const isFailed = order.status_pembayaran === 'failed';

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <Head title={`Pembayaran Order #${order.id}`} />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            {isPaid ? <CheckCircle className="w-8 h-8 text-green-500" /> : <CreditCard className="w-8 h-8" />}
                        </div>

                        <h1 className="text-3xl font-bold mb-2">
                            {isPaid ? 'Pembayaran Berhasil' : isPendingVerification ? 'Menunggu Verifikasi Admin' : isFailed ? 'Pembayaran Ditolak' : 'Selesaikan Pembayaran'}
                        </h1>
                        <p className="text-gray-500">Order ID: #{order.id}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Kolom Kiri: Detail dan QRIS */}
                        <div>
                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <div className="text-center mb-4">
                                    <span className="text-gray-600 block mb-1">Total Pembayaran</span>
                                    <span className="font-bold text-4xl text-blue-600">
                                        Rp {order.grand_total.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex items-start gap-2 mb-4">
                                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>Mohon bayar tepat sesuai nominal di atas (termasuk 3 digit terakhir) untuk mempercepat verifikasi.</p>
                                </div>
                                <div className="h-px bg-gray-200 my-4"></div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Total Belanja & Ongkir</span>
                                        <span className="font-medium text-gray-900">Rp {order.total_price.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Kode Unik</span>
                                        <span className="font-medium text-blue-600">+{order.kode_unik}</span>
                                    </div>
                                </div>
                            </div>

                            {!isPaid && !isPendingVerification && (
                                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 text-center flex flex-col items-center">
                                    <h3 className="font-bold text-lg mb-4">Scan QRIS</h3>
                                    <div className="bg-white p-4 rounded-xl border shadow-sm inline-block">
                                        <QRCodeSVG value={dynamic_qris} size={200} level="M" />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4">Nominal pembayaran sudah terisi otomatis pada aplikasi e-wallet / m-banking Anda.</p>
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Upload Bukti */}
                        <div>
                            {isPaid ? (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center h-full flex flex-col justify-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-green-800 mb-2">Pembayaran Terverifikasi</h3>
                                    <p className="text-green-700">Pesanan Anda sedang diproses dan akan segera dikirim.</p>
                                </div>
                            ) : isPendingVerification ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center h-full flex flex-col justify-center">
                                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <h3 className="text-xl font-bold text-blue-800 mb-2">Verifikasi Sedang Berlangsung</h3>
                                    <p className="text-blue-700">Admin kami sedang mengecek mutasi pembayaran Anda. Mohon tunggu sebentar.</p>
                                    {order.bukti_pembayaran && (
                                        <div className="mt-6 mt-4 inline-block">
                                            <p className="text-sm text-blue-600 mb-2 font-medium">Bukti yang diunggah:</p>
                                            <img src={`/${order.bukti_pembayaran}`} alt="Bukti Pembayaran" className="h-40 rounded-lg border border-blue-200 object-cover" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 h-full flex flex-col">
                                    {isFailed && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
                                            <p className="font-bold mb-1">Verifikasi Ditolak</p>
                                            <p>{order.cancel_reason || 'Bukti pembayaran sebelumnya tidak valid. Silakan unggah ulang bukti yang benar.'}</p>
                                        </div>
                                    )}
                                    <h3 className="font-bold text-lg mb-4">Upload Bukti Transfer</h3>
                                    <p className="text-sm text-gray-600 mb-6">Pastikan tanggal dan nominal transfer terlihat jelas untuk memudahkan verifikasi.</p>

                                    <div className="flex-1 mb-6">
                                        <label htmlFor="bukti_pembayaran" className={`flex flex-col items-center justify-center w-full h-full min-h-[200px] border-2 border-dashed rounded-xl cursor-pointer transition-colors ${previewUrl ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                                            {previewUrl ? (
                                                <div className="p-2 relative w-full h-full flex flex-col items-center justify-center">
                                                    <img src={previewUrl} alt="Preview" className="max-h-48 object-contain rounded-lg" />
                                                    <p className="text-xs text-blue-600 font-medium mt-2">Klik untuk mengubah file</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                                                    <p className="text-xs text-gray-500">JPG, PNG (Max 2MB)</p>
                                                </div>
                                            )}
                                            <input 
                                                id="bukti_pembayaran" 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/jpeg, image/png, image/jpg"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        {errors.bukti_pembayaran && (
                                            <p className="text-red-500 text-sm mt-2">{errors.bukti_pembayaran}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.bukti_pembayaran}
                                        className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                                    >
                                        {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
