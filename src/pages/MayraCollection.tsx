import React from 'react';
import { Dress } from '../types';
import CollectionGrid from '../components/sections/CollectionGrid';

interface MayraCollectionProps {
    dresses: Dress[];
    onOpenDetails: (dress: Dress) => void;
}

export default function MayraCollection({ dresses, onOpenDetails }: MayraCollectionProps) {
    return (
        <div className="bg-[var(--color-bg-secondary)] min-h-screen pb-20">
            {/* Cinematic Editorial Header */}
            <div className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                <video
                    src="/images/MAYRA/colectia%20mayra.mp4"
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center animate-fadeInUp-slow"
                />

                <div className="relative z-20 text-center px-6 mt-20 animate-fadeInUp-slow" style={{ animationDelay: '0.2s' }}>
                    <span className="block text-[10px] md:text-[11px] uppercase tracking-wider font-bold text-white/80 mb-6 drop-shadow-md">Romantism Eteric</span>
                    <h1 className="font-serif text-6xl md:text-8xl lg:text-[9rem] text-white italic mb-6 leading-[0.85] drop-shadow-lg">
                        Colecția Mayra
                    </h1>
                    <p className="font-light text-white/90 text-base md:text-lg leading-[2] max-w-xl mx-auto drop-shadow-md">
                        Rochii spectaculoase ce combină detaliile fine cu un design modern și o siluetă clasică.
                        Dedicată miresei pasionale, rafinate și mereu memorabile.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto mt-20">

                <CollectionGrid dresses={dresses} onOpenDetails={onOpenDetails} bgColor="transparent" />
            </div>
        </div>
    );
}
