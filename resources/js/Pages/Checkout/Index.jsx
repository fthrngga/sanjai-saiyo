import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Check, Truck, CreditCard, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function CheckoutIndex({ cartItems, provinces }) {
    // Calculate totals
    const itemsTotal = cartItems.reduce((sum, item) => {
        const price = item.product.harga + (item.variant ? item.variant.additional_price : 0);
        return sum + (price * item.quantity);
    }, 0);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        recipient_name: '',
        phone_number: '',
        full_address: '',
        province_id: '',
        province_name: '',
        city_id: '',
        city_name: '',
        district_id: '',
        district_name: '',
        subdistrict_id: '',
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
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</div>
                                Alamat Pengiriman
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
                                    <input
                                        type="text"
                                        value={data.recipient_name}
                                        onChange={e => setData('recipient_name', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                    {errors.recipient_name && <p className="text-red-500 text-xs mt-1">{errors.recipient_name}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black"
                                        placeholder="08123456789"
                                    />
                                    {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                                    <textarea
                                        rows="3"
                                        value={data.full_address}
                                        onChange={e => setData('full_address', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black"
                                        placeholder="Nama Jalan, No. Rumah, RT/RW, Kecamatan..."
                                    ></textarea>
                                    {errors.full_address && <p className="text-red-500 text-xs mt-1">{errors.full_address}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                                    <div className="relative">
                                        <select
                                            value={data.province_id}
                                            onChange={e => {
                                                const prov = provinces.find(p => p.id == e.target.value);
                                                setData(d => ({
                                                    ...d,
                                                    province_id: e.target.value,
                                                    province_name: prov?.name || '',
                                                    city_id: '', city_name: '',
                                                    district_id: '', district_name: '',
                                                    subdistrict_id: '', subdistrict_name: ''
                                                }));
                                            }}
                                            className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black appearance-none"
                                        >
                                            <option value="">Pilih Provinsi</option>
                                            {provinces.map((p, idx) => (
                                                <option key={p.id || idx} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.province_id && <p className="text-red-500 text-xs mt-1">{errors.province_id}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
                                    <div className="relative">
                                        <select
                                            value={data.city_id}
                                            onChange={e => {
                                                const city = cities.find(c => c.id == e.target.value);
                                                setData(d => ({
                                                    ...d,
                                                    city_id: e.target.value,
                                                    city_name: city ? `${city.type || ''} ${city.name}`.trim() : '',
                                                    district_id: '', district_name: '',
                                                    subdistrict_id: '', subdistrict_name: ''
                                                }));
                                            }}
                                            disabled={!data.province_id}
                                            className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <option value="">Pilih Kota/Kabupaten</option>
                                            {cities.map((c, idx) => (
                                                <option key={c.id || idx} value={c.id}>{c.type} {c.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.city_id && <p className="text-red-500 text-xs mt-1">{errors.city_id}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                                    <div className="relative">
                                        <select
                                            value={data.district_id || ''}
                                            onChange={e => {
                                                const dist = districts.find(d => d.id == e.target.value);
                                                setData(d => ({
                                                    ...d,
                                                    district_id: e.target.value,
                                                    district_name: dist?.name || '',
                                                    subdistrict_id: '', subdistrict_name: ''
                                                }));
                                            }}
                                            disabled={!data.city_id}
                                            className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <option value="">Pilih Kecamatan</option>
                                            {districts.map((d, idx) => (
                                                <option key={d.id || idx} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
                                    <div className="relative">
                                        <select
                                            value={data.subdistrict_id || ''}
                                            onChange={e => {
                                                const sub = subdistricts.find(s => s.id == e.target.value);
                                                setData(d => ({
                                                    ...d,
                                                    subdistrict_id: e.target.value,
                                                    subdistrict_name: sub?.name || ''
                                                }));
                                            }}
                                            disabled={!data.district_id}
                                            className="w-full rounded-xl border-gray-300 focus:ring-black focus:border-black appearance-none disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <option value="">Pilih Kelurahan</option>
                                            {subdistricts.map((s, idx) => (
                                                <option key={s.id || idx} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
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
