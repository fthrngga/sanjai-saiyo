import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Landing/Navbar';
import Footer from '@/Components/Landing/Footer';
import { MapPin, Phone } from 'lucide-react';

export default function Contact() {
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
                                            <h4 className="font-bold text-lg mb-1">Lokasi Toko</h4>
                                            <p className="text-gray-600 leading-relaxed">
                                                Sanjai Saiyo<br />
                                                Ketinggian, Sarilamak, Kec. Harau,<br />
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
                                </div>
                            </div>
                        </div>

                        {/* Map Column */}
                        <div className="h-[400px] lg:h-auto rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 bg-gray-50">
                            <iframe 
                                src="https://maps.google.com/maps?q=-0.14651638824842017,100.6814796348945+(Sanjai%20Saiyo)&t=&z=16&ie=UTF8&iwloc=B&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{border:0, minHeight: '400px'}} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}
