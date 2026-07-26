import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HF } from '../../data/higgsfieldImages';

const HERO_IMAGE = HF.hero;

const EASE = [0.22, 1, 0.36, 1] as const;

const riseParent = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } };
const riseChild = { hidden: { y: '115%' }, show: { y: '0%', transition: { duration: 1.0, ease: EASE } } };

const Hero = () => {
    const [pct, setPct] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            setPct(h > 0 ? Math.round((window.scrollY / h) * 100) : 0);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <section className="relative min-h-[100svh] w-full bg-[#F2F0EA] text-[#1A1A1A] flex flex-col">
            {/* Top line: brand whisper */}
            <div className="flex items-center justify-between px-6 md:px-16 pt-28 md:pt-32">
                <motion.span
                    className="text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/50"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.1 }}
                >Atelier de rochii de mireasa</motion.span>
                <motion.span
                    className="text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/50"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
                >Oradea, 2026</motion.span>
            </div>

            {/* Massive thin display headline */}
            <div className="flex-1 flex items-center px-6 md:px-16">
                <motion.h1
                    className="font-serif font-light leading-[0.95] tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(3rem, 9vw, 9.5rem)' }}
                    variants={riseParent} initial="hidden" animate="show"
                >
                    <span className="block overflow-hidden"><motion.span className="block" variants={riseChild}>unde rochia ta</motion.span></span>
                    <span className="block overflow-hidden"><motion.span className="block" variants={riseChild}>de mireasa</motion.span></span>
                    <span className="block overflow-hidden"><motion.span className="block italic" variants={riseChild}>prinde viata.</motion.span></span>
                </motion.h1>
            </div>

            {/* Bottom row: intro + cta + scroll counter */}
            <div className="px-6 md:px-16 pb-10 md:pb-14 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-8 md:gap-16 items-end">
                <motion.p
                    className="max-w-sm text-sm md:text-base font-light leading-relaxed text-[#1A1A1A]/70"
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
                >
                    Un atelier de rochii de mireasa premium si unicat. Design, executie si ajustari facute in intregime la noi, in Oradea.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}>
                    <Link to="/programare" className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] font-medium">
                        <span className="relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-[#1A1A1A] group-hover:after:scale-x-0 after:transition-transform after:duration-500">Programeaza o proba</span>
                        <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                </motion.div>

                <div className="font-serif text-sm tabular-nums text-[#1A1A1A]/40 justify-self-start md:justify-self-end">
                    {String(pct).padStart(2, '0')} / 100
                </div>
            </div>

            {/* Taller image band, positioned to show the full silhouette head-to-hem */}
            <motion.div
                className="relative w-full h-[56svh] md:h-[64svh] overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
            >
                <motion.img
                    src={HERO_IMAGE} alt="Rochie de mireasa Fya"
                    className="w-full h-full object-cover object-[center_20%]"
                    initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}
                />
            </motion.div>
        </section>
    );
};

export default Hero;
