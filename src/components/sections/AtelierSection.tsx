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
    <section id="atelier" className="bg-[#F2F0EA] text-[#1A1A1A]">
        {/* Manifesto, huge and airy (Vero-style statement) */}
        <div className="px-6 md:px-16 py-32 md:py-52 max-w-5xl">
            <motion.p
                className="font-serif font-light leading-[1.2] tracking-[-0.01em]"
                style={{ fontSize: 'clamp(1.7rem, 4.5vw, 3.6rem)' }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }} transition={{ duration: 0.9, ease: EASE }}
            >
                Cele mai multe saloane vand rochii facute in alta parte. Noi le <span className="italic">gandim, le coasem si le potrivim</span> la noi in atelier, ca fiecare mireasa sa poarte ceva ce nu mai exista nicaieri.
            </motion.p>
        </div>

        {/* Split: sticky visual + steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative lg:sticky lg:top-0 h-[60svh] lg:h-[100svh] overflow-hidden">
                <img src={ATELIER_IMAGE} alt="Atelier Fya" className="w-full h-full object-cover" />
                <span className="absolute bottom-8 left-8 font-serif italic text-2xl text-white drop-shadow-lg">In atelier, Oradea</span>
            </div>

            <div className="px-6 md:px-16 py-24 md:py-40">
                <motion.span
                    className="block text-[10px] uppercase tracking-[0.28em] text-[#1A1A1A]/45 mb-8"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.7 }}
                >Cum lucram</motion.span>

                <motion.h2
                    className="font-serif font-light leading-[1.05] tracking-[-0.01em] mb-14"
                    style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
                    initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.7, ease: EASE }}
                >
                    Totul se intampla <span className="italic">in acelasi loc.</span>
                </motion.h2>

                <div>
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.n}
                            className="grid grid-cols-[auto_1fr] gap-6 py-7 border-t border-[#1A1A1A]/12 last:border-b items-baseline"
                            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                        >
                            <span className="font-serif italic text-[#1A1A1A]/40 text-base">{s.n}</span>
                            <div>
                                <span className="block font-serif text-2xl mb-1">{s.title}</span>
                                <p className="text-[#1A1A1A]/55 font-light text-sm md:text-base">{s.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default AtelierSection;
