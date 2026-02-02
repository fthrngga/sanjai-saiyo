import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    return (
        <Link
            href={route('products.show', product.id)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group"
        >
            <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {product.gambar ? (
                    <img
                        src={`/storage/${product.gambar}`}
                        alt={product.nama_produk}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="text-gray-400 font-medium">No Image</div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 mb-2 group-hover:text-black transition-colors">{product.nama_produk}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{product.deskripsi}</p>
                <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-lg text-black">
                        Rp {product.harga.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
