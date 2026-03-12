import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const collections = [
    { path: '/imperial', label: 'Imperial', image: '/images/IMPERIAL/Aurelia/IMG_5352.jpg' },
    { path: '/anna', label: 'Anna', image: '/images/ANNA/Just Anna/IMG_5889.jpg' },
    { path: '/mayra', label: 'Mayra', image: '/images/MAYRA/Snow/IMG_5744.jpg' },
    { path: '/beverly', label: 'Beverly', image: '/images/BEVERLY/Evora/IMG_6390.JPG' },
];

const Navbar = ({ onOpenWardrobe, onOpenAppointment, wardrobeCount, mobileMenuOpen, setMobileMenuOpen }: any) => {
    const [scrolled, setScrolled] = useState(false);
    const [hoveredCollection, setHoveredCollection] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    return (
        <>
            {/* Main Nav Bar */}
            <nav className={`fixed top-0 w-full z-50 px-6 lg:px-12 flex justify-between items-center transition-all duration-700 ${scrolled ? 'bg-[#EBE7E0]/95 backdrop-blur-lg border-b border-[#E4E1DE]/50 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
                {/* Menu Button - Left */}
                <div className="flex-1 flex items-center gap-4">
                    <button
                        className="flex flex-col items-center justify-center w-8 h-8 gap-[5px] group z-[60] active-scale"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Meniu"
                    >
                        <span className={`block w-6 h-[1.5px] bg-[#212121] transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                        <span className={`block w-6 h-[1.5px] bg-[#212121] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                        <span className={`block w-6 h-[1.5px] bg-[#212121] transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                    </button>
                    <span
                        className={`hidden lg:block text-[10px] font-bold uppercase tracking-[0.15em] cursor-pointer transition-opacity duration-300 ${scrolled || mobileMenuOpen ? 'text-[#212121]' : 'text-[#212121]'}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? 'Închide' : 'Meniu'}
                    </span>
                </div>

                {/* Logo - Center */}
                <div className="w-auto flex-shrink-0 text-center z-[60] px-4">
                    <Link to="/" onClick={() => { window.scrollTo(0, 0); setMobileMenuOpen(false); }} className="font-serif text-3xl italic tracking-wide cursor-pointer text-[#212121] active-scale inline-block">
                        FYA
                    </Link>
                </div>

                {/* Right side - Nav Actions */}
                <div className="flex-1 flex justify-end items-center gap-6 z-[60]">
                    <button
                        className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#212121] border-b border-[#212121] pb-[2px] hover:text-[#959595] hover:border-transparent transition-all"
                        onClick={() => { setMobileMenuOpen(false); onOpenAppointment(); }}
                    >
                        Programează Vizită
                    </button>
                    <button
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#212121] hover:text-[#605F5F] transition-colors active-scale"
                        onClick={() => { setMobileMenuOpen(false); onOpenWardrobe(); }}
                    >
                        <span>♡</span> <span className="hidden lg:inline">Garderobă</span> ({wardrobeCount})
                    </button>
                </div>
            </nav>

            {/* Split-Screen Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-[#EBE7E0] transition-opacity duration-700 ease-in-out flex flex-col lg:flex-row ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

                {/* Left side: Navigation Links */}
                <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center lg:items-start lg:pl-32 xl:pl-48 gap-5 md:gap-6 bg-[#EBE7E0] pt-24 lg:pt-0 overflow-y-auto pb-10 lg:pb-0">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#959595] mb-4">Colecții</span>
                    {collections.map((c, i) => (
                        <Link
                            key={c.path}
                            to={c.path}
                            onMouseEnter={() => setHoveredCollection(c.path)}
                            onMouseLeave={() => setHoveredCollection(null)}
                            className={`font-serif text-4xl md:text-5xl lg:text-6xl italic transition-all duration-500 hover:text-[#212121] hover:translate-x-4 ${location.pathname === c.path ? 'text-[#212121]' : 'text-[#A69F99]'}`}
                            style={{ transitionDelay: mobileMenuOpen ? `${i * 60 + 100}ms` : '0ms', transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileMenuOpen ? 1 : 0 }}
                            data-cursor-text="EXPLOREAZĂ"
                        >
                            {c.label}
                        </Link>
                    ))}

                    <div className="w-12 h-px bg-[#E4E1DE] my-6" />

                    <Link
                        to="/despre-noi"
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#959595] hover:text-[#212121] transition-colors"
                        style={{ transitionDelay: mobileMenuOpen ? '450ms' : '0ms', transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileMenuOpen ? 1 : 0 }}
                    >
                        Povestea Fya
                    </Link>
                    
                    <button
                        onClick={() => { setMobileMenuOpen(false); onOpenAppointment(); }}
                        className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white bg-[#212121] px-8 py-4 hover:bg-black transition-all"
                        style={{ transitionDelay: mobileMenuOpen ? '550ms' : '0ms', transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileMenuOpen ? 1 : 0 }}
                    >
                        Programează o Întâlnire
                    </button>
                </div>

                {/* Right side: Image Reveal (Desktop Only) */}
                <div className="hidden lg:block w-1/2 h-full bg-[#F3F3F3] relative overflow-hidden">
                    {/* Default State Image (Shown when nothing is hovered) */}
                    <div className={`absolute inset-0 w-full h-full bg-[#E4E1DE] transition-opacity duration-700 ease-luxury ${hoveredCollection ? 'opacity-0' : 'opacity-100'}`}>
                        {/* Soft grain or brand pattern could go here, for now solid calm color */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-serif italic text-6xl text-white/50">Haute Couture</span>
                        </div>
                    </div>

                    {/* Collection Images */}
                    {collections.map(c => (
                        <img
                            key={c.path + '-img'}
                            src={c.image}
                            alt={c.label}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-luxury 
                                ${hoveredCollection === c.path ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
