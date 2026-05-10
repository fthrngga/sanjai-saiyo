import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { MapPin, Plus, Trash2, Check, Star, X, ChevronDown } from 'lucide-react';
import InputError from '@/Components/InputError';
import axios from 'axios';

export default function ManageAddressesForm({ className = '', addresses = [], provinces = [] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);

    
    // Check if we are currently editing an address
    const [editingId, setEditingId] = useState(null);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        label: '',
        recipient_name: '',
        phone_number: '',
        full_address: '',
        province_id: '',
        city_id: '',
        district_id: '',
        subdistrict_id: '',
        postal_code: '',
        is_primary: false,
    });

    useEffect(() => {
        if (data.province_id) {
            axios.get(route('checkout.cities', { province_id: data.province_id }))
                .then(res => setCities(res.data));
        } else {
            setCities([]);
        }
    }, [data.province_id]);

    useEffect(() => {
        if (data.city_id) {
            axios.get(route('checkout.districts', { city_id: data.city_id }))
                .then(res => setDistricts(res.data));
        } else {
            setDistricts([]);
        }
    }, [data.city_id]);

    useEffect(() => {
        if (data.district_id) {
            axios.get(route('checkout.subdistricts', { district_id: data.district_id }))
                .then(res => setSubdistricts(res.data));
        } else {
            setSubdistricts([]);
        }
    }, [data.district_id]);

    const openAddForm = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setIsAdding(true);
    };

    const openEditForm = (address) => {
        clearErrors();
        setData({
            label: address.label || '',
            recipient_name: address.recipient_name || '',
            phone_number: address.phone_number || '',
            full_address: address.full_address || '',
            province_id: address.province_id || '',
            city_id: address.city_id || '',
            district_id: address.district_id || '',
            subdistrict_id: address.subdistrict_id || '',
            postal_code: address.postal_code || '',
            is_primary: address.is_primary == 1,
        });
        setEditingId(address.id);
        setIsAdding(true);
    };

    const closeForm = () => {
        setIsAdding(false);
        setEditingId(null);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (editingId) {
            put(route('user.addresses.update', editingId), {
                preserveScroll: true,
                onSuccess: () => closeForm(),
            });
        } else {
            post(route('user.addresses.store'), {
                preserveScroll: true,
                onSuccess: () => closeForm(),
            });
        }
    };

    const setPrimary = (id) => {
        router.put(route('user.addresses.setPrimary', id), {}, { preserveScroll: true });
    };

    const deleteAddress = (address) => {
        setAddressToDelete(address);
    };

    const confirmDeleteAddress = () => {
        if (addressToDelete) {
            router.delete(route('user.addresses.destroy', addressToDelete.id), { preserveScroll: true });
            setAddressToDelete(null);
        }
    };

    return (
        <section className={className}>
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Buku Alamat</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Atur alamat pengiriman untuk mempermudah proses checkout Anda.
                    </p>
                </div>
                {!isAdding && (
                    <button
                        onClick={openAddForm}
                        className="inline-flex items-center gap-1 bg-black text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-800 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Tambah Alamat
                    </button>
                )}
            </header>

            {isAdding ? (
                <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">{editingId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
                        <button onClick={closeForm} type="button" className="text-gray-400 hover:text-red-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Label (Rumah, Kantor, dll)</label>
                                <input
                                    type="text"
                                    value={data.label}
                                    onChange={e => setData('label', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                    placeholder="Contoh: Rumah"
                                />
                                <InputError message={errors.label} className="mt-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Penerima</label>
                                <input
                                    type="text"
                                    required
                                    value={data.recipient_name}
                                    onChange={e => setData('recipient_name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                />
                                <InputError message={errors.recipient_name} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                            <input
                                type="text"
                                required
                                value={data.phone_number}
                                onChange={e => setData('phone_number', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm md:w-1/2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                placeholder="08..."
                            />
                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Lengkap (Jalan, RT/RW, Patokan)</label>
                            <textarea
                                required
                                value={data.full_address}
                                rows={3}
                                onChange={e => setData('full_address', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            ></textarea>
                            <InputError message={errors.full_address} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provinsi</label>
                                <div className="relative">
                                    <select
                                        value={data.province_id}
                                        onChange={e => setData(d => ({ ...d, province_id: e.target.value, city_id: '', district_id: '', subdistrict_id: '' }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm appearance-none dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                    >
                                        <option value="">Pilih Provinsi</option>
                                        {provinces.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <InputError message={errors.province_id} className="mt-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kota/Kabupaten</label>
                                <div className="relative">
                                    <select
                                        value={data.city_id}
                                        onChange={e => setData(d => ({ ...d, city_id: e.target.value, district_id: '', subdistrict_id: '' }))}
                                        disabled={!data.province_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm appearance-none disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800"
                                    >
                                        <option value="">Pilih Kota/Kabupaten</option>
                                        {cities.map(c => (
                                            <option key={c.id} value={c.id}>{c.type} {c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <InputError message={errors.city_id} className="mt-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kecamatan</label>
                                <div className="relative">
                                    <select
                                        value={data.district_id}
                                        onChange={e => setData(d => ({ ...d, district_id: e.target.value, subdistrict_id: '' }))}
                                        disabled={!data.city_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm appearance-none disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800"
                                    >
                                        <option value="">Pilih Kecamatan</option>
                                        {districts.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <InputError message={errors.district_id} className="mt-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelurahan</label>
                                <div className="relative">
                                    <select
                                        value={data.subdistrict_id}
                                        onChange={e => setData('subdistrict_id', e.target.value)}
                                        disabled={!data.district_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm appearance-none disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:disabled:bg-gray-800"
                                    >
                                        <option value="">Pilih Kelurahan</option>
                                        {subdistricts.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <InputError message={errors.subdistrict_id} className="mt-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode Pos</label>
                                <input
                                    type="text"
                                    value={data.postal_code || ''}
                                    onChange={e => setData('postal_code', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                />
                                <InputError message={errors.postal_code} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="is_primary"
                                checked={data.is_primary}
                                onChange={e => setData('is_primary', e.target.checked)}
                                className="rounded border-gray-300 text-black focus:ring-black"
                            />
                            <label htmlFor="is_primary" className="text-sm text-gray-700 dark:text-gray-300">Jadikan Alamat Utama</label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                            >
                                Simpan Alamat
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    {addresses.length === 0 ? (
                        <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            <MapPin className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Belum ada alamat</h3>
                            <p className="mt-1 text-sm text-gray-500">Tambahkan alamat baru untuk mulai berbelanja.</p>
                        </div>
                    ) : (
                        addresses.map((address) => (
                            <div 
                                key={address.id} 
                                className={`p-4 rounded-lg border ${address.is_primary ? 'border-black bg-gray-50 dark:border-gray-500 dark:bg-gray-800/80 shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{address.recipient_name}</span>
                                            {address.label && (
                                                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                                                    {address.label}
                                                </span>
                                            )}
                                            {address.is_primary == 1 && (
                                                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-black text-white rounded flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-white" /> Utama
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{address.phone_number}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{address.full_address}</p>
                                        {address.postal_code && (
                                            <p className="text-sm text-gray-500 mt-1">Kode Pos: {address.postal_code}</p>
                                        )}
                                    </div>
                                    <div className="flex sm:flex-col justify-end sm:justify-start gap-2 pt-2 sm:pt-0 sm:border-l sm:border-gray-100 dark:sm:border-gray-700 sm:pl-4">
                                        <button 
                                            type="button"
                                            onClick={() => openEditForm(address)}
                                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Ubah
                                        </button>
                                        {!address.is_primary && (
                                            <>
                                                <button 
                                                    type="button"
                                                    onClick={() => setPrimary(address.id)}
                                                    className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                                                >
                                                    Jadikan Utama
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => deleteAddress(address)}
                                                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {addressToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center transform transition-all scale-100 dark:bg-gray-800">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-red-900/30 dark:text-red-400">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">Hapus Alamat?</h2>
                        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400">Apakah Anda yakin ingin menghapus alamat <strong>{addressToDelete.label || 'ini'}</strong>?</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setAddressToDelete(null)}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteAddress}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
