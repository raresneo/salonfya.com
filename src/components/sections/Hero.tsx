import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// NOTE: imagine placeholder din assets existente. De inlocuit cu render Higgsfield.
const HERO_IMAGE = '/images/IMPERIAL/Alma/IMG_5535.jpg';

const EASE = [0.22, 1, 0.36, 1] as const;

const riseParent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const riseChild = {
    hidden: { y: '110%' },
    show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
};

const Hero = () => {
    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-[#0A0A0A] flex items-end">
            {/* Background image, subtle slow ken-burns */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.2, ease: EASE }}
            >
                <img
                    src={HERO_IMAGE}
                    alt="Rochie de mireasa Fya"
                    className="w-full h-full object-cover object-center"
                    style={{ filter: 'grayscale(12%) contrast(1.02)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 w-full px-6 md:px-16 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:pb-20">
                <motion.p
                    className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-bold text-white/60 mb-6"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                >
                    Atelier de rochii de mireasa · Oradea
                </motion.p>

                <motion.h1
                    className="font-serif text-white leading-[0.92] tracking-tight"
                    style={{ fontSize: 'clamp(3.4rem, 11vw, 11rem)' }}
                    variants={riseParent}
                    initial="hidden"
                    animate="show"
                >
                    <span className="block overflow-hidden"><motion.span className="block" variants={riseChild}>Croita</motion.span></span>
                    <span className="block overflow-hidden"><motion.span className="block italic font-light" variants={riseChild}>pentru</motion.span></span>
                    <span className="block overflow-hidden"><motion.span className="block" variants={riseChild}>tine.</motion.span></span>
                </motion.h1>

                <motion.div
                    className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
                >
                    <p className="text-white/80 font-light text-base md:text-lg max-w-md leading-relaxed">
                        Design, executie si ajustari, toate in atelierul nostru. Nimic externalizat. Singura limita e imaginatia ta.
                    </p>
                    <Link
                        to="/programare"
                        className="group relative inline-flex items-center gap-3 overflow-hidden border border-white/25 px-9 py-4 text-[11px] uppercase tracking-[0.16em] font-bold text-white self-start md:self-auto"
                    >
                        <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                        <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-500">Programeaza o proba</span>
                        <span className="relative z-10 group-hover:text-[#0A0A0A] transition-all duration-500 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
