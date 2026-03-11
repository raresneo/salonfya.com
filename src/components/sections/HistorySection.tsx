import React, { useState, useEffect, useRef } from 'react';

const useScrollProgress = (ref: React.RefObject<HTMLElement>) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const start = windowHeight * 0.9;
            const end = windowHeight * 0.4;
            const elementTop = rect.top;
            let p = (start - elementTop) / (start - end);
            p = Math.min(Math.max(p, 0), 1);
            setProgress(p);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref]);

    return progress;
};

const ScrollTextReveal = ({ text, className = "" }: { text: string, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const progress = useScrollProgress(ref);
    const words = text.split(" ");

    return (
        <p ref={ref} className={`${className} flex flex-wrap gap-[0.3em]`}>
            {words.map((word, i) => {
                const wordProgress = (progress * words.length) - i;
                const opacity = Math.min(Math.max(wordProgress + 0.2, 0.2), 1);
                return (
                    <span key={i} style={{ opacity, transition: 'opacity 0.1s' }}>{word}</span>
                );
            })}
        </p>
    );
};

const HistorySection = () => {
    return (
        <div className="bg-[#0A0A0A] text-white py-40 transition-colors duration-1000 relative z-10">
            <div className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-40">
                <div className="lg:col-span-12 relative h-[80vh] overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    <img src="/images/history_hero_portrait.png" className="w-full h-full object-cover object-top parallax-y" alt="Fya Muse" />
                    <div className="absolute bottom-12 left-6 md:left-12 z-20">
                        <h2 className="font-serif text-6xl md:text-[8rem] leading-none text-white mix-blend-difference opacity-90">Origins</h2>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-6 mb-40">
                <ScrollTextReveal
                    text="Fya Atelier nu este doar o semnătură, ci un manifest pentru eleganța nealterată de timp. O rebeliune tăcută împotriva zgomotului cotidian. Aici, abandonăm graba. În fiecare cusătură inserăm o poveste despre devotament artizanal și tăcerea materialelor pure."
                    className="font-serif text-3xl md:text-5xl leading-relaxed text-center text-[#E4E1DE] md:text-[#E4E1DE]"
                />
            </div>
            <div className="max-w-[1600px] mx-auto px-6 space-y-32 mb-40">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 md:col-start-2">
                        <div className="aspect-[4/5] overflow-hidden relative group rounded-sm">
                            <img src="/images/atelier_hands_sewing.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] ease-out group-hover:scale-105" alt="Craftsmanship" />
                        </div>
                    </div>
                    <div className="md:col-span-4 md:col-start-8">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#E4E1DE] mb-6">01. Măiestrie & Timp</h3>
                        <p className="font-light text-[#E4E1DE] md:text-[#959595] text-lg leading-[2] editorial-dropcap">
                            Refuzăm ritmul impus de tendințele secunde. Fiecare creație care ne poartă eticheta este sculptată manual pe de manechin, un act deliberat de răbdare care transformă mătasea brută într-o armură a feminității, perfect acordată siluetei tale.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-4 md:col-start-2 order-2 md:order-1">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#E4E1DE] mb-6">02. Materialitate Pură</h3>
                        <p className="font-light text-[#E4E1DE] md:text-[#959595] text-lg leading-[2]">
                            Mătasea, dantela prețioasă și o selecție obsesivă decurată de materiale organice sunt singurele noastre instrumente. Restul este viziune absolută și refuzul oricărui compromis atunci când vine vorba de calitatea tactilă a fiecărei rochii.
                        </p>
                    </div>
                    <div className="md:col-span-5 md:col-start-7 order-1 md:order-2">
                        <div className="aspect-[4/5] overflow-hidden relative group rounded-sm">
                            <img src="/images/atelier_vintage.png" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[2s] ease-out group-hover:scale-105 vintage-pastel" alt="Atelier Atmosphere" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-[80vh] overflow-hidden mt-20">
                <iframe
                    className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-h-screen min-w-full -translate-x-1/2 -translate-y-1/2 object-cover scale-[1.35] md:scale-110 opacity-70"
                    src="https://www.youtube.com/embed/SmyuMnzifn0?autoplay=1&mute=1&playsinline=1&controls=0&loop=1&playlist=SmyuMnzifn0&showinfo=0&modestbranding=1"
                    title="Fya Cinematic"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ pointerEvents: 'none', filter: 'grayscale(100%)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <h2 className="font-serif text-[12vw] md:text-[8vw] italic text-white mix-blend-overlay tracking-tight drop-shadow-2xl">Atelier Fya</h2>
                </div>
            </div>
        </div>
    );
};

export default HistorySection;
