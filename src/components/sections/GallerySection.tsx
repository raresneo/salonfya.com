import React from 'react';
import { motion } from 'framer-motion';
import { HF_GALLERY } from '../../data/higgsfieldImages';

const EASE = [0.22, 1, 0.36, 1] as const;

// Inaltimi variate pentru un grid mozaic (stil Vero), nu uniform.
const spans = ['row-span-2', '', '', 'row-span-2', '', 'row-span-2', '', '', 'row-span-2', '', '', 'row-span-2', '', ''];

const GallerySection = () => {
    return (
        <section className="bg-[#F2F0EA] text-[#1A1A1A] px-6 md:px-16 py-32 md:py-48">
            {/* Vero-style mixed headline: italic serif lowercase + uppercase sans */}
            <motion.h2
                className="text-center leading-[1.05] mb-20 md:mb-28"
                initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12%' }} transition={{ duration: 0.8, ease: EASE }}
            >
                <span className="font-serif italic font-light" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>fiecare rochie, </span>
                <span className="font-sans font-light uppercase tracking-[0.02em]" style={{ fontSize: 'clamp(1.7rem, 5vw, 4.2rem)' }}>o piesa unica.</span>
            </motion.h2>

            {/* Dense mosaic grid */}
            <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
                {HF_GALLERY.map((src, i) => (
                    <motion.div
                        key={src}
                        className={`overflow-hidden group ${spans[i % spans.length]}`}
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-4%' }}
                        transition={{ duration: 0.5, ease: EASE, delay: (i % 4) * 0.05 }}
                    >
                        <img
                            src={src}
                            alt={`Rochie Fya ${i + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover object-center transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;
