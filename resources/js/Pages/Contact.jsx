import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { MapPin, Phone, Mail, Instagram, Send, Check } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [sent, setSent] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        message: ''
    });

    const submit = (e) => {
        e.preventDefault();
        // Mocking a successful send since there's no backend route required by user right now
        // Feel free to update in the future
        setSent(true);
        reset();
        setTimeout(() => setSent(false), 5000);
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-black selection:text-white">
            <Head title="Kontak - Sanjai Saiyo" />
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">Hubungi Kami</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Punya pertanyaan mengenai pesanan, kemitraan, atau sekadar ingin menyapa? Tim kami selalu siap membantu Anda.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        
                        {/* Info Column */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-8">Informasi Kontak</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-black" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Toko Pusat</h4>
                                            <p className="text-gray-600 leading-relaxed">
                                                Jl. Raya Sumbar No.km13, Ketinggian,<br />
                                                Sarilamak, Kec. Harau,<br />
                                                Kabupaten Lima Puluh Kota, Sumatera Barat 26271
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-black" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Telepon & WhatsApp</h4>
                                            <p className="text-gray-600">+62 812 3456 7890</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-black" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Email</h4>
                                            <p className="text-gray-600">halo@sanjaisaiyo.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold mb-6">Sosial Media</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    {/* Add other socials if needed */}
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative">
                            {sent ? (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-[2rem] z-10 flex flex-col items-center justify-center animate-in fade-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <Check className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
                                    <p className="text-gray-600 text-center max-w-xs">Terima kasih telah menghubungi kami. Tim kami akan segera membalas pesan Anda.</p>
                                </div>
                            ) : null}

                            <h3 className="text-2xl font-bold mb-8">Kirimkan Pesan</h3>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-black focus:border-black transition-colors px-4 py-3"
                                        placeholder="Tulis nama Anda"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-black focus:border-black transition-colors px-4 py-3"
                                        placeholder="Tulis alamat email Anda"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Pesan</label>
                                    <textarea
                                        rows="5"
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-black focus:border-black transition-colors px-4 py-3 resize-none"
                                        placeholder="Apa yang ingin Anda sampaikan?"
                                        required
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Kirim Pesan Sekarang
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* Embedded Minimal Footer */}
            <footer className="bg-black text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Sanjai Saiyo. Hak Cipta Dilindungi.</p>
                </div>
            </footer>
        </div>
    );
}
