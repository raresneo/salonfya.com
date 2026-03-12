import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const collections = [
    {
        path: '/imperial',
        name: 'Imperial',
        subtitle: 'Eleganță Regală',
        image: '/images/IMPERIAL/Alma/IMG_5535.jpg',
        description: 'Rafinament absolut. O colecție pentru momente care definesc o viață.'
    },
    {
        path: '/anna',
        name: 'Anna',
        subtitle: 'Puritate Naturală',
        image: '/images/ANNA/Just Anna/IMG_5889.jpg',
        description: 'Atingerea naturii întâlnește couture-ul în forme organice și diafane.'
    },
    {
        path: '/mayra',
        name: 'Mayra',
        subtitle: 'Romantism Eteric',
        image: '/images/MAYRA/Snow/IMG_5744.jpg',
        description: 'Detalii fine, design modern, siluetă clasică — dedicată mireselor pasionate.'
    },
    {
        path: '/beverly',
        name: 'Beverly',
        subtitle: 'Eleganță Cosmopolită',
        image: '/images/BEVERLY/Evora/IMG_6390.JPG',
        description: 'Linii îndrăznețe cu broderii luxuriante. Modernitate și romantism în echilibru.'
    },
];

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.1) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); observer.unobserve(el); }
        }, { threshold });
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, threshold]);
    return visible;
}

const CollectionShowcase = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useInView(sectionRef);

    return (
        <section ref={sectionRef} className="py-20 md:py-32 px-6 md:px-12 bg-[#FAF8F5]">
            {/* Section Header — like Lucesposa's "NUESTRAS COLECCIONES" */}
            <div className={`text-center mb-16 md:mb-24 transition-all duration-[1.5s] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <span className="block text-[10px] uppercase tracking-[0.35em] font-bold text-[#AFA79D] mb-4">
                    Descoperiți Colecțiile Noastre
                </span>
                <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl italic text-[#212121] mb-6">
                    <span className="font-light not-italic">Fya</span>{' '}
                    <span>Colecții</span>
                </h2>
                <div className="w-20 h-px bg-[#E4E1DE] mx-auto mt-6" />
                <p className="mt-6 text-[#5a5a5a] font-light text-base md:text-lg max-w-2xl mx-auto leading-[2] tracking-wide">
                    O manifestare a frumuseții absolute. Fiecare colecție este o destinație în sine, creată pentru femeia care transformă rafinamentul într-un mod de a fi.
                </p>
            </div>

            {/* Editorial Grid — Asymmetric like Lucesposa */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {collections.map((col, i) => (
                    <Link
                        key={col.path}
                        to={col.path}
                        className={`group relative overflow-hidden transition-all duration-[2s] ease-luxury ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${i === 0 || i === 3 ? 'col-span-1 md:col-span-2 lg:col-span-2 aspect-[4/5] md:aspect-[16/9]' : 'col-span-1 aspect-[4/5] md:aspect-[3/4]'}`}
                        style={{ transitionDelay: `${200 + i * 150}ms` }}
                    >
                        <img
                            src={col.image}
                            alt={col.name}
                            className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-[2s] ease-out group-hover:scale-105 group-hover:brightness-90"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Vertical text — Lucesposa style */}
                        <span className="absolute top-8 left-6 text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 writing-vertical hidden md:block"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                            {col.subtitle}
                        </span>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                            <span className="block text-[9px] uppercase tracking-[0.25em] font-bold text-white/60 mb-2">{col.subtitle}</span>
                            <h3 className="font-serif text-3xl md:text-4xl italic mb-2 group-hover:translate-x-2 transition-transform duration-500">{col.name}</h3>
                            <p className="text-white/70 text-sm font-light max-w-sm leading-relaxed hidden md:block">{col.description}</p>
                            <span className="inline-flex items-center gap-2 mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white/80 group-hover:text-white transition-colors">
                                Explorează
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>

                        {/* Plus icon — Lucesposa style */}
                        <div className="absolute top-6 right-6 w-10 h-10 border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CollectionShowcase;
