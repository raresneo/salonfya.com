import React from 'react';
import FadeInSection from './FadeInSection';

// Section Title Component adhering to the responsive font sizes from the dataset
const SectionTitle = ({ title, subtitle, centered = false }: { title: string, subtitle?: string, centered?: boolean }) => (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
        <FadeInSection>
            {subtitle && (
                <span className="block text-[11px] uppercase tracking-[0.3em] text-white/60 mb-6 font-bold">
                    {subtitle}
                </span>
            )}
            <h2 className="hero-title text-white">
                {title}
            </h2>
        </FadeInSection>
    </div>
);

export default SectionTitle;
