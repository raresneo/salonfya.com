import React from 'react';
import { Link } from 'react-router-dom';
import FadeInSection from '../ui/FadeInSection';

const Footer = () => (
    <footer className="bg-[#1A1A1A] text-white">
        {/* Pre-footer CTA */}
        <div className="bg-[var(--color-text)] py-16 px-6 text-center">
            <FadeInSection>
                <span className="block text-[10px] uppercase tracking-wider font-bold text-[var(--color-accent-light)] mb-4">Programare</span>
                <h3 className="font-serif text-3xl md:text-5xl italic text-white mb-6">Vizitează Atelierul</h3>
                <p className="text-[var(--color-secondary)] font-light text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                    Fiecare experiență Fya începe cu o conversație.
                    Programează o vizită la atelierul nostru din Oradea, unde povestea ta prinde formă.
                </p>
                <a href="tel:+40700000000" className="inline-flex items-center gap-3 border border-[#AFA79D] text-[var(--color-accent-light)] px-8 py-3 text-[10px] uppercase tracking-wider font-bold hover:bg-white hover:text-[var(--color-text)] hover:border-white transition-all duration-500">
                    Contactează-ne
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </FadeInSection>
        </div>

        {/* Main Footer */}
        <div className="py-16 px-6 md:px-12">
            <FadeInSection>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Logo & Tagline */}
                    <div className="md:col-span-4">
                        <span className="font-serif text-5xl italic">FYA</span>
                        <p className="mt-4 text-sm font-light text-[#E4E1DE] leading-relaxed max-w-xs">
                            Haute couture din Oradea. Fiecare rochie este o operă de artă, creată cu pasiune și reverență pentru frumusețe.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-4 mt-8">
                            <a href="https://www.instagram.com/salonfyaromania?igsh=MWFjbG9ib29xcXRubg==" target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#4a4a4a] rounded-full flex items-center justify-center text-[#E4E1DE] hover:text-white hover:border-white transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                            <a href="https://www.facebook.com/salonfyaromania?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#4a4a4a] rounded-full flex items-center justify-center text-[#E4E1DE] hover:text-white hover:border-white transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="https://www.tiktok.com/@salonfyaromania?_r=1&_t=ZN-94DYk9Z1iWU" target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#4a4a4a] rounded-full flex items-center justify-center text-[#E4E1DE] hover:text-white hover:border-white transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                            </a>
                            <a href="https://pinterest.com/fyarobes" target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#4a4a4a] rounded-full flex items-center justify-center text-[#E4E1DE] hover:text-white hover:border-white transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Collections */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-light)]">Colecții</h4>
                        <ul className="space-y-3 text-sm font-light text-[#E4E1DE]">
                            <li><Link to="/imperial" className="hover:text-white transition-colors">Imperial</Link></li>
                            <li><Link to="/anna" className="hover:text-white transition-colors">Anna</Link></li>
                            <li><Link to="/mayra" className="hover:text-white transition-colors">Mayra</Link></li>
                            <li><Link to="/beverly" className="hover:text-white transition-colors">Beverly</Link></li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-light)]">Informații</h4>
                        <ul className="space-y-3 text-sm font-light text-[#E4E1DE]">
                            <li><Link to="/despre-noi" className="hover:text-white transition-colors">Despre Noi</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Programări</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Termeni și Condiții</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Politica de Confidențialitate</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-4 space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-light)]">Newsletter</h4>
                        <p className="text-sm font-light text-[#E4E1DE] leading-relaxed">
                            Fii prima care descoperă noile colecții și evenimentele exclusive din atelierul Fya.
                        </p>
                        <div className="flex border-b border-[#3a3a3a] group focus-within:border-white transition-colors">
                            <input
                                type="email"
                                placeholder="Adresa ta de email"
                                className="bg-transparent w-full py-3 outline-none text-white text-sm placeholder-[#605F5F]"
                            />
                            <button className="uppercase text-[10px] font-bold tracking-wider text-[var(--color-accent-light)] hover:text-white transition-colors px-4 flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#4a4a4a] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[9px] uppercase tracking-wider text-[#AFA79D]">
                        © 2026 Fya Haute Couture. Toate drepturile rezervate.
                    </p>
                    <p className="text-[9px] uppercase tracking-wider text-[#AFA79D]">
                        Oradea, România · Atelier de rochii de mireasă
                    </p>
                </div>
            </FadeInSection>
        </div>
    </footer>
);

export default Footer;
