import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import { Leaf, Award, Heart, ShieldCheck } from 'lucide-react';


export default function About() {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-black selection:text-white">
            <Head title="Tentang Kami - Sanjai Saiyo" />
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-100 via-white to-white"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                            Warisan Rasa <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
                                Dari Ranah Minang.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                            Berawal dari resep tradisi keluarga, Sanjai Saiyo hadir untuk membawa cita rasa autentik camilan Payakumbuh ke seluruh penjuru Nusantara. Renyah, gurih, dan penuh cerita.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Image Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gray-200 rounded-[2.5rem] transform -rotate-3 transition-transform group-hover:rotate-0 duration-500 z-0"></div>
                            <img
                                src="/img/foto tentang kami PA.jpg"
                                alt="Dapur Tradisional"
                                className="relative z-10 w-full h-[500px] object-cover rounded-[2rem] shadow-2xl contrast-110 saturate-110 brightness-105 hover:saturate-125 transition-all duration-700"
                            />
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Filosofi Kami</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    "Saiyo" dalam bahasa Minang berarti sepakat atau seia sekata. Kami percaya bahwa setiap produk yang lezat lahir dari harmoni cita rasa, kerja keras, dan dedikasi menjaga tradisi. Di Sanjai Saiyo, kami tidak sekadar menjual camilan, kami membagikan sepiring kehangatan khas Sumatera Barat.
                                </p>
                            </div>
                            <div className="h-px w-full bg-gray-200"></div>
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Komitmen Kualitas</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Singkong kami dipanen langsung dari petani lokal terbaik. Diiris dengan ketebalan yang presisi, lalu digoreng di suhu yang sempurna. Setiap potongan keripik dibumbui dengan racikan rahasia tanpa pengawet buatan, memastikan setiap gigitan sama enaknya dengan gigitan pertama.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Kenapa Memilih Sanjai Saiyo?</h2>
                        <p className="text-gray-600">Nilai-nilai yang kami junjung tinggi dalam setiap proses produksi.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Leaf,
                                title: "100% Alami",
                                desc: "Menggunakan bahan baku singkong pilihan dan bumbu rempah asli tanpa bahan pengawet."
                            },
                            {
                                icon: Award,
                                title: "Kualitas Premium",
                                desc: "Proses seleksi ketat untuk memastikan hanya keripik bertekstur sempurna yang sampai ke tangan Anda."
                            },
                            {
                                icon: Heart,
                                title: "Resep Warisan",
                                desc: "Dibuat dengan takaran bumbu turun temurun yang menjaga keaslian rasa khas Payakumbuh."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Higienis & Aman",
                                desc: "Standar kebersihan tertinggi di setiap tahap, dari pencucian hingga pengemasan kedap udara."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
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
