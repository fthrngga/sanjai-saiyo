import { Link } from '@inertiajs/react';

export default function CategoryList({ categories }) {
    return (
        <section className="w-full py-8 border-y border-gray-100 overflow-hidden bg-white">
            {/* Scrolling container */}
            <div className="flex w-full">
                <div className="flex animate-marquee whitespace-nowrap gap-12 sm:gap-24 items-center">
                    {/* Double the list for infinite scroll effect */}
                    {[...categories, ...categories, ...categories].map((cat, idx) => (
                        <div key={`${cat.id}-${idx}`} className="flex items-center gap-2 group cursor-pointer">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 group-hover:scale-150 transition-transform duration-300"></span>
                            <span
                                className="text-3xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 hover:from-black hover:to-gray-800 transition-all duration-500 font-serif tracking-tighter"
                            >
                                {cat.nama_kategori}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
