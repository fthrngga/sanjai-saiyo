import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { Head, router } from '@inertiajs/react';
import { Ticket, Truck, Percent, Calendar, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function VoucherCenter({ vouchers, claimedVoucherIds }) {
    const [claimingId, setClaimingId] = useState(null);

    const handleClaim = (voucherId) => {
        setClaimingId(voucherId);
        router.post(route('vouchers.claim', voucherId), {}, {
            preserveScroll: true,
            onFinish: () => setClaimingId(null)
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Selamanya';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 antialiased flex flex-col justify-between">
            <div>
                <Head title="Pusat Voucher - Sanjai Saiyo" />
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="bg-amber-100 text-amber-800 text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-3 inline-block">
                            Promo Spesial
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
                            Pusat Voucher Belanja
                        </h1>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            Klaim berbagai diskon menarik untuk menghemat ongkos kirim atau dapatkan potongan harga langsung dari produk pilihan terbaik kami.
                        </p>
                    </div>

                    {/* Vouchers Grid */}
                    {vouchers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {vouchers.map((voucher) => {
                                const isClaimed = claimedVoucherIds.includes(voucher.id);
                                const isShipping = voucher.type === 'shipping';
                                const isPercentage = voucher.discount_type === 'percentage';

                                return (
                                    <div 
                                        key={voucher.id}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all duration-300 relative group"
                                    >
                                        {/* Ticket Top Half */}
                                        <div className="p-6 pb-4 flex items-start gap-4">
                                            {/* Icon Badge */}
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                                isShipping ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                            }`}>
                                                {isShipping ? <Truck className="w-7 h-7" /> : <Percent className="w-7 h-7" />}
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1">
                                                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                                                    isShipping ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                                }`}>
                                                    {isShipping ? 'Diskon Ongkir' : 'Diskon Produk'}
                                                </span>
                                                <h3 className="font-extrabold text-gray-900 group-hover:text-amber-600 transition-colors text-lg">
                                                    {voucher.name}
                                                </h3>
                                                <p className="text-2xl font-black text-gray-950 mt-1">
                                                    {isPercentage 
                                                        ? `${voucher.discount_value}% OFF` 
                                                        : `Rp ${Number(voucher.discount_value).toLocaleString('id-ID')} OFF`
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Ticket Dashed Separator */}
                                        <div className="relative flex items-center py-2 select-none pointer-events-none">
                                            {/* Left Notch */}
                                            <div className="w-4 h-8 bg-gray-50 border-r border-gray-100 rounded-r-full absolute -left-1"></div>
                                            {/* Dashed Line */}
                                            <div className="w-full border-t border-dashed border-gray-200 mx-4"></div>
                                            {/* Right Notch */}
                                            <div className="w-4 h-8 bg-gray-50 border-l border-gray-100 rounded-l-full absolute -right-1"></div>
                                        </div>

                                        {/* Ticket Bottom Half */}
                                        <div className="p-6 pt-2 space-y-4">
                                            <div className="space-y-1.5 text-xs text-gray-500 font-medium">
                                                {voucher.min_spend > 0 && (
                                                    <div className="flex items-center gap-1.5 text-gray-700">
                                                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                                        <span>Min. Belanja: Rp {Number(voucher.min_spend).toLocaleString('id-ID')}</span>
                                                    </div>
                                                )}
                                                {isPercentage && voucher.max_discount && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Check className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        <span>S&K: Maks. potongan Rp {Number(voucher.max_discount).toLocaleString('id-ID')}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                    <span>Berlaku s/d: {formatDate(voucher.end_date)}</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => !isClaimed && handleClaim(voucher.id)}
                                                disabled={isClaimed || claimingId === voucher.id}
                                                className={`w-full py-3 rounded-xl font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                                    isClaimed
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : claimingId === voucher.id
                                                        ? 'bg-amber-400 text-white cursor-wait'
                                                        : 'bg-black text-white hover:bg-gray-800 shadow hover:shadow-md'
                                                }`}
                                            >
                                                {isClaimed ? (
                                                    <>
                                                        <Check className="w-4 h-4 text-green-500" />
                                                        Sudah Diklaim
                                                    </>
                                                ) : claimingId === voucher.id ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Mengeklaim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ticket className="w-4 h-4" />
                                                        Klaim Voucher
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto shadow-sm">
                            <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Ticket className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Voucher</h3>
                            <p className="text-gray-500 mb-4 px-6">Saat ini tidak ada voucher publik yang tersedia untuk diklaim. Kembali lagi nanti untuk promo terbaru!</p>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
