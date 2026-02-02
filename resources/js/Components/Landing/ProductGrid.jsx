import ProductCard from './ProductCard';

export default function ProductGrid({ title, products }) {
    return (
        <section className="w-full px-6 md:px-12 py-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button className="text-sm font-medium text-gray-500 hover:text-black">Lihat Semua</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
