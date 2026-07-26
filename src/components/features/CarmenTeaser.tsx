import React from 'react';

const CarmenTeaser = ({ onOpen }: { onOpen: () => void }) => {
    return (
        <div className="relative w-full h-[80vh] overflow-hidden group cursor-pointer" onClick={onOpen}>
            <img
                src="/images/carmen_model_front_v2.png" // Updated to use the new high quality image
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 vintage-pastel"
                alt="Carmen Collection"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-700"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                <div className="bg-white/10 backdrop-blur-md p-10 md:p-16 border border-white/30 transform transition-transform duration-700 group-hover:-translate-y-4">
                    <span className="text-[10px] uppercase tracking-wider mb-4 block animate-fadeInUp">Colecție Nouă</span>
                    <h2 className="font-serif text-6xl md:text-7xl italic mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>Carmen</h2>
                    <span className="text-[10px] uppercase tracking-wider border-b border-white/50 pb-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>Fit-and-Free</span>
                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        <span className="text-[10px] bg-white text-[var(--color-text)] px-6 py-3 uppercase tracking-wider font-bold">Descoperă Povestea</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarmenTeaser;
