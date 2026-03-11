import React, { useEffect, useRef, useState } from 'react';

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(el);
            }
        }, { threshold });
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, threshold]);
    return isVisible;
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useInView(ref);
    return (
        <div
            ref={ref}
            className={`transition-all duration-[1.2s] ease-out ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            }}
        >
            {children}
        </div>
    );
}

function Counter({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useInView(ref);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / target), 20);
        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= target) clearInterval(timer);
        }, stepTime);
        return () => clearInterval(timer);
    }, [isVisible, target]);

    return (
        <div ref={ref} className="text-center">
            <span className="font-serif text-5xl md:text-7xl italic text-[#212121]">{count}{suffix}</span>
            <span className="block mt-3 text-[10px] uppercase tracking-[0.25em] font-bold text-[#959595]">{label}</span>
        </div>
    );
}

interface DespreNoiProps {
    onOpenAppointment: () => void;
}

export default function DespreNoi({ onOpenAppointment }: DespreNoiProps) {
    return (
        <div className="bg-[#FAF8F5] min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 md:px-16 max-w-[1400px] mx-auto min-h-[80vh] flex flex-col items-center justify-center">
                <AnimatedSection className="w-full text-center relative z-10">
                    <span className="block text-[10px] uppercase tracking-[0.4em] font-bold text-[#AFA79D] mb-6">Povestea Fya</span>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-[#212121] italic leading-[0.9] mb-8">
                        Ramona Jofneac
                    </h1>
                    <p className="text-[#5a5a5a] font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed tracking-wide">
                        Antreprenor în serie. Vizionar. Un om care iubește oamenii și frumosul din ei. Fya a apărut din această pasiune, în anul 2015.
                    </p>
                </AnimatedSection>

                {/* Abstract Decorative Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] bg-[#EBE7E0] rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>
            </section>

            {/* The Founder - Editorial Split */}
            <section className="py-20 px-6 lg:px-16 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Image Column */}
                    <div className="lg:col-span-5 relative group">
                        <AnimatedSection delay={100}>
                            <div className="relative overflow-hidden aspect-[3/4] rounded-sm bg-[#EBE7E0]">
                                <img
                                    src="/images/about/ramona_jofneac_real.jpg"
                                    alt="Ramona Jofneac - Founder Fya"
                                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 border border-black/5 m-4 pointer-events-none"></div>
                            </div>
                        </AnimatedSection>
                        {/* Decorative floating text */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 hidden xl:block pointer-events-none">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-[#959595]">Romanian Couture</span>
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-6 lg:col-start-7 lg:pl-10">
                        <AnimatedSection delay={200}>
                            <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#AFA79D] mb-8">Despre Fondator</span>
                            <h2 className="font-serif text-4xl md:text-5xl text-[#212121] italic mb-10 leading-[1.1]">
                                „Eleganța nu este despre a fi remarcat, ci despre a fi amintit.”
                            </h2>
                            <div className="text-[#5a5a5a] font-light text-base md:text-lg leading-[2] space-y-6">
                                <p className="editorial-dropcap">
                                    Povestea brandului Fya a prins contur în anul 2015, susținută de spiritul efervescent al fondatoarei sale, Ramona Jofneac. La aproape 49 de ani, cu o maturitate asumată și o vocație de antreprenor în serie, Ramona nu construiește doar rochii, ci experiențe și emoții. Pentru ea, antreprenoriatul nu a fost niciodată exclusiv despre business, ci mai presus de orice, despre oameni.
                                </p>
                                <p>
                                    Ceea ce definește cu adevărat abordarea Ramonei este dragostea profundă pentru oameni. O iubire asumată, vizibilă în dedicarea cu care ascultă fiecare viitoare mireasă și în generozitatea cu care se implică în comunitate. Susținerea unor proiecte de suflet, precum „Atipic Beauty Oradea”, unde modelele, inclusiv cele în scaun rulant, strălucesc în creații haute couture, reflectă crezul ei: frumusețea și eleganța nu cunosc bariere.
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Atelier / Manifesto Section (Dark Mode) */}
            <section className="bg-[#1C1C1C] text-[#F5F3F0] py-32 px-6 mt-20">
                <div className="max-w-[1200px] mx-auto text-center">
                    <AnimatedSection>
                        <span className="block text-[10px] uppercase tracking-[0.4em] font-bold text-[#AFA79D] mb-8">Manifest Fya</span>
                        <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl italic leading-[1.3] max-w-4xl mx-auto mb-12">
                            „Fiecare rochie poartă amprenta femeii care a visat-o, a artistei care a desenat-o și a artizanilor care i-au dat formă.”
                        </blockquote>
                        <p className="font-light text-white/70 max-w-2xl mx-auto leading-relaxed text-lg">
                            În atelierul Fya, nu accelerăm timpul. O rochie haute couture pretinde sute de ore de muncă manuală, răbdare și dedicare.
                            Este un tribut adus feminității, tăiat în mătase naturală și brodat cu perle.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Authentic History / Process Layout */}
            <section className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto border-t border-[#EBE7E0]/50 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <AnimatedSection>
                            <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#AFA79D] mb-6">Culisele Creației</span>
                            <h2 className="font-serif text-4xl md:text-5xl text-[#212121] italic mb-8 leading-[1.1]">
                                Din dragoste pentru detaliu
                            </h2>
                            <p className="text-[#5a5a5a] font-light text-base md:text-lg leading-[2]">
                                O rochie Fya prinde viață treptat, din colaborarea omogenă și atentă din inima atelierului. Ajustările minuțioase, pasiunea echipei de croitorese și dedicarea fondatoarei sunt ingredientele ce aduc magia la realitate. Aceste momente de autenticitate scriu istoria brandului, clipă de clipă.
                            </p>
                        </AnimatedSection>
                    </div>
                    <div className="order-1 lg:order-2">
                        <AnimatedSection delay={150}>
                            <div className="aspect-[3/4] relative overflow-hidden rounded-sm bg-[#EBE7E0]">
                                <img
                                    src="/images/about/istoric_atelier.jpg"
                                    alt="Ramona Jofneac ajustând o rochie Fya alături de echipă"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* The Process / Numbers */}
            <section className="py-32 px-6 bg-white border-t border-[#EBE7E0]/50">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-20 relative">
                        <AnimatedSection>
                            <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#959595] mb-4">Măiestrie</span>
                            <h3 className="font-serif text-4xl md:text-5xl text-[#212121] italic">Arta Couture</h3>
                        </AnimatedSection>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8">
                        <AnimatedSection delay={0}><Counter target={500} label="Ore de Muncă Manuală (max)" suffix="+" /></AnimatedSection>
                        <AnimatedSection delay={150}><Counter target={100} label="Mătase Naturală" suffix="%" /></AnimatedSection>
                        <AnimatedSection delay={300}><Counter target={50} label="Rochii Unice Anual" suffix="" /></AnimatedSection>
                        <AnimatedSection delay={450}><Counter target={10} label="Ani de Excelență" suffix="+" /></AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-40 px-6 text-center max-w-[800px] mx-auto">
                <AnimatedSection>
                    <div className="w-16 h-[1px] bg-[#D4CFC7] mx-auto mb-10"></div>
                    <h2 className="font-serif text-4xl md:text-6xl text-[#212121] italic mb-8 leading-[1.1]">
                        Pășiți în Universul Fya
                    </h2>
                    <p className="text-[#5a5a5a] font-light text-lg mb-12 max-w-md mx-auto leading-relaxed">
                        Atelierul nostru din Oradea vă are porțile deschise. Veniți să cunoașteți echipa, să atingeți
                        materialele și să împreună să scriem o nouă poveste.
                    </p>
                    <button onClick={onOpenAppointment} className="inline-block border border-[#212121] text-[#212121] px-12 py-5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#212121] hover:text-white transition-all duration-300">
                        Programează o Întâlnire
                    </button>
                </AnimatedSection>
            </section>
        </div>
    );
}
