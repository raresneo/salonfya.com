import React from 'react';
import FadeInSection from '../ui/FadeInSection';
import { Dress, DressType } from '../../types';

const ProductCard: React.FC<{ dress: Dress, onClick: () => void, index: number }> = ({ dress, onClick, index }) => {
    return (
        <FadeInSection delay={index * 100}>
            <div
                onClick={onClick}
                className="group cursor-pointer flex flex-col gap-6 h-full active-scale"
                data-cursor-text="DESCOPERĂ"
            >
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm flex items-center justify-center bg-[var(--color-bg-secondary)]">
                    <img
                        src={dress.imageUrl}
                        alt={dress.name}
                        loading="lazy"
                        className={`w-full h-full object-contain transition-all duration-[1.5s] ease-out group-hover:scale-105 vintage-pastel mix-blend-multiply ${dress.id.includes('alma') ? 'logo-mask' : ''}`}
                    />

                    {/* Minimal Overlay */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500"></div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4">
                        {dress.type === DressType.RENT && (
                            <span className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-[var(--color-text)]">Rent</span>
                        )}
                    </div>
                </div>

                <div className="text-center space-y-2 md:space-y-3">
                    <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-[var(--color-secondary)] block">{dress.collection}</span>
                    <h3 className="font-serif text-[28px] md:text-3xl text-[var(--color-text)] italic group-hover:text-[#605F5F] transition-colors leading-none">{dress.name}</h3>
                    <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--color-text)] pt-1">
                        {dress.type === DressType.RENT
                            ? `de la ${dress.rentPrice} ${dress.currency || '€'}`
                            : `${dress.price} ${dress.currency || '€'}`}
                    </p>
                </div>
            </div>
        </FadeInSection>
    );
};

export default ProductCard;
