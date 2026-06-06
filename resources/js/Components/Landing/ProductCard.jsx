import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export default function ProductCard({ product }) {
    const isOutOfStock = product.stok <= 0;

    return (
        <Link
            href={route('products.show', product.id)}
            className="group relative block bg-white"
        >
            <div className={`relative aspect-[4/5] overflow-hidden bg-gray-100 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}>
                {(product.gambar && product.gambar !== 'null') ? (
                    <img
                        src={`/storage/${product.gambar}`}
                        alt={product.nama_produk}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (product.variants && product.variants.length > 0 && product.variants[0].image_path) ? (
                    <img
                        src={`/storage/${product.variants[0].image_path}`}
                        alt={product.nama_produk}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Badges */}
                {isOutOfStock && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-md shadow-sm">
                            HABIS
                        </span>
                    </div>
                )}

                {/* Overlay on hover */}
                {!isOutOfStock && (
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                )}

                {/* Floating Action Button */}
                {!isOutOfStock && (
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-black">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-between items-start">
                <div className={isOutOfStock ? 'opacity-70' : ''}>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                        {product.nama_produk}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">{product.category?.nama_kategori || 'Snack'}</p>
                </div>
                <p className={`text-sm font-medium text-gray-900 ${isOutOfStock ? 'text-gray-400 line-through' : ''}`}>
                    Rp {Number(product.harga).toLocaleString('id-ID')}
                </p>
            </div>
        </Link>
    );
}
