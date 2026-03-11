import React, { useState, useRef, useEffect } from 'react';

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.2) {
    const [v, setV] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref, threshold]);
    return v;
}

const CinematicSection = () => {
    const ref = useRef<HTMLElement>(null);
    const isVisible = useInView(ref);
    const [playing, setPlaying] = useState(false);

    return (
        <section ref={ref} className="relative bg-[#0A0A0A] overflow-hidden">
            {/* Video / Static background */}
            <div className="relative aspect-video max-h-[80vh] w-full overflow-hidden">
                {!playing ? (
                    <>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src="/images/CINEMATIC.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/40" />
                    </>
                ) : (
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/SmyuMnzifn0?autoplay=1&mute=1&controls=1&rel=0&playsinline=1"
                        title="Fya Cinematic"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ filter: 'grayscale(100%)' }}
                    />
                )}

                {/* Overlay Content */}
                {!playing && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-[2s] ease-luxury ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <span className="text-[11px] md:text-[12px] uppercase tracking-[0.35em] font-bold text-white/50 mb-6">Experiēnța</span>
                        <h2 className="font-serif text-5xl md:text-6xl lg:text-[5.5rem] italic text-white text-center mb-6 px-4 md:px-0 leading-[1.05] tracking-tight">
                            Atelier Fya
                        </h2>
                        <p className="text-white/70 font-light text-base md:text-lg max-w-lg text-center leading-[1.8] px-6 md:px-0 mb-12 font-serif italic">
                            O privire în universul nostru. Unde timpul încetinește, iar pasiunea, arta și lumina devin a doua piele.
                        </p>

                        {/* Play button — circular, Lucesposa style */}
                        <button
                            onClick={() => setPlaying(true)}
                            className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center hover:border-white transition-all duration-500 group hover:scale-110"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="ml-1 group-hover:scale-110 transition-transform">
                                <polygon points="6,3 20,12 6,21" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CinematicSection;
