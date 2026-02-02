import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function HeroCarousel() {
    const slides = [
        "bg-gray-200",
        "bg-gray-300",
        "bg-gray-400"
    ]; // Placeholders for now

    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    const next = () => setCurrent((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

    return (
        <div className="relative w-full max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-xl shadow-lg relative h-64 md:h-96 bg-gray-100 group">
                <div
                    className="flex transition-transform ease-out duration-500 h-full"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((bgClass, i) => (
                        <div key={i} className={`min-w-full h-full flex items-center justify-center ${bgClass}`}>
                            <span className="text-4xl font-bold text-gray-500 opacity-25">Slide {i + 1}</span>
                        </div>
                    ))}
                </div>

                {/* Arrow Buttons */}
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full shadow-md transition-all hidden group-hover:block">
                    <ChevronLeft size={30} />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full shadow-md transition-all hidden group-hover:block">
                    <ChevronRight size={30} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {slides.map((_, i) => (
                        <div key={i} className={`transition-all w-2 h-2 bg-white rounded-full ${current === i ? "p-1.5" : "bg-opacity-50"}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
