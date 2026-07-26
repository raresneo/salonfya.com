import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const WhereToBuySection = () => {
    return (
        <section className="bg-[#F2F0EA] text-[#1A1A1A] px-6 md:px-16 py-32 md:py-48 border-t border-[#1A1A1A]/10">
            <div className="max-w-5xl mx-auto text-center">
                <motion.span
                    className="block text-[10px] uppercase tracking-[0.28em] text-[#1A1A1A]/45 mb-8"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                >Vizeaza-ne</motion.span>
                <motion.h2
                    className="font-serif font-light italic tracking-[-0.02em] leading-[0.95] mb-16"
                    style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)' }}
                    initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: EASE }}
                >
                    atelierul nostru
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.7, ease: EASE }}
                    className="inline-block"
                >
                    <p className="font-serif text-3xl md:text-4xl italic mb-4">Oradea</p>
                    <p className="text-sm font-light text-[#1A1A1A]/55 tracking-wide mb-1">Str. Republicii 12, jud. Bihor</p>
                    <p className="text-sm font-light text-[#1A1A1A]/55 tracking-wide mb-10">Luni &ndash; Sambata, cu programare</p>
                    <Link to="/programare" className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] font-medium">
                        <span className="relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-[#1A1A1A] group-hover:after:scale-x-0 after:transition-transform after:duration-500">Programeaza o proba</span>
                        <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default WhereToBuySection;
