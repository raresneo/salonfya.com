import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// NOTE: imagini placeholder existente. De inlocuit cu render-e Higgsfield.
const PORTRAIT = '/images/history_hero_portrait.png';
const HANDS = '/images/atelier_hands_sewing.png';
const VINTAGE = '/images/atelier_vintage.png';

const HistorySection = () => {
    return (
        <section className="bg-[#F2F0EA] text-[#1A1A1A]">
            {/* Full-bleed portrait with light overlay */}
            <div className="relative h-[85svh] overflow-hidden">
                <img src={PORTRAIT} alt="Muza Fya" className="w-full h-full object-cover object-[center_15%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F2F0EA] via-transparent to-transparent" />
                <div className="absolute bottom-10 left-6 md:left-16">
                    <h2 className="font-serif font-light italic text-white/95 tracking-tight drop-shadow-lg" style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}>Origini</h2>
                </div>
            </div>

            {/* Airy statement */}
            <div className="max-w-4xl mx-auto px-6 py-32 md:py-48 text-center">
                <motion.p
                    className="font-serif font-light leading-[1.25] tracking-[-0.01em]"
                    style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)' }}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-15%' }} transition={{ duration: 0.9, ease: EASE }}
                >
                    Fya nu este doar o semnatura, ci un <span className="italic">manifest pentru eleganta nealterata de timp.</span> Aici abandonam graba: in fiecare cusatura inseram o poveste despre devotament artizanal.
                </motion.p>
            </div>

            {/* Two editorial rows, generous */}
            <div className="max-w-[1500px] mx-auto px-6 pb-32 md:pb-48 space-y-28 md:space-y-40">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                    <div className="md:col-span-6">
                        <div className="aspect-[4/5] overflow-hidden group">
                            <img src={HANDS} alt="Maiestrie" className="w-full h-full object-cover object-center transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
                        </div>
                    </div>
                    <motion.div className="md:col-span-5 md:col-start-8"
                        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.7, ease: EASE }}>
                        <span className="block text-[10px] uppercase tracking-[0.26em] font-bold text-[#1A1A1A]/45 mb-6">01 &mdash; Maiestrie & timp</span>
                        <p className="font-serif font-light text-xl md:text-2xl leading-[1.7] text-[#1A1A1A]/80">
                            Fiecare creatie este lucrata manual, un act deliberat de rabdare care transforma materialul brut intr-o piesa perfect acordata siluetei tale.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                    <motion.div className="md:col-span-5 md:col-start-2 order-2 md:order-1"
                        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.7, ease: EASE }}>
                        <span className="block text-[10px] uppercase tracking-[0.26em] font-bold text-[#1A1A1A]/45 mb-6">02 &mdash; Materiale pure</span>
                        <p className="font-serif font-light text-xl md:text-2xl leading-[1.7] text-[#1A1A1A]/80">
                            Matase, dantela fina si o selectie obsesiva de materiale. Restul este viziune si refuzul oricarui compromis la calitatea fiecarei rochii.
                        </p>
                    </motion.div>
                    <div className="md:col-span-6 md:col-start-7 order-1 md:order-2">
                        <div className="aspect-[4/5] overflow-hidden group">
                            <img src={VINTAGE} alt="Atmosfera atelier" className="w-full h-full object-cover object-center transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HistorySection;
