export default function CategoryList({ categories }) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Kategori</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className="min-w-[120px] px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all font-medium text-gray-700 whitespace-nowrap"
                    >
                        {cat.nama_kategori}
                    </button>
                ))}
            </div>
        </section>
    );
}
