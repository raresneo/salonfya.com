import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import FadeInSection from '../ui/FadeInSection';

const WhereToBuySection = () => {
    const locations = [
        { city: "Oradea", address: "Str. Republicii 12", phone: "+40 700 000 000" },
    ];

    return (
        <div className="py-16 md:py-20 px-6 md:px-12 max-w-[1800px] mx-auto where-to-buy bg-[#0A0A0A]">
            <SectionTitle title="Descoperă Creațiile Noi" subtitle="Destinații" centered />
            <div className="flex justify-center mt-16 max-w-5xl mx-auto">
                {locations.map((loc, idx) => (
                    <FadeInSection key={idx} delay={idx * 200}>
                        <div className="text-center p-10 md:p-14 border border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors duration-700 group bg-white">
                            <h3 className="font-serif text-3xl md:text-3xl italic text-[var(--color-text)] mb-6 group-hover:text-[#605F5F] transition-colors duration-500">{loc.city}</h3>
                            <p className="text-sm font-light text-[var(--color-secondary)] mb-2 tracking-wide">{loc.address}</p>
                            <p className="text-sm font-light text-[var(--color-secondary)] tracking-wide">{loc.phone}</p>
                            <button className="mt-8 text-[10px] uppercase tracking-wider font-bold border-b border-[var(--color-text)]/30 pb-2 text-[var(--color-text)] hover:text-[var(--color-secondary)] hover:border-[#959595] transition-all duration-500">
                                Rezervă o Programare
                            </button>
                        </div>
                    </FadeInSection>
                ))}
            </div>
        </div>
    );
};

export default WhereToBuySection;
