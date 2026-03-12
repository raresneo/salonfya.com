import React from 'react';

const Hero = () => {
    return (
        <div className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center bg-[#0A0A0A]">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <iframe
                    className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-h-screen min-w-full -translate-x-1/2 -translate-y-1/2 object-cover scale-[1.35] md:scale-110"
                    src="https://www.youtube.com/embed/SmyuMnzifn0?autoplay=1&mute=1&playsinline=1&controls=0&loop=1&playlist=SmyuMnzifn0&showinfo=0&modestbranding=1"
                    title="Fya Atelier"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ pointerEvents: 'none', filter: 'grayscale(100%)' }}
                />
                <div className="absolute inset-0 bg-black/30 z-10" />
            </div>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6">
                <p className="text-[11px] md:text-[12px] uppercase tracking-[0.4em] font-bold text-white/50 mb-6">Colecția 2026</p>
                <p className="text-[11px] md:text-[12px] uppercase tracking-[0.5em] font-bold text-white/40 mb-10 pt-4">Haute Couture · Oradea</p>
                <div className="flex justify-center items-center gap-4 mb-10">
                    <span className="w-8 h-[1px] bg-white/30"></span>
                    <p className="font-serif italic text-white/90 text-xl md:text-2xl tracking-[0.15em] drop-shadow-lg">Fancy, Young, Admired (FYA)</p>
                    <span className="w-8 h-[1px] bg-white/30"></span>
                </div>
                <p className="font-light text-white/80 text-base md:text-xl leading-[1.8] max-w-lg mx-auto px-4 md:px-0 mb-14 font-serif italic drop-shadow-md">
                    O odă adusă feminității, sculptată în mătase pură pentru momente ce devin atemporale.
                </p>
                <button
                    onClick={() => {
                        const el = document.getElementById('colectii') || document.querySelector('section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-3 border border-white/30 text-white/80 px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-[#212121] transition-all duration-500"
                >
                    Explorează Colecțiile
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" style={{ transform: 'rotate(270deg)', transformOrigin: '12px 12px' }} />
                    </svg>
                </button>
            </div>
            {/* Removed scroll indicator */}
        </div>
    );
};

export default Hero;
