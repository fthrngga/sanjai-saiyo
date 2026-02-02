import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { CreditCard, CheckCircle } from 'lucide-react';

export default function PaymentIndex({ order }) {
    const { post, processing } = useForm();

    const handleSimulatePayment = () => {
        post(route('payment.simulate', order.id));
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <Head title={`Pembayaran Order #${order.id}`} />
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CreditCard className="w-8 h-8" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Selesaikan Pembayaran</h1>
                    <p className="text-gray-500 mb-8">Order ID: #{order.id}</p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Total Pembayaran</span>
                            <span className="font-bold text-xl">Rp {order.total_price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="h-px bg-gray-200 my-4"></div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Penerima</span>
                                <span className="font-medium text-gray-900">{order.address_snapshot.recipient_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Kurir</span>
                                <span className="font-medium text-gray-900">{order.shipping_courier.toUpperCase()} - {order.shipping_service}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900">Virtual Account / Transfer</p>
                                <p className="text-xs text-gray-500">Otomatis dicek (Simulasi)</p>
                            </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    <button
                        onClick={handleSimulatePayment}
                        disabled={processing}
                        className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                    >
                        {processing ? 'Memproses Pembayaran...' : 'Bayar Sekarang'}
                    </button>
                </div>
            </main>
        </div>
    );
}
