import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Check, Truck, CreditCard, ChevronDown, MapPin } from 'lucide-react';
import axios from 'axios';

export default function CheckoutIndex({ cartItems, provinces, userAddresses = [] }) {
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
    });

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
        // Set province name based on ID
        const selectedProv = provinces.find(p => p.id == data.province_id);
        const selectedCity = cities.find(c => c.id == data.city_id);

        // Ensure we send correct names. Inertia's data might lag if we rely solely on state updates triggered just now.
        // However, setData updates are typically fast. 
        // Better: We can pass these directly if we want, or rely on what we set in onChange.
        // Let's rely on what we set in onChange + safety check here if needed? 
        // Actually, with react state, sticking to "data" is fine, but we need to ensure "province_name" was set.
        // Our onChange handlers set them.

        post(route('checkout.store'));
    };

    const grandTotal = itemsTotal + data.shipping_cost;

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
                                        {/* Keterangan Region, ID disembunyikan dalam form tapi dikirim saat post */}
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
                                        className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.courier === c ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                                    >
                                        <Truck className="w-6 h-6" />
                                        <span className="uppercase font-bold">{c}</span>
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
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold mb-4">Rincian Pembayaran</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Total Item</span>
                                    <span>Rp {itemsTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Ongkos Kirim ({data.courier?.toUpperCase()})</span>
                                    <span>Rp {data.shipping_cost.toLocaleString('id-ID')}</span>
                                </div>
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
            </main>
        </div>
    );
}
