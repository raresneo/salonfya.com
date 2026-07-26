import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Dress } from '../types';

const Admin = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [email, setEmail] = useState('sothirs.serenia@gmail.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    const [dresses, setDresses] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    
    // UI state
    const [activeTab, setActiveTab] = useState<'rochii' | 'colectii'>('rochii');
    const [isEditing, setIsEditing] = useState<any | null>(null); // the dress being edited or new dress
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchData();
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchData();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [dressesRes, colRes] = await Promise.all([
                supabase.from('dresses').select('*').order('name'),
                supabase.from('collections').select('*')
            ]);
            if (dressesRes.data) setDresses(dressesRes.data);
            if (colRes.data) setCollections(colRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Eroare autentificare: ' + error.message);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const saveDress = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { error } = await supabase.from('dresses').upsert(isEditing, { onConflict: 'id' });
            if (error) throw error;
            setIsEditing(null);
            fetchData();
        } catch (err: any) {
            alert('Eroare la salvare: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteDress = async (id: string) => {
        if (!confirm('Ești sigur că vrei să ștergi această rochie?')) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('dresses').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert('Eroare la ștergere: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setIsEditing({ ...isEditing, image_url: data.url });
            } else {
                alert('Eroare la upload imagine');
            }
        } catch (e) {
            alert('Eroare la apelare upload');
        }
    };

    if (loading && !session) {
        return <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center">Se încarcă...</div>;
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center p-6">
                <div className="bg-white p-12 shadow-2xl max-w-md w-full border border-[var(--color-border)] text-center">
                    <h1 className="font-serif text-4xl italic text-[var(--color-text)] mb-2">Fya Admin</h1>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-secondary)] mb-12">Acces Restricționat</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-left">
                            <label className="block text-xs uppercase tracking-wider text-[var(--color-secondary)] mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-[#FAFAFA] border border-[var(--color-border)] text-[var(--color-text)] outline-none text-sm font-light"
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
                        <button disabled={loading} type="submit" className="w-full bg-[var(--color-text)] text-white py-4 text-[10px] uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors">
                            {loading ? 'Se autentifică...' : 'Autentificare'}
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
                    <button 
                        onClick={() => {setActiveTab('colectii'); setIsEditing(null);}} 
                        className={`w-full text-left text-sm tracking-wide ${activeTab === 'colectii' ? 'text-[var(--color-text)] font-bold' : 'text-[var(--color-secondary)] hover:text-[var(--color-text)]'}`}
                    >Colecții</button>
                    <button 
                        onClick={() => {setActiveTab('rochii'); setIsEditing(null);}} 
                        className={`w-full text-left text-sm tracking-wide ${activeTab === 'rochii' ? 'text-[var(--color-text)] font-bold' : 'text-[var(--color-secondary)] hover:text-[var(--color-text)]'}`}
                    >Rochii & Media</button>
                </nav>
                <div className="p-6 border-t border-[var(--color-border)]">
                    <button onClick={handleLogout} className="text-xs text-red-800 uppercase tracking-wider hover:text-red-600 transition-colors">
                        Deconectare
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {isEditing ? (
                        <div className="bg-white p-8 shadow-sm border border-[var(--color-border)]">
                            <h3 className="font-serif text-2xl text-[var(--color-text)] mb-6">
                                {isEditing.id ? 'Editează rochia' : 'Adaugă rochie nouă'}
                            </h3>
                            <form onSubmit={saveDress} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase text-[var(--color-secondary)] mb-1">ID (Unic, ex: imperial-noua)</label>
                                        <input required disabled={!!isEditing.created_at} value={isEditing.id || ''} onChange={e => setIsEditing({...isEditing, id: e.target.value})} className="w-full p-2 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-[var(--color-secondary)] mb-1">Nume Rochie</label>
                                        <input required value={isEditing.name || ''} onChange={e => setIsEditing({...isEditing, name: e.target.value})} className="w-full p-2 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-[var(--color-secondary)] mb-1">Colecție</label>
                                        <select required value={isEditing.collection_id || ''} onChange={e => setIsEditing({...isEditing, collection_id: e.target.value})} className="w-full p-2 border">
                                            <option value="">Alege...</option>
                                            {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-[var(--color-secondary)] mb-1">Preț Închiriere (RON)</label>
                                        <input type="number" value={isEditing.rent_price || ''} onChange={e => setIsEditing({...isEditing, rent_price: e.target.value})} className="w-full p-2 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-[var(--color-secondary)] mb-1">Preț Achiziție (RON)</label>
                                        <input type="number" value={isEditing.price || ''} onChange={e => setIsEditing({...isEditing, price: e.target.value})} className="w-full p-2 border" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs uppercase text-[var(--color-secondary)] mb-1">Descriere</label>
                                        <textarea rows={4} value={isEditing.description || ''} onChange={e => setIsEditing({...isEditing, description: e.target.value})} className="w-full p-2 border" />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-[var(--color-secondary)] mb-1">Imagine Principală (URL)</label>
                                        <input value={isEditing.image_url || ''} onChange={e => setIsEditing({...isEditing, image_url: e.target.value})} className="w-full p-2 border" />
                                        <div className="mt-2 text-xs">
                                            Sau încarcă: 
                                            <input type="file" onChange={e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    uploadImage(e.target.files[0]);
                                                }
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4 border-t">
                                    <button type="submit" disabled={loading} className="px-6 py-2 bg-[var(--color-text)] text-white text-xs uppercase tracking-wider">Salvează</button>
                                    <button type="button" onClick={() => setIsEditing(null)} className="px-6 py-2 bg-gray-200 text-[var(--color-text)] text-xs uppercase tracking-wider">Anulează</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'rochii' && (
                                <div>
                                    <div className="flex justify-between items-end mb-8">
                                        <SectionTitle title="Gestiune Rochii" subtitle="Catalogul complet de produse" />
                                        <button 
                                            onClick={() => setIsEditing({ id: '', name: '', type: 'BUY', currency: 'RON' })}
                                            className="px-6 py-3 bg-[var(--color-text)] text-white text-xs uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors"
                                        >
                                            + Adaugă Rochie
                                        </button>
                                    </div>

                                    {loading ? (
                                        <p>Se încarcă catalogul...</p>
                                    ) : (
                                        <div className="bg-white border border-[var(--color-border)] shadow-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#FAFAFA] border-b border-[var(--color-border)]">
                                                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--color-secondary)]">Poză</th>
                                                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--color-secondary)]">Nume</th>
                                                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--color-secondary)]">Colecție</th>
                                                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--color-secondary)]">Prețuri</th>
                                                        <th className="p-4 text-xs uppercase tracking-wider text-[var(--color-secondary)]">Acțiuni</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dresses.map(d => (
                                                        <tr key={d.id} className="border-b border-[var(--color-border)] hover:bg-[#FAFAFA]">
                                                            <td className="p-4">
                                                                {d.image_url && <img src={d.image_url} alt={d.name} className="w-12 h-16 object-cover" />}
                                                            </td>
                                                            <td className="p-4 text-sm font-semibold">{d.name}</td>
                                                            <td className="p-4 text-sm text-[var(--color-secondary)]">{d.collection_id}</td>
                                                            <td className="p-4 text-sm text-[var(--color-secondary)]">
                                                                Închiriere: {d.rent_price} {d.currency}<br/>
                                                                Vânzare: {d.price} {d.currency}
                                                            </td>
                                                            <td className="p-4 space-x-3">
                                                                <button onClick={() => setIsEditing(d)} className="text-xs uppercase tracking-wider text-blue-600 hover:underline">Editează</button>
                                                                <button onClick={() => deleteDress(d.id)} className="text-xs uppercase tracking-wider text-red-600 hover:underline">Șterge</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'colectii' && (
                                <div>
                                    <SectionTitle title="Gestiune Colecții" subtitle="Colecțiile active din baza de date" />
                                    <div className="grid grid-cols-3 gap-6 mt-8">
                                        {collections.map(c => (
                                            <div key={c.id} className="bg-white p-6 border border-[var(--color-border)] shadow-sm">
                                                <h4 className="font-serif text-xl">{c.name}</h4>
                                                <p className="text-xs text-[var(--color-secondary)] mt-2">ID: {c.id}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
