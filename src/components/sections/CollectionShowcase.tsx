import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HF } from '../../data/higgsfieldImages';

const EASE = [0.22, 1, 0.36, 1] as const;

type Col = { path: string; name: string; subtitle: string; image: string; };

const collections: Col[] = [
    { path: '/imperial', name: 'Imperial', subtitle: 'Eleganta regala', image: HF.imperial },
    { path: '/anna', name: 'Anna', subtitle: 'Puritate naturala', image: HF.anna },
    { path: '/mayra', name: 'Mayra', subtitle: 'Romantism eteric', image: HF.mayra },
    { path: '/beverly', name: 'Beverly', subtitle: 'Eleganta cosmopolita', image: HF.beverly },
];

const CollectionShowcase = () => {
    const [active, setActive] = useState<number | null>(null);

    return (
        <section id="colectii" className="bg-[#F2F0EA] text-[#1A1A1A] py-28 md:py-44">
            {/* Header, generous whitespace */}
            <div className="px-6 md:px-16 mb-20 md:mb-32">
                <motion.span
                    className="block text-[10px] uppercase tracking-[0.28em] text-[#1A1A1A]/45 mb-8"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                >Patru semnaturi, o singura casa</motion.span>
                <motion.h2
                    className="font-serif font-light italic tracking-[-0.02em] leading-[0.95]"
                    style={{ fontSize: 'clamp(2.6rem, 8vw, 7rem)' }}
                    initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: EASE }}
                >
                    colectiile
                </motion.h2>
            </div>

            {/* Editorial list */}
            <div className="relative" onMouseLeave={() => setActive(null)}>
                {collections.map((col, i) => (
                    <motion.div
                        key={col.path}
                        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                    >
                        <Link
                            to={col.path}
                            onMouseEnter={() => setActive(i)}
                            className="group relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[0.5fr_2fr_1fr_auto] items-center gap-6 md:gap-10 px-6 md:px-16 py-8 md:py-12 border-t border-[#1A1A1A]/12 last:border-b transition-colors duration-500"
                        >
                            <span className="font-serif italic text-[#1A1A1A]/35 text-lg">{String(i + 1).padStart(2, '0')}</span>
                            <span className="font-serif font-light italic tracking-[-0.01em] transition-transform duration-500 group-hover:translate-x-3"
                                style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}>{col.name}</span>
                            <span className="hidden md:block text-sm text-[#1A1A1A]/45 font-light">{col.subtitle}</span>
                            <span className="w-11 h-11 border border-[#1A1A1A]/25 rounded-full grid place-items-center transition-all duration-500 group-hover:bg-[#1A1A1A] group-hover:text-[#F2F0EA]">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                        </Link>
                    </motion.div>
                ))}

                {/* Floating preview (desktop) */}
                <div className="pointer-events-none hidden lg:block absolute top-0 right-[12%] h-full w-[230px] z-20">
                    {collections.map((col, i) => (
                        <motion.div
                            key={col.path}
                            className="absolute top-1/2 left-0 w-[230px] h-[300px] overflow-hidden"
                            initial={false}
                            animate={active === i
                                ? { opacity: 1, y: '-50%', scale: 1, rotate: -2 }
                                : { opacity: 0, y: '-46%', scale: 0.92, rotate: -3 }}
                            transition={{ duration: 0.5, ease: EASE }}
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
