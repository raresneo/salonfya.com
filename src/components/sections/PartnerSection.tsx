import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const inputCls = 'w-full pb-3 border-b border-[#1A1A1A]/20 outline-none focus:border-[#1A1A1A] bg-transparent transition-colors font-serif text-xl';
const labelCls = 'block text-[10px] font-bold uppercase tracking-[0.16em] text-[#1A1A1A]/50 mb-3';

const PartnerSection = () => (
    <section id="parteneri" className="bg-[#F2F0EA] text-[#1A1A1A] px-6 md:px-16 py-32 md:py-48 border-t border-[#1A1A1A]/10">
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.8, ease: EASE }}
                className="mb-16"
            >
                <span className="block text-[10px] uppercase tracking-[0.28em] text-[#1A1A1A]/45 mb-8">Colaborare B2B</span>
                <h2 className="font-serif font-light italic tracking-[-0.02em] leading-[0.95]" style={{ fontSize: 'clamp(2.4rem, 7vw, 5.5rem)' }}>
                    devino partener
                </h2>
            </motion.div>

            <motion.form
                className="space-y-10"
                onSubmit={(e) => e.preventDefault()}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div><label className={labelCls}>Nume companie</label><input type="text" className={inputCls} /></div>
                    <div><label className={labelCls}>Persoana de contact</label><input type="text" className={inputCls} /></div>
                </div>
                <div><label className={labelCls}>Email</label><input type="email" className={inputCls} /></div>
                <div><label className={labelCls}>Mesaj</label><textarea className={`${inputCls} min-h-[100px] resize-none`}></textarea></div>
                <button type="submit" className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] font-medium pt-4">
                    <span className="relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-100 after:bg-[#1A1A1A] group-hover:after:scale-x-0 after:transition-transform after:duration-500">Trimite solicitarea</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
                </button>
            </motion.form>
        </div>
    </section>
);

export default PartnerSection;
