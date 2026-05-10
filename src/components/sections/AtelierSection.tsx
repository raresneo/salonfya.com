import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import FadeInSection from '../ui/FadeInSection';

const AtelierSection = () => (
    <div id="atelier" className="py-16 md:py-20 bg-[#0A0A0A] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 space-y-16">
                <FadeInSection>
                    <SectionTitle title="Atelierul de Creație" subtitle="Meșteșug & Inovație" />
                    <p className="text-[#E4E1DE] md:text-[var(--color-secondary)] font-light leading-[2] text-base md:text-lg max-w-xl mt-12 editorial-dropcap">
                        În atelierul Fya, am renunțat la grabă. Fiecare rochie este o pânză pe care o pictăm cu sute de ore de muncă manuală, îmbinând tradiția artizanală cu o precizie aproape arhitecturală.
                        Avem o singură credință: piesele de colecție transcend tendințele sezoniere.
                    </p>
                    <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/20 mt-12">
                        <div>
                            <span className="block text-5xl md:text-6xl font-serif italic mb-3">100%</span>
                            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Mătase Pură</span>
                        </div>
                        <div>
                            <span className="block text-5xl md:text-6xl font-serif italic mb-3">Oradea</span>
                            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Concept & Creație</span>
                        </div>
                    </div>
                </FadeInSection>
            </div>
            <div className="order-1 lg:order-2 relative aspect-square">
                <FadeInSection delay={300}>
                    <div className="w-full h-full relative overflow-hidden">
                        <img
                            src="/images/detaliile_fac_diferenta.jpeg"
                            className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-[2s] vintage-pastel"
                            alt="Atelier detail"
                        />
                        <div className="absolute bottom-12 right-12 text-right">
                            <p className="font-serif text-3xl italic">"Detaliile fac perfecțiunea."</p>
                            <p className="text-[10px] uppercase tracking-wider mt-4 opacity-50">Leonardo da Vinci</p>
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </div>
    </div>
);

export default AtelierSection;
