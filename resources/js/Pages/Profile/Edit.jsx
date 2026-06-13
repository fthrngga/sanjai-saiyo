import Navbar from '@/Components/Landing/Navbar';
import { Head } from '@inertiajs/react';
import { User, MapPin, KeyRound } from 'lucide-react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ManageAddressesForm from './Partials/ManageAddressesForm';
import { useState } from 'react';

const TABS = [
    {
        id: 'info',
        label: 'Informasi Profil',
        icon: User,
        desc: 'Perbarui nama lengkap dan alamat email akun Anda.',
    },
    {
        id: 'address',
        label: 'Alamat Pengiriman',
        icon: MapPin,
        desc: 'Kelola alamat untuk mempermudah proses pemesanan dan ongkos kirim.',
    },
    {
        id: 'password',
        label: 'Keamanan Akun',
        icon: KeyRound,
        desc: 'Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat.',
    },
];

export default function Edit({ auth, mustVerifyEmail, status, addresses, provinces }) {
    const [activeTab, setActiveTab] = useState('info');

    const current = TABS.find((t) => t.id === activeTab);
    const ActiveIcon = current.icon;

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-20">
            <Head title="Profil Saya - Sanjai Saiyo" />
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* ── Header Banner ── */}
                <div className="bg-gradient-to-r from-black to-gray-800 rounded-3xl p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg border-4 border-white/10 shrink-0">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left mt-2">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                                Halo, {auth.user.name}!
                            </h1>
                            <p className="text-gray-300 font-medium max-w-lg">
                                Kelola informasi pribadi, alamat pengiriman, dan keamanan akun Anda di sini.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Tab Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Sidebar Tab Menu */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-3 lg:sticky top-28">
                            {/* Mobile: horizontal scroll tabs */}
                            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                                {TABS.map((tab) => {
                                    const TabIcon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={[
                                                'flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-150 whitespace-nowrap lg:whitespace-normal w-auto lg:w-full text-left shrink-0',
                                                isActive
                                                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                                    : 'text-gray-500 hover:bg-amber-50 hover:text-amber-700',
                                            ].join(' ')}
                                        >
                                            <TabIcon
                                                className={['w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-gray-400'].join(' ')}
                                            />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="lg:col-span-9">
                        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[420px]">
                            {/* Dynamic Card Header */}
                            <div className="mb-8 pb-5 border-b border-gray-100">
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                                    <ActiveIcon className="w-6 h-6 text-amber-500" />
                                    {current.label}
                                </h2>
                                <p className="text-sm text-gray-500 mt-2 font-medium">{current.desc}</p>
                            </div>

                            {/* Tab Panels */}
                            {activeTab === 'info' && (
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            )}

                            {activeTab === 'address' && (
                                <ManageAddressesForm
                                    className="max-w-3xl"
                                    addresses={addresses}
                                    provinces={provinces}
                                />
                            )}

                            {activeTab === 'password' && (
                                <UpdatePasswordForm className="max-w-xl" />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
