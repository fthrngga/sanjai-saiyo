import Navbar from '@/Components/Landing/Navbar';
import { Head } from '@inertiajs/react';
import { User, MapPin, KeyRound, ChevronRight } from 'lucide-react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ManageAddressesForm from './Partials/ManageAddressesForm';

export default function Edit({ auth, mustVerifyEmail, status, addresses, provinces }) {
    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-20">
            <Head title="Profil Saya - Sanjai Saiyo" />
            
            {/* Menggunakan Navbar utama website agar terintegrasi dengan tema */}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-black to-gray-800 rounded-3xl p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg border-4 border-white/10 shrink-0">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left mt-2">
                            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Halo, {auth.user.name}!</h1>
                            <p className="text-gray-300 font-medium max-w-lg">Kelola informasi pribadi, alamat pengiriman, dan keamanan akun Anda di sini.</p>
                        </div>
                    </div>
                </div>

                {/* Grid Layout for Forms */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar Menu Desktop (Optional tapi mempercantik UX) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sticky top-28">
                            <div className="space-y-1">
                                <a href="#info" className="flex items-center justify-between p-3.5 rounded-2xl text-gray-600 hover:bg-amber-50 hover:text-amber-700 font-bold transition-all group">
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" /> Info Dasar
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-transparent group-hover:text-amber-500 transition-colors" />
                                </a>
                                <a href="#address" className="flex items-center justify-between p-3.5 rounded-2xl text-gray-600 hover:bg-amber-50 hover:text-amber-700 font-bold transition-all group">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" /> Alamat
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-transparent group-hover:text-amber-500 transition-colors" />
                                </a>
                                <a href="#password" className="flex items-center justify-between p-3.5 rounded-2xl text-gray-600 hover:bg-amber-50 hover:text-amber-700 font-bold transition-all group">
                                    <div className="flex items-center gap-3">
                                        <KeyRound className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" /> Keamanan
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-transparent group-hover:text-amber-500 transition-colors" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form Sections */}
                    <div className="lg:col-span-9 space-y-8">
                        <section id="info" className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 scroll-mt-32">
                            <div className="mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                                    <User className="w-6 h-6 text-amber-500" /> Informasi Profil
                                </h2>
                                <p className="text-sm text-gray-500 mt-2 font-medium">Perbarui nama lengkap dan alamat email akun Anda.</p>
                            </div>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </section>

                        <section id="address" className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 scroll-mt-32">
                            <div className="mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-amber-500" /> Alamat Pengiriman
                                </h2>
                                <p className="text-sm text-gray-500 mt-2 font-medium">Kelola alamat untuk mempermudah proses pemesanan dan perhitungan ongkos kirim.</p>
                            </div>
                            <ManageAddressesForm className="max-w-3xl" addresses={addresses} provinces={provinces} />
                        </section>

                        <section id="password" className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 scroll-mt-32">
                            <div className="mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                                    <KeyRound className="w-6 h-6 text-amber-500" /> Perbarui Password
                                </h2>
                                <p className="text-sm text-gray-500 mt-2 font-medium">Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat.</p>
                            </div>
                            <UpdatePasswordForm className="max-w-xl" />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
