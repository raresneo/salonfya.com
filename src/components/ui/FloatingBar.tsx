import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const FloatingBar = ({ onOpenWardrobe, onOpenAppointment, wardrobeCount, mobileMenuOpen, setMobileMenuOpen }: { onOpenWardrobe: () => void; onOpenAppointment: () => void; wardrobeCount: number; mobileMenuOpen: boolean; setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>; }) => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    // Icon info logic
    return (
        <>
            {/* Mobile-only floating bottom bar */}
            <div className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 safe-mb ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="bg-[#EBE7E0]/90 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#E4E1DE]/40 px-6 py-3 flex items-center gap-8">
                    {/* Menu */}
                    <button onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center gap-1 group active-scale">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                        <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-[#959595]">Meniu</span>
                    </button>

                    {/* Home */}
                    <Link to="/" className="flex flex-col items-center gap-1 group active-scale">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5">
                            <path d="M12 3L2 12h3v8h5v-5h4v5h5v-8h3L12 3z" />
                        </svg>
                        <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-[#959595]">Acasă</span>
                    </Link>

                    {/* Search/Explore */}
                    <button onClick={onOpenAppointment} className="flex flex-col items-center gap-1 group active-scale">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-[#959595]">Programează</span>
                    </button>

                    {/* Search/Explore */}
                    <Link to="/despre-noi" className="flex flex-col items-center gap-1 group active-scale">
                        {/* Updated Info icon */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-[#959595]">Despre</span>
                    </Link>

                    {/* Wardrobe */}
                    <button onClick={onOpenWardrobe} className="flex flex-col items-center gap-1 group relative active-scale">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5">
                            <path d="M4 7h16l-1.5 11H5.5L4 7z" />
                            <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                        </svg>
                        {wardrobeCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#212121] text-white text-[8px] rounded-full flex items-center justify-center">{wardrobeCount}</span>
                        )}
                        <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-[#959595]">Garderobă</span>
                    </button>
                </div>
            </div>

            {/* Full-screen mobile menu from floating bar */}
            <div className={`lg:hidden fixed inset-0 z-[60] bg-[#EBE7E0] transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center justify-center h-full gap-5">
                    <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5">
                            <line x1="6" y1="6" x2="18" y2="18" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                    </button>

                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#959595] mb-2">Colecții</span>
                    {[
                        { path: '/imperial', label: 'Imperial' },
                        { path: '/anna', label: 'Anna' },
                        { path: '/mayra', label: 'Mayra' },
                        { path: '/beverly', label: 'Beverly' },
                    ].map(c => (
                        <Link key={c.path} to={c.path} onClick={() => setMobileMenuOpen(false)}
                            className={`font-serif text-3xl italic transition-colors ${location.pathname === c.path ? 'text-[#605F5F]' : 'text-[#212121] hover:text-[#605F5F]'}`}>
                            {c.label}
                        </Link>
                    ))}

                    <div className="w-12 h-px bg-[#E4E1DE] my-3" />

                    <Link to="/despre-noi" onClick={() => setMobileMenuOpen(false)}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#959595] hover:text-[#212121]">
                        Despre Noi
                    </Link>
                </div>
            </div>
        </>
    );
};

export default FloatingBar;
