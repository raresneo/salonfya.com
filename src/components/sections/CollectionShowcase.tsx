import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

type Col = { path: string; name: string; subtitle: string; image: string; };

const collections: Col[] = [
    { path: '/imperial', name: 'Imperial', subtitle: 'Eleganta regala', image: '/images/IMPERIAL/Alma/IMG_5535.jpg' },
    { path: '/anna', name: 'Anna', subtitle: 'Puritate naturala', image: '/images/ANNA/Just Anna/IMG_5889.jpg' },
    { path: '/mayra', name: 'Mayra', subtitle: 'Romantism eteric', image: '/images/MAYRA/Snow/IMG_5744.jpg' },
    { path: '/beverly', name: 'Beverly', subtitle: 'Eleganta cosmopolita', image: '/images/BEVERLY/Evora/IMG_6390.JPG' },
];

const CollectionShowcase = () => {
    const [active, setActive] = useState<number | null>(null);

    return (
        <section id="colectii" className="bg-[#0A0A0A] text-white py-24 md:py-36">
            {/* Header */}
            <div className="px-6 md:px-16 flex items-baseline justify-between flex-wrap gap-4 mb-16 md:mb-24">
                <motion.h2
                    className="font-serif italic font-light tracking-tight"
                    style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, ease: EASE }}
                >
                    Colectiile
                </motion.h2>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-white/50">Patru semnaturi, o singura casa</span>
            </div>

            {/* Editorial list */}
            <div className="relative" onMouseLeave={() => setActive(null)}>
                {collections.map((col, i) => (
                    <motion.div
                        key={col.path}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }}
                        transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}
                    >
                        <Link
                            to={col.path}
                            onMouseEnter={() => setActive(i)}
                            className="group relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[0.5fr_2fr_1fr_auto] items-center gap-6 md:gap-10 px-6 md:px-16 py-7 md:py-9 border-t border-white/12 last:border-b hover:bg-white/[0.03] transition-colors duration-500"
                        >
                            <span className="font-serif italic text-white/40 text-lg">{String(i + 1).padStart(2, '0')}</span>
                            <span className="font-serif italic font-light tracking-tight transition-transform duration-500 group-hover:translate-x-3"
                                style={{ fontSize: 'clamp(1.9rem, 5vw, 3.4rem)' }}>{col.name}</span>
                            <span className="hidden md:block text-sm text-white/50 font-light">{col.subtitle}</span>
                            <span className="w-11 h-11 border border-white/20 rounded-full grid place-items-center transition-all duration-500 group-hover:bg-white group-hover:text-[#0A0A0A]">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                        </Link>
                    </motion.div>
                ))}

                {/* Floating preview (desktop) */}
                <div className="pointer-events-none hidden lg:block absolute top-0 right-[14%] h-full w-[220px] z-20">
                    {collections.map((col, i) => (
                        <motion.div
                            key={col.path}
                            className="absolute top-1/2 left-0 w-[220px] h-[290px] overflow-hidden"
                            initial={false}
                            animate={active === i
                                ? { opacity: 1, y: '-50%', scale: 1, rotate: -2 }
                                : { opacity: 0, y: '-46%', scale: 0.92, rotate: -3 }}
                            transition={{ duration: 0.45, ease: EASE }}
                        >
                            <img src={col.image} alt={col.name} className="w-full h-full object-cover object-top" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CollectionShowcase;
