import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function GuestLayout({ children, title = "Selamat Datang", subtitle = "Silakan masukkan detail Anda." }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('/img/hero_sanjai_hd.png')] bg-cover bg-center bg-fixed relative p-4 sm:p-8">
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden bg-white min-h-[650px]">
                
                {/* Left Side - Image/Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-600 to-yellow-900 flex-col justify-between p-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/img/hero_sanjai_hd.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                    
                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-amber-200 hover:text-white transition-colors mb-12 font-medium">
                            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
                        </Link>
                        <Link href="/" className="block font-black text-6xl tracking-tighter hover:opacity-80 transition-opacity">
                            SAIYO<span className="text-yellow-400">.</span>
                        </Link>
                        <p className="mt-6 text-amber-100 text-lg font-medium leading-relaxed max-w-md">
                            Temukan cita rasa otentik cemilan khas Bukittinggi dengan kualitas terbaik dan resep turun-temurun sejak lama.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white relative">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="font-black text-4xl tracking-tighter text-black">
                            SAIYO<span className="text-amber-500">.</span>
                        </Link>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
                        <p className="text-base text-gray-500 mb-8 font-medium">{subtitle}</p>
                        
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
