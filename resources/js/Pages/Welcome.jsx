import Navbar from '@/Components/Landing/Navbar';
import HeroCarousel from '@/Components/Landing/HeroCarousel';
import CategoryList from '@/Components/Landing/CategoryList';
import ProductGrid from '@/Components/Landing/ProductGrid';
import { Head } from '@inertiajs/react';

export default function Welcome({ auth, products, categories }) {
    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 antialiased">
            <Head title="Welcome" />

            <Navbar />

            <main>
                <HeroCarousel />

                <div className="mt-8">
                    <CategoryList categories={categories} />
                </div>

                <ProductGrid title="Rekomendasi Pilihan" products={products} />

                {/* Footer or other sections can go here */}
                <footer className="bg-white border-t border-gray-200 mt-12 py-8">
                    <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Sanjai Saiyo. All rights reserved.
                    </div>
                </footer>
            </main>
        </div>
    );
}
