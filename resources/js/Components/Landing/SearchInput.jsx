import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function SearchInput({ className = "" }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const searchRef = useRef(null);

    // Initialize recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sanjai_recent_searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }

        // Fetch recommendations
        fetch('/api/search/recommended')
            .then(res => res.json())
            .then(data => setRecommended(data))
            .catch(err => console.error('Failed to load recommendations', err));
    }, []);

    // Handle click outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) return;

        // Save to history
        const newHistory = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(newHistory);
        localStorage.setItem('sanjai_recent_searches', JSON.stringify(newHistory));

        setIsOpen(false);
        setQuery(searchTerm);

        // Redirect to actual search page
        console.log("Searching for:", searchTerm);
        router.visit(route('search.index', { query: searchTerm }));
    };

    const removeHistoryItem = (e, item) => {
        e.stopPropagation();
        const newHistory = recentSearches.filter(i => i !== item);
        setRecentSearches(newHistory);
        localStorage.setItem('sanjai_recent_searches', JSON.stringify(newHistory));
    };

    return (
        <div ref={searchRef} className={`relative flex-1 max-w-lg ${className}`}>
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Cari keripik, sanjai..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    className="w-full pl-5 pr-12 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-full transition-all duration-300 shadow-sm text-sm font-medium"
                />
                <button
                    onClick={() => handleSearch(query)}
                    className="absolute right-2 top-2 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {/* Dropdown Result */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                        {/* History Section */}
                        {recentSearches.length > 0 && (
                            <div className="mb-4">
                                <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    Riwayat Pencarian
                                </h3>
                                <div className="space-y-0.5">
                                    {recentSearches.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleSearch(item)}
                                            className="group flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                                        >
                                            <span className="text-sm text-gray-600 font-medium group-hover:text-black">{item}</span>
                                            <button
                                                onClick={(e) => removeHistoryItem(e, item)}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Popular / Recommended Section */}
                        {recommended.length > 0 && (
                            <div>
                                <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3" />
                                    Paling Populer
                                </h3>
                                <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                                    {recommended.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-100"
                                            onClick={() => console.log("Navigate to product", product.id)}
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                {product.gambar ? (
                                                    <img
                                                        src={`/storage/${product.gambar}`}
                                                        alt={product.nama_produk}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Search className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-700 group-hover:text-black truncate">{product.nama_produk}</h4>
                                                <p className="text-xs text-gray-400 font-medium">Rp {product.harga?.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Action */}
                        <div className="p-2 mt-1 border-t border-gray-50">
                            <button className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors">
                                Lihat Rekomendasi Lainnya
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
