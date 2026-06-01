import { Link } from '@inertiajs/react';

const defaultCategories = [
    { id: 1, nama_kategori: 'Keripik Sanjai' },
    { id: 2, nama_kategori: 'Kudapan Manis Tradisional' },
    { id: 3, nama_kategori: 'Kue & Bakery' },
    { id: 4, nama_kategori: 'Kerupuk & Rakik' }
];

export default function Footer({ categories = defaultCategories }) {
    // Ensure categories is an array
    const categoryList = Array.isArray(categories) ? categories : defaultCategories;

    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    <div className="max-w-sm">
                        <h2 className="text-3xl font-black tracking-tighter mb-6">SANJAI SAIYO.</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Membawa cita rasa autentik Minang ke panggung dunia. Rasakan tradisinya, nikmati kelezatan rempahnya.
                        </p>
                    </div>
                    <div className="flex gap-16 text-sm text-gray-400">
                        <div className="flex flex-col gap-4">
                            <strong className="text-white uppercase tracking-wider">Belanja</strong>
                            {categoryList.slice(0, 5).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/search?query=${encodeURIComponent(category.nama_kategori)}`}
                                    className="hover:text-white transition-colors"
                                >
                                    {category.nama_kategori}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <strong className="text-white uppercase tracking-wider">Perusahaan</strong>
                            <Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link>
                            <Link href="/contact" className="hover:text-white transition-colors">Kontak</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Sanjai Saiyo. Hak cipta dilindungi.</p>
                    <p>Diciptakan dengan dedikasi dan kebanggaan.</p>
                </div>
            </div>
        </footer>
    );
}
