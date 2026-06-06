import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Check, CreditCard, ChevronDown, MapPin, Ticket, X, Gift, AlertCircle, Truck, Percent } from 'lucide-react';
import axios from 'axios';
import Modal from '@/Components/Modal';

export default function CheckoutIndex({ cartItems, provinces, userAddresses = [], userVouchers = [] }) {
    // Calculate totals
    const itemsTotal = cartItems.reduce((sum, item) => {
        const price = item.product.harga + (item.variant ? item.variant.additional_price : 0);
        return sum + (price * item.quantity);
    }, 0);

    const primaryAddress = userAddresses.find(a => a.is_primary) || userAddresses[0];

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);

    // Objek Logo Kurir memanggil langsung dari folder public/img/
    const courierLogos = {
        jne: '/img/jne.png',
        tiki: '/img/tiki.png',
        pos: '/img/pos.png'
    };

    const { data, setData, post, processing, errors } = useForm({
        recipient_name: primaryAddress?.recipient_name || '',
        phone_number: primaryAddress?.phone_number || '',
        full_address: primaryAddress?.full_address || '',
        province_id: primaryAddress?.province_id || '',
        province_name: '',
        city_id: primaryAddress?.city_id || '',
        city_name: '',
        district_id: primaryAddress?.district_id || '',
        district_name: '',
        subdistrict_id: primaryAddress?.subdistrict_id || '',
        subdistrict_name: '',
        courier: '',
        shipping_service: '',
        shipping_cost: 0,
        user_voucher_id: '',
    });

    const [selectedUserVoucher, setSelectedUserVoucher] = useState(null);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

    const handleSelectVoucher = (uv) => {
        setSelectedUserVoucher(uv);
        setData('user_voucher_id', uv.pivot.id);
        setIsVoucherModalOpen(false);
    };

    const handleRemoveVoucher = () => {
        setSelectedUserVoucher(null);
        setData('user_voucher_id', '');
    };

    // Fetch cities when province changes
    useEffect(() => {
        if (data.province_id) {
            axios.get(route('checkout.cities', { province_id: data.province_id }))
                .then(res => {
                    setCities(res.data);
                });
        }
    }, [data.province_id]);

    // Fetch districts when city changes
    useEffect(() => {
        if (data.city_id) {
            axios.get(route('checkout.districts', { city_id: data.city_id }))
                .then(res => {
                    setDistricts(res.data);
                });
        }
    }, [data.city_id]);

    // Fetch subdistricts when district changes
    useEffect(() => {
        if (data.district_id) {
            axios.get(route('checkout.subdistricts', { district_id: data.district_id }))
                .then(res => {
                    setSubdistricts(res.data);
                });
        }
    }, [data.district_id]);

    // Fetch shipping cost
    useEffect(() => {
        if ((data.subdistrict_id || data.district_id || data.city_id) && data.courier) {
            setShippingOptions([]);
            setSelectedShipping(null);
            setData(d => ({ ...d, shipping_cost: 0 }));

            axios.post(route('checkout.cost'), {
                city_id: data.city_id,
                district_id: data.district_id,
                subdistrict_id: data.subdistrict_id,
                courier: data.courier
            }).then(res => {
                // Komerce returns flat array of services
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setShippingOptions(res.data);
                }
            });
        }
    }, [data.subdistrict_id, data.district_id, data.city_id, data.courier]);

    const handleShippingSelect = (option) => {
        setSelectedShipping(option);
        setData(d => ({
            ...d,
            shipping_service: option.service,
            // Komerce returns 'cost' as direct integer
            shipping_cost: option.cost
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedProv = provinces.find(p => p.id == data.province_id);
        const selectedCity = cities.find(c => c.id == data.city_id);

        post(route('checkout.store'));
    };

    let discountAmount = 0;
    if (selectedUserVoucher) {
        const voucher = selectedUserVoucher;
        if (itemsTotal >= voucher.min_spend) {
            if (voucher.type === 'shipping') {
                const shippingCost = data.shipping_cost;
                if (voucher.discount_type === 'fixed') {
                    discountAmount = Math.min(shippingCost, voucher.discount_value);
                } else {
                    let pctDiscount = shippingCost * (voucher.discount_value / 100);
                    if (voucher.max_discount) {
                        pctDiscount = Math.min(pctDiscount, voucher.max_discount);
                    }
                    discountAmount = Math.min(shippingCost, pctDiscount);
                }
            } else {
                if (voucher.discount_type === 'fixed') {
                    discountAmount = Math.min(itemsTotal, voucher.discount_value);
                } else {
                    let pctDiscount = itemsTotal * (voucher.discount_value / 100);
                    if (voucher.max_discount) {
                        pctDiscount = Math.min(pctDiscount, voucher.max_discount);
                    }
                    discountAmount = Math.min(itemsTotal, pctDiscount);
                }
            }
        }
    }

    const grandTotal = Math.max(0, itemsTotal + data.shipping_cost - discountAmount);

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <Head title="Checkout - Sanjai Saiyo" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold mb-8">Checkout Pengiriman</h1>

                <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Address Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</div>
                                    Alamat Pengiriman
                                </h2>
                                {userAddresses.length > 0 && (
                                    <a href={route('profile.edit')} className="text-sm font-semibold text-black border border-black px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                                        + Tambah Alamat
                                    </a>
                                )}
                            </div>

                            {userAddresses.length > 0 && (
                                <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Pilih Alamat Tersimpan
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black appearance-none bg-white"
                                            onChange={(e) => {
                                                const addr = userAddresses.find(a => a.id == e.target.value);
                                                if (addr) {
                                                    setData({
                                                        ...data,
                                                        recipient_name: addr.recipient_name || '',
                                                        phone_number: addr.phone_number || '',
                                                        full_address: addr.full_address || '',
                                                        province_id: addr.province_id || '',
                                                        city_id: addr.city_id || '',
                                                        district_id: addr.district_id || '',
                                                        subdistrict_id: addr.subdistrict_id || '',
                                                    });
                                                }
                                            }}
                                            defaultValue={primaryAddress?.id || ''}
                                        >
                                            <option value="" disabled>Pilih Alamat...</option>
                                            {userAddresses.map(addr => (
                                                <option key={addr.id} value={addr.id}>
                                                    {addr.label ? `[${addr.label}] ` : ''}{addr.recipient_name} - {addr.full_address.substring(0, 30)}...
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}

                            {userAddresses.length === 0 ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                                    <MapPin className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-lg text-yellow-900 mb-2">Belum Ada Alamat</h3>
                                    <p className="text-yellow-700 text-sm mb-4">Anda harus menambahkan alamat pengiriman terlebih dahulu di profil Anda sebelum dapat melanjutkan ke pembayaran.</p>
                                    <a href={route('profile.edit')} className="inline-block bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors">
                                        Pergi ke Profil
                                    </a>
                                </div>
                            ) : data.recipient_name ? (
                                <div className="mt-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-lg">{data.recipient_name}</span>
                                        <span className="text-gray-500 text-sm">({data.phone_number})</span>
                                    </div>
                                    <p className="text-gray-700">{data.full_address}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Pastikan alamat di atas sudah benar untuk menghindari kesalahan pengiriman.
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {/* Courier Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</div>
                                Pengiriman
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {['jne', 'tiki', 'pos'].map((c) => (
                                    <div
                                        key={c}
                                        onClick={() => setData('courier', c)}
                                        // Ubah style di sini: menggunakan border-2 border-black saat aktif, border-gray-200 saat tidak
                                        className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${data.courier === c ? 'border-2 border-black bg-white' : 'border border-gray-200 hover:border-gray-300 bg-white'}`}
                                    >
                                        <div className="h-12 w-full flex items-center justify-center">
                                            {/* Ubah style di sini: hapus efek grayscale */}
                                            <img 
                                                src={courierLogos[c]} 
                                                alt={c.toUpperCase()} 
                                                className="max-h-full max-w-[100px] object-contain"
                                            />
                                        </div>
                                        <span className={`uppercase font-bold text-sm tracking-wider ${data.courier === c ? 'text-black' : 'text-gray-500'}`}>{c}</span>
                                    </div>
                                ))}
                            </div>
                            {errors.courier && <p className="text-red-500 text-xs mt-1 mb-4">{errors.courier}</p>}

                            {/* Shipping Options */}
                            {shippingOptions && shippingOptions.length > 0 && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <h3 className="font-semibold text-gray-900">Pilih Layanan:</h3>
                                    {shippingOptions.map((option, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleShippingSelect(option)}
                                            className={`cursor-pointer border rounded-xl p-4 flex justify-between items-center transition-all ${selectedShipping?.service === option.service ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div>
                                                <p className="font-bold text-gray-900">{option.service}</p>
                                                <p className="text-sm text-gray-500">{option.description} ({option.etd} Hari)</p>
                                            </div>
                                            <p className="font-bold text-black">Rp {option.cost.toLocaleString('id-ID')}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.courier && (!shippingOptions || shippingOptions.length === 0) && data.city_id && (
                                <p className="text-gray-400 text-sm italic text-center">Memuat ongkos kirim...</p>
                            )}
                            {errors.shipping_service && <p className="text-red-500 text-xs mt-2">{errors.shipping_service}</p>}
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0 space-y-6">
                        {/* Voucher Selector Panel */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-amber-500" />
                                Voucher Belanja
                            </h3>

                            {selectedUserVoucher ? (
                                <div className="border border-dashed border-amber-300 bg-amber-50/30 rounded-xl p-4 relative group">
                                    <button
                                        type="button"
                                        onClick={handleRemoveVoucher}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Hapus Voucher"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="font-black text-xs uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                            {selectedUserVoucher.code}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 leading-tight">
                                        {selectedUserVoucher.name}
                                    </p>
                                    <p className="text-xs text-green-600 font-bold mt-2">
                                        Potongan: -Rp {discountAmount.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsVoucherModalOpen(true)}
                                    className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-black rounded-xl text-gray-500 hover:text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Gift className="w-4 h-4" />
                                    Pilih Voucher Belanja
                                </button>
                            )}
                            {errors.voucher && <p className="text-red-500 text-xs mt-2 font-bold">{errors.voucher}</p>}
                        </div>

                        {/* Rincian Pembayaran */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold mb-4">Rincian Pembayaran</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Total Item</span>
                                    <span>Rp {itemsTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Ongkos Kirim ({data.courier?.toUpperCase() || '-'})</span>
                                    <span>Rp {data.shipping_cost.toLocaleString('id-ID')}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Potongan Voucher</span>
                                        <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="h-px bg-gray-100 my-2"></div>
                                <div className="flex justify-between font-bold text-xl text-black">
                                    <span>Total Bayar</span>
                                    <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.shipping_cost}
                                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Bayar Sekarang
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Voucher Selection Modal */}
                <Modal show={isVoucherModalOpen} onClose={() => setIsVoucherModalOpen(false)} maxWidth="lg">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Ticket className="w-5 h-5 text-amber-500" />
                                    Pilih Voucher Belanja
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Pilih salah satu voucher aktif untuk mendapatkan potongan harga.</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setIsVoucherModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {userVouchers.length > 0 ? (
                                userVouchers.map((uv) => {
                                    const isEligible = itemsTotal >= uv.min_spend;
                                    const isShipping = uv.type === 'shipping';
                                    const isPercentage = uv.discount_type === 'percentage';

                                    return (
                                        <div 
                                            key={uv.pivot.id} 
                                            onClick={() => isEligible && handleSelectVoucher(uv)}
                                            className={`border rounded-xl p-4 flex justify-between items-center transition-all ${
                                                !isEligible 
                                                    ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
                                                    : selectedUserVoucher?.pivot?.id === uv.pivot.id
                                                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500 cursor-pointer'
                                                    : 'border-gray-200 hover:border-gray-300 cursor-pointer bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                                    isShipping ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                                }`}>
                                                    {isShipping ? <Truck className="w-5 h-5" /> : <Percent className="w-5 h-5" />}
                                                </div>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-xs uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                            {uv.code}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{uv.name}</span>
                                                    </div>
                                                    <p className="font-black text-gray-950 mt-1">
                                                        {isPercentage 
                                                            ? `Diskon ${uv.discount_value}%` 
                                                            : `Potongan Rp ${uv.discount_value.toLocaleString('id-ID')}`
                                                        }
                                                        {isPercentage && uv.max_discount && (
                                                            <span className="text-xs font-normal text-gray-500 block">
                                                                Maks: Rp {uv.max_discount.toLocaleString('id-ID')}
                                                            </span>
                                                        )}
                                                    </p>
                                                    {!isEligible && (
                                                        <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Belum memenuhi minimum belanja Rp {uv.min_spend.toLocaleString('id-ID')} (Kurang Rp {(uv.min_spend - itemsTotal).toLocaleString('id-ID')})
                                                        </p>
                                                    )}
                                                    {isEligible && uv.min_spend > 0 && (
                                                        <p className="text-[10px] text-green-600 font-bold mt-1.5 flex items-center gap-1">
                                                            <Check className="w-3 h-3" />
                                                            Memenuhi syarat minimal belanja Rp {uv.min_spend.toLocaleString('id-ID')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                {selectedUserVoucher?.pivot?.id === uv.pivot.id ? (
                                                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        Terpilih
                                                    </span>
                                                ) : isEligible ? (
                                                    <span className="text-gray-400 hover:text-black text-xs font-bold border border-gray-300 px-3 py-1 rounded-full transition-all">
                                                        Gunakan
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Ticket className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                    Anda belum memiliki voucher yang dapat digunakan.
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            </main>
        </div>
    );
}