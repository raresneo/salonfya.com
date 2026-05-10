import React from 'react';
import Button from '../ui/Button';
import ImageGallery from './ImageGallery';

const CarmenFullPage = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#FAFAFA] animate-fadeInUp overflow-y-auto scrollbar-hide">
            {/* Navigation / Close - Floating */}
            <div className="fixed top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center mix-blend-difference text-white">
                <span className="font-serif text-2xl italic tracking-wider uppercase">Fya Atelier</span>
                <button onClick={onClose} className="group flex items-center gap-2 text-[11px] uppercase tracking-wider hover:text-gray-300 transition-colors">
                    <span>Închide</span>
                    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        ✕
                    </div>
                </button>
            </div>

            {/* 1. Cinematic Hero Section */}
            <div className="relative w-full h-screen bg-black">
                <video
                    ref={(el) => {
                        if (el) {
                            el.playbackRate = 0.5; // Slow motion
                        }
                    }}
                    className="w-full h-full object-cover grayscale"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={(e) => {
                        e.currentTarget.currentTime = 7; // Start from 7s
                    }}
                >
                    <source src="/images/CINEMATIC.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Centered Overlay Title */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h1 className="font-serif text-[15vw] leading-none italic opacity-90 mix-blend-overlay">Carmen</h1>
                    <p className="text-[12px] uppercase tracking-wider mt-4 font-light mix-blend-overlay">Noua Colecție 2025</p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/80 animate-bounce">
                    <span className="text-[10px] uppercase tracking-wider">Descoperă</span>
                </div>
            </div>

            {/* 2. Editorial Content Section - Ninfa Style */}
            <div className="bg-white text-[var(--color-text)] relative">

                {/* Section 1: Sketch & Intro */}
                <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center">
                    {/* Left: Graphic/Sketch - Centered with plenty of white space */}
                    <div className="h-full bg-[#FAFAFA] flex items-center justify-center p-12 lg:p-24 order-2 lg:order-1">
                        <div className="relative w-full max-w-lg">
                            <span className="absolute -top-12 left-0 text-4xl text-[var(--color-text)]">✦</span>
                            <img
                                src="/images/carmen_sketch_triptych.png"
                                className="w-full h-auto mix-blend-multiply opacity-90"
                                alt="Carmen Sketch"
                            />
                            <div className="mt-8 flex justify-between items-end border-t border-[var(--color-text)]/20 pt-4">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-secondary)]">Fig 1.</span>
                                <span className="font-serif italic text-sm text-[var(--color-secondary)]">Technical View</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Typography */}
                    <div className="h-full flex flex-col justify-center p-12 lg:p-32 order-1 lg:order-2">
                        <h2 className="font-serif text-4xl lg:text-5xl leading-[1.2] text-[var(--color-text)] uppercase tracking-wider font-light mb-12">
                            Colecția Carmen <br />
                            <span className="text-[var(--color-secondary)]">Întruchipează frumusețea</span> <br />
                            fiecărei femei.
                        </h2>

                        <div className="space-y-8 text-[#605F5F] font-light leading-relaxed text-sm md:text-base text-justify">
                            <p>
                                Prezența ei se simte ca o adiere caldă, o siluetă ce captează privirile prin simplitate și rafinament.
                                Corsetul cu decolteu în V îmbrățișează formele, decorat cu o broderie florală prețioasă ce pare să crească organic pe piele.
                            </p>
                            <p>
                                În această colecție, o atenție deosebită este acordată detaliilor care transformă o rochie într-o poveste.
                                Fusta fluidă din tulle și trenă diafană oferă o notă de mister și tandrețe, un echilibru perfect între clasic și modern.
                            </p>


                            {/* Distinctive Elements - Visual Grid (Refactored) */}
                            <div className="pt-12 mt-12 border-t border-[var(--color-border)]">
                                <span className="block text-[10px] uppercase tracking-wider font-bold text-[var(--color-text)] mb-8">Elemente Distinctive</span>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Visual Item 1: Corset */}
                                    <div className="space-y-3">
                                        <div className="aspect-[3/4] overflow-hidden bg-[#FAFAFA]">
                                            <img src="/images/carmen_model_detail_v2.png" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Corset Detail" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] uppercase tracking-wider text-[var(--color-secondary)]">Corset</span>
                                            <span className="font-serif italic text-sm text-[var(--color-text)]">Broderie 3D</span>
                                        </div>
                                    </div>
                                    {/* Visual Item 2: Back */}
                                    <div className="space-y-3">
                                        <div className="aspect-[3/4] overflow-hidden bg-[#FAFAFA]">
                                            <img src="/images/carmen_model_back_v2.png" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Back Detail" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] uppercase tracking-wider text-[var(--color-secondary)]">Spate</span>
                                            <span className="font-serif italic text-sm text-[var(--color-text)]">Nasturi & Trenă</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Reality/Model - Mirrored */}
                <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center border-t border-[#FAFAFA]">
                    {/* Left: Typography & Story */}
                    <div className="h-full flex flex-col justify-center p-12 lg:p-32 order-1 lg:order-1">
                        <h2 className="font-serif text-4xl lg:text-5xl leading-[1.2] text-[var(--color-text)] uppercase tracking-wider font-light mb-12">
                            Carmen — Este <br />
                            <span className="text-[var(--color-secondary)]">Poezie în Mișcare.</span>
                        </h2>
                        <div className="space-y-8 text-[#605F5F] font-light leading-relaxed text-sm md:text-base text-justify">
                            <p>
                                Pe lângă detaliile sculpturale, Carmen oferă o experiență tactilă inedită. Materialele alese cu grijă – tulle fin, dantelă franțuzească și aplicații 3D – creează un joc de texturi care fascinează.
                            </p>
                            <p>
                                Este o rochie pentru femeia care își dorește să strălucească natural, fără efort. Un tribut adus feminității atemporale.
                            </p>

                            <div className="pt-12">
                                <Button variant="outline" className="w-full md:w-auto" onClick={() => window.location.href = "https://wa.me/?text=Buna%20ziua%2C%20sunt%20interesata%20de%20rochia%20Carmen"}>
                                    Programează o Probă
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Model Image */}
                    <div className="h-full bg-[var(--color-bg-secondary)] flex items-center justify-center p-0 lg:p-0 overflow-hidden order-2 lg:order-2 relative group">
                        <img
                            src="/images/carmen_model_front_v2.png"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] ease-in-out"
                            alt="Carmen Model"
                        />
                        <div className="absolute bottom-12 right-12 bg-white/90 backdrop-blur p-4 max-w-xs text-right opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                            <p className="font-serif italic text-lg">"Lumina naturală este cel mai bun accesoriu."</p>
                        </div>
                    </div>
                </div>

                {/* New Section: Full Gallery Restored */}
                <div className="py-24 px-6 md:px-12 bg-white border-t border-[#EBE7E0]">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <h3 className="font-serif text-3xl italic text-[var(--color-text)]">Galerie Completă</h3>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-secondary)]">4 Imagini</span>
                        </div>

                        <ImageGallery images={[
                            '/images/carmen_model_front_v2.png',
                            '/images/carmen_model_side_v2.png',
                            '/images/carmen_model_back_v2.png',
                            '/images/carmen_model_detail_v2.png'
                        ]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarmenFullPage;
