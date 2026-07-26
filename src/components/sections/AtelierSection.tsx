import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// NOTE: imagine placeholder existenta. De inlocuit cu render Higgsfield (atelier).
const ATELIER_IMAGE = '/images/detaliile_fac_diferenta.jpeg';

const steps = [
    { n: '01', title: 'Proba & discutia', text: 'Ne spui ce iti doresti, vedem impreuna ce ti se potriveste.' },
    { n: '02', title: 'Schita & masurile', text: 'Desenam modelul impreuna si luam masurile exacte.' },
    { n: '03', title: 'Executia in atelier', text: 'Croim rochia de la zero, cu materialele alese de tine.' },
    { n: '04', title: 'Ajustarile finale', text: 'Potrivim tot ce e nevoie, pana e perfecta pe tine.' },
];

const AtelierSection = () => (
    <section id="atelier" className="bg-[#0A0A0A] text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Sticky visual */}
            <div className="relative lg:sticky lg:top-0 h-[60svh] lg:h-[100svh] overflow-hidden">
                <img src={ATELIER_IMAGE} alt="Atelier Fya" className="w-full h-full object-cover" style={{ filter: 'grayscale(15%)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-8 left-8 font-serif italic text-2xl text-white/90">In atelier, Oradea</span>
            </div>

            {/* Text + steps */}
            <div className="px-6 md:px-16 py-24 md:py-36">
                <motion.span
                    className="block text-[10px] uppercase tracking-[0.26em] font-bold text-white/50 mb-7"
                    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.5, ease: EASE }}
                >Cum lucram</motion.span>

                <motion.h2
                    className="font-serif font-light leading-[1.05] tracking-tight mb-12"
                    style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}
                    initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.6, ease: EASE }}
                >
                    Totul se intampla <span className="italic text-[#C5A880]">in acelasi loc.</span>
                </motion.h2>

                <div>
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.n}
                            className="grid grid-cols-[auto_1fr] gap-6 py-6 border-t border-white/12 last:border-b items-baseline"
                            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                        >
                            <span className="font-serif italic text-[#C5A880] text-base">{s.n}</span>
                            <div>
                                <span className="block font-serif text-2xl mb-1">{s.title}</span>
                                <p className="text-white/55 font-light text-sm md:text-base">{s.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default AtelierSection;
