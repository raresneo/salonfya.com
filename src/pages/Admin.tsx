import React, { useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Temporary local bypass for UI development. 
        // In production, this will hit an /api/login route to verify against the hashed password for sothirs.serenia@gmail.com
        if (password === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Parolă incorectă');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center p-6">
                <div className="bg-white p-12 shadow-2xl max-w-md w-full border border-[var(--color-border)] text-center">
                    <h1 className="font-serif text-4xl italic text-[var(--color-text)] mb-2">Fya Admin</h1>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-secondary)] mb-12">Acces Restricționat</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-left">
                            <label className="block text-xs uppercase tracking-wider text-[var(--color-secondary)] mb-2">Email Autorizat</label>
                            <input
                                type="email"
                                value="sothirs.serenia@gmail.com"
                                disabled
                                className="w-full p-3 bg-[#FAFAFA] border border-[var(--color-border)] text-[var(--color-secondary)] outline-none text-sm font-light cursor-not-allowed"
                            />
                        </div>
                        <div className="text-left">
                            <label className="block text-xs uppercase tracking-wider text-[var(--color-secondary)] mb-2">Parolă</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 bg-white border border-[var(--color-border)] focus:border-[var(--color-text)] outline-none text-sm font-light transition-colors"
                                placeholder="Introduceți parola..."
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-[var(--color-text)] text-white py-4 text-[10px] uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors">
                            Autentificare
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-[var(--color-border)] flex flex-col">
                <div className="p-8 border-b border-[var(--color-border)]">
                    <h2 className="font-serif text-3xl italic text-[var(--color-text)]">Fya</h2>
                    <p className="text-[9px] uppercase tracking-wider text-[var(--color-secondary)] mt-1">Sistem Administrare</p>
                </div>
                <nav className="flex-1 p-6 space-y-4">
                    <button className="w-full text-left text-sm tracking-wide text-[var(--color-text)] font-bold">Colecții</button>
                    <button className="w-full text-left text-sm tracking-wide text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors">Rochii & Media</button>
                    <button className="w-full text-left text-sm tracking-wide text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors">Texte Website</button>
                </nav>
                <div className="p-6 border-t border-[var(--color-border)]">
                    <button onClick={() => setIsAuthenticated(false)} className="text-xs text-red-800 uppercase tracking-wider hover:text-red-600 transition-colors">
                        Deconectare
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-4xl">
                    <SectionTitle title="Gestiune Colecții" subtitle="Adaugă sau modifică colecțiile existente" />

                    <div className="bg-white p-8 border border-[var(--color-border)] mt-12 shadow-sm">
                        <h3 className="font-serif text-2xl text-[var(--color-text)] mb-6">Adaugă Colecție Nouă</h3>
                        <p className="text-sm text-[var(--color-secondary)] font-light mb-8">Aici va apărea interfața drag and drop pentru poze și clipuri video, conectată la baza de date Vercel.</p>

                        <div className="border-2 border-dashed border-[var(--color-border)] p-12 text-center bg-[#FAFAFA] cursor-pointer hover:border-[var(--color-text)] transition-colors">
                            <span className="text-sm font-light text-[var(--color-secondary)]">Trage fișierele aici sau dă click pentru a încărca (Imagini / Video)</span>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-[var(--color-secondary)] mb-2">Sau adaugă Link Video (YouTube/Vimeo/URL Direct)</label>
                                <input type="url" placeholder="https://..." className="w-full p-3 border border-[var(--color-border)] focus:border-[var(--color-text)] outline-none text-sm font-light" />
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="autoplay" className="w-4 h-4 accent-[#212121]" />
                                <label htmlFor="autoplay" className="text-sm text-[var(--color-text)] font-light">Pornește videoclipul automat (Autoplay)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
