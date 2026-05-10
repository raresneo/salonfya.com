import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DRESSES } from '../constants';
import { Dress } from '../types';
import { supabase } from '../lib/supabase';
import ReactPixel from 'react-facebook-pixel';

export default function Programare() {
    const [searchParams] = useSearchParams();
    const dressId = searchParams.get('dressId');
    const [selectedDress, setSelectedDress] = useState<Dress | null>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (dressId) {
            const dress = DRESSES.find(d => d.id === dressId);
            if (dress) setSelectedDress(dress);
        }
        window.scrollTo(0, 0);
    }, [dressId]);

    // Calendar Helpers
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };
    
    const formatDate = (dateObj: Date) => {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    const dayNames = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
    const startDayOffset = getFirstDayOfMonth(currentYear, currentMonthIndex);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const today = formatDate(new Date());

    const handlePrevMonth = () => {
        const now = new Date();
        const prevMonth = new Date(currentYear, currentMonthIndex - 1, 1);
        if (prevMonth.getFullYear() > now.getFullYear() || 
            (prevMonth.getFullYear() === now.getFullYear() && prevMonth.getMonth() >= now.getMonth())) {
            setCurrentMonth(prevMonth);
        }
    };
    const handleNextMonth = () => setCurrentMonth(new Date(currentYear, currentMonthIndex + 1, 1));

    const isFormValid = date && time && firstName.trim() && lastName.trim() && phone.trim();

    const handleBooking = async () => {
        if (!isFormValid) return;

        const fullName = `${lastName} ${firstName}`;
        const interestedIn = selectedDress ? selectedDress.name : 'Vizită Generală Atelier';

        let trackingData: any = { utm_source: null, utm_campaign: null, voucher: null };
        const stored = localStorage.getItem('fya_tracking');
        if (stored) {
            try { trackingData = JSON.parse(stored); } catch (e) { }
        }

        try {
            await supabase.from('leads').insert([{
                name: fullName,
                phone: phone,
                dress_interested_in: interestedIn,
                appointment_date: date,
                appointment_time: time,
                location: 'Oradea',
                utm_source: trackingData.utm_source,
                utm_campaign: trackingData.utm_campaign,
                voucher_used: trackingData.voucher
            }]);
        } catch (error) {
            console.error('Failed to save lead:', error);
        }

        ReactPixel.track('Lead', { content_name: interestedIn, currency: 'RON' });

        try {
            fetch('/api/meta-conversion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_name: 'Lead',
                    event_id: `lead_${Date.now()}`,
                    email: '',
                    phone: phone,
                    value: 0
                })
            }).catch(e => console.error("CAPI error:", e));
        } catch (error) {
            console.error("Failed to trigger CAPI", error);
        }

        const voucherText = trackingData.voucher ? ` (Am voucherul: ${trackingData.voucher})` : '';
        const intentText = selectedDress ? `pentru rochia *${selectedDress.name}*` : `pentru o vizită la atelier`;
        const formattedDisplayDate = new Date(date).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        const message = `Bună ziua. Mă numesc ${fullName} (tel: ${phone}). Doresc o programare la showroom-ul din Oradea ${intentText} pe data de *${formattedDisplayDate}*, la ora *${time}*.${voucherText}`;
        const url = `https://wa.me/40727844228?text=${encodeURIComponent(message)}`;
        
        window.open(url, '_blank');
        setIsSubmitted(true);
    };

    const formattedSelectedDate = date 
        ? new Date(date).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })
        : null;

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            <div className="pt-28 md:pt-36 pb-20 px-6 max-w-[1400px] mx-auto">
                
                {/* Page Header */}
                <div className="text-center mb-16 md:mb-20">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-accent-light)] block mb-6">
                        Showroom Oradea
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[var(--color-text)] italic leading-[0.9] mb-6">
                        Programează-ți Vizita
                    </h1>
                    <p className="text-[#605F5F] font-light text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                        Completează formularul de mai jos și te vom contacta pe WhatsApp pentru confirmare.
                    </p>
                </div>

                {isSubmitted ? (
                    /* Success State */
                    <div className="max-w-xl mx-auto text-center py-20">
                        <div className="text-6xl mb-8">✓</div>
                        <h2 className="font-serif text-4xl italic text-[var(--color-text)] mb-6">Mulțumim!</h2>
                        <p className="text-[#605F5F] font-light text-lg leading-relaxed mb-10">
                            Mesajul tău a fost trimis pe WhatsApp. Echipa noastră te va contacta în cel mai scurt timp pentru confirmare.
                        </p>
                        <a href="/" className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)] border-b border-[var(--color-text)] pb-1 hover:text-[var(--color-secondary)] hover:border-transparent transition-all">
                            ← Înapoi la Colecții
                        </a>
                    </div>
                ) : (
                    /* Form */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                        
                        {/* Left: Form */}
                        <div className="lg:col-span-7 order-2 lg:order-1">
                            <div className="bg-white p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-[var(--color-border)]">
                                
                                {/* Selected Dress Tag */}
                                {selectedDress && (
                                    <div className="mb-10 pb-8 border-b border-[var(--color-border)]">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-accent-light)] block mb-2">Rochia selectată</span>
                                        <div className="flex items-center gap-4">
                                            <img src={selectedDress.imageUrl} alt={selectedDress.name} className="w-16 h-20 object-cover vintage-pastel" />
                                            <div>
                                                <span className="font-serif text-2xl italic text-[var(--color-text)]">{selectedDress.name}</span>
                                                <span className="block text-[10px] uppercase tracking-wider text-[var(--color-secondary)] mt-1">{selectedDress.collection}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-3 block">Nume</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-5 py-4 font-serif text-lg text-[var(--color-text)] outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[#D4D1CE]"
                                            placeholder="Popescu"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-3 block">Prenume</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-5 py-4 font-serif text-lg text-[var(--color-text)] outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[#D4D1CE]"
                                            placeholder="Maria"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="mb-12">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-3 block">Telefon</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-5 py-4 font-serif text-lg text-[var(--color-text)] outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[#D4D1CE]"
                                        placeholder="07xx xxx xxx"
                                    />
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-[var(--color-bg-secondary)] mb-12"></div>

                                {/* Calendar */}
                                <div className="mb-12">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] block mb-6">Alege Data</label>
                                    <div className="bg-[var(--color-bg-secondary)] p-6 md:p-8 border border-[var(--color-border)]">
                                        <div className="flex items-center justify-between mb-8">
                                            <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center hover:bg-white transition-colors">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <span className="font-serif text-xl md:text-2xl text-[var(--color-text)]">{monthNames[currentMonthIndex]} {currentYear}</span>
                                            <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center hover:bg-white transition-colors">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3">
                                            {dayNames.map(day => (
                                                <div key={day} className="text-center text-[9px] md:text-[10px] uppercase tracking-wider font-bold text-[var(--color-accent-light)] py-2">{day}</div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 md:gap-2">
                                            {Array.from({ length: startDayOffset }).map((_, i) => (
                                                <div key={`empty-${i}`} className="aspect-square"></div>
                                            ))}
                                            {days.map(day => {
                                                const cellDate = new Date(currentYear, currentMonthIndex, day);
                                                const formattedCellDate = formatDate(cellDate);
                                                const isSelected = date === formattedCellDate;
                                                const isToday = today === formattedCellDate;
                                                const isPast = cellDate < new Date(new Date().setHours(0,0,0,0));
                                                const isSunday = cellDate.getDay() === 0;

                                                return (
                                                    <button
                                                        key={`day-${day}`}
                                                        disabled={isPast || isSunday}
                                                        onClick={() => setDate(formattedCellDate)}
                                                        className={`
                                                            aspect-square flex items-center justify-center text-sm transition-all duration-200 relative
                                                            ${isPast || isSunday ? 'text-[#D4D1CE] cursor-not-allowed' : 'hover:bg-[var(--color-text)] hover:text-white cursor-pointer'} 
                                                            ${isSelected ? 'bg-[var(--color-text)] text-white font-medium' : 'text-[#605F5F]'}
                                                            ${!isSelected && !isPast && !isSunday ? 'bg-white border border-[var(--color-border)]' : ''}
                                                        `}
                                                    >
                                                        {day}
                                                        {isToday && !isSelected && !isPast && (
                                                            <div className="absolute bottom-1 w-1 h-1 bg-[var(--color-text)] rounded-full"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div className="mb-12">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] block mb-6">Alege Ora</label>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {['10:00', '12:00', '14:00', '16:00', '18:00'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setTime(t)}
                                                className={`
                                                    py-4 text-center text-xs tracking-wider transition-all duration-200 border font-medium
                                                    ${time === t 
                                                        ? 'bg-[var(--color-text)] text-white border-[var(--color-text)]' 
                                                        : 'bg-white border-[var(--color-border)] text-[#605F5F] hover:border-[var(--color-text)] hover:text-[var(--color-text)]'}
                                                `}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary before submit */}
                                {isFormValid && (
                                    <div className="bg-[var(--color-bg-secondary)] p-6 mb-8 border border-[var(--color-border)]">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-accent-light)] block mb-3">Rezumat programare</span>
                                        <p className="font-serif text-lg text-[var(--color-text)]">
                                            {lastName} {firstName} · {formattedSelectedDate} · ora {time}
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleBooking}
                                    disabled={!isFormValid}
                                    className={`
                                        w-full py-6 uppercase tracking-wider font-bold text-xs transition-all duration-300 flex items-center justify-center gap-3
                                        ${isFormValid 
                                            ? 'bg-[var(--color-accent)] text-white hover:bg-[#152e16] shadow-lg shadow-[var(--color-accent)]/20' 
                                            : 'bg-[#E4E1DE] text-[var(--color-accent-light)] cursor-not-allowed'}
                                    `}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.12 1.52 5.855L0 24l6.335-1.652A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.906 0-3.727-.513-5.33-1.488l-.382-.227-3.964 1.034 1.06-3.862-.25-.396A9.773 9.773 0 012.182 12 9.818 9.818 0 0112 2.182 9.818 9.818 0 0121.818 12 9.818 9.818 0 0112 21.818z"/>
                                    </svg>
                                    Confirmă prin WhatsApp
                                </button>
                            </div>
                        </div>

                        {/* Right: Context Image */}
                        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-32">
                            <div className="relative aspect-[3/4] overflow-hidden group">
                                <img 
                                    src={selectedDress ? selectedDress.imageUrl : '/images/about/istoric_atelier.jpg'} 
                                    className="w-full h-full object-cover vintage-pastel transition-transform duration-[5s] group-hover:scale-105" 
                                    alt={selectedDress ? selectedDress.name : 'Atelier Fya'} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <span className="block text-[9px] uppercase tracking-wider font-bold mb-3 opacity-80">
                                        {selectedDress ? `Colecția ${selectedDress.collection}` : 'Experiența Salon Fya'}
                                    </span>
                                    <h3 className="font-serif text-3xl md:text-4xl italic leading-tight">
                                        {selectedDress ? selectedDress.name : 'Descoperă Universul Nostru'}
                                    </h3>
                                </div>
                            </div>
                            
                            {/* Contact Info */}
                            <div className="mt-6 p-6 bg-white border border-[var(--color-border)]">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[var(--color-bg-secondary)] flex items-center justify-center flex-shrink-0">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="1.5">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-secondary)] block mb-1">Showroom</span>
                                        <span className="text-sm text-[var(--color-text)] font-light">Oradea, România</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
