import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import FadeInSection from '../ui/FadeInSection';
import Button from '../ui/Button';

const PartnerSection = () => (
    <div id="parteneri" className="py-16 md:py-20 bg-[#0A0A0A] border-t border-[#333333]">
        <div className="max-w-4xl mx-auto px-6">
            <SectionTitle title="Devino Partener" subtitle="B2B Collaboration" centered />
            <FadeInSection>
                <form className="partner-form mt-12 space-y-8 bg-white p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.03)] border border-[var(--color-border)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">Nume Companie</label>
                            <input type="text" className="w-full pb-2 border-b border-[var(--color-border)] outline-none focus:border-[var(--color-text)] bg-transparent transition-colors font-serif text-xl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">Persoană de Contact</label>
                            <input type="text" className="w-full pb-2 border-b border-[var(--color-border)] outline-none focus:border-[var(--color-text)] bg-transparent transition-colors font-serif text-xl" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">Email Official</label>
                        <input type="email" className="w-full pb-2 border-b border-[var(--color-border)] outline-none focus:border-[var(--color-text)] bg-transparent transition-colors font-serif text-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">Mesaj</label>
                        <textarea className="w-full pb-2 border-b border-[var(--color-border)] outline-none focus:border-[var(--color-text)] bg-transparent transition-colors font-serif text-xl min-h-[100px] resize-none"></textarea>
                    </div>
                    <div className="text-center pt-8">
                        <Button variant="primary" className="w-full md:w-auto">Trimite Solicitarea</Button>
                    </div>
                </form>
            </FadeInSection>
        </div>
    </div>
);

export default PartnerSection;
