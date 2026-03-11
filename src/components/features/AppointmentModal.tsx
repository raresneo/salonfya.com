import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Dress } from '../../types';
import { supabase } from '../../lib/supabase';
import ReactPixel from 'react-facebook-pixel';

interface AppointmentModalProps {
    dress?: Dress;
    isOpen: boolean;
    onClose: () => void;
    location: string;
}

const AppointmentModal = ({ dress, isOpen, onClose, location }: AppointmentModalProps) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    // Helpers for calendar
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday
    
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
    const firstDay = getFirstDayOfMonth(currentYear, currentMonthIndex);
    const startDayOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentYear, currentMonthIndex - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentYear, currentMonthIndex + 1, 1));
    };

    const handleBooking = async () => {
        if (!date || !time || !name) return;

        // Fetch tracking data
        let trackingData = { utm_source: null, utm_campaign: null, voucher: null };
        const stored = localStorage.getItem('fya_tracking');
        if (stored) {
            try { trackingData = JSON.parse(stored); } catch (e) { }
        }

        const interestedIn = dress ? dress.name : 'Vizită Generală Atelier';

        try {
            await supabase.from('leads').insert([{
                name: name,
                phone: phone,
                dress_interested_in: interestedIn,
                appointment_date: date,
                appointment_time: time,
                location: location,
                utm_source: trackingData.utm_source,
                utm_campaign: trackingData.utm_campaign,
                voucher_used: trackingData.voucher
            }]);
        } catch (error) {
            console.error('Failed to save lead:', error);
        }

        // --- META TRACKING (DOUBLE TRACKING) ---
        // 1. Client-Side Track (Standard Pixel)
        ReactPixel.track('Lead', {
            content_name: interestedIn,
            currency: 'RON'
        });

        // 2. Server-Side Track (Conversions API via Vercel Function)
        try {
            fetch('/api/meta-conversion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_name: 'Lead',
                    event_id: `lead_${Date.now()}`,
                    email: '', // Not strictly asking for email in the current modal
                    phone: phone, // Passing phone to FB CAPI 
                    value: 0
                })
            }).catch(e => console.error("CAPI error:", e));
        } catch (error) {
            console.error("Failed to trigger CAPI", error);
        }
        // ---------------------------------------

        const voucherText = trackingData.voucher ? ` (Am voucherul: ${trackingData.voucher})` : '';
        const intentText = dress ? `pentru rochia *${dress.name}*` : `pentru o vizită la atelier`;
        
        const formattedDisplayDate = new Date(date).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const message = `Bună ziua. Mă numesc ${name} (tel: ${phone}). Doresc o programare la showroom-ul din ${location} ${intentText} pe data de *${formattedDisplayDate}*, la ora *${time}*.${voucherText}`;
        
        const url = `https://wa.me/40727844228?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onClose();
        
        // Reset state
        setTimeout(() => {
            setStep(1);
            setName('');
            setPhone('');
            setDate('');
            setTime('');
            setCurrentMonth(new Date());
        }, 500);
    };

    const imageUrl = dress ? dress.imageUrl : '/images/about/istoric_atelier.jpg';
    const imageClass = dress && dress.id.includes('alma') ? 'logo-mask' : 'vintage-pastel';
    const headerText = dress ? `Probează rochia ${dress.name}` : 'Programează o Vizită';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Serviciu Concierge">
            <div className="w-full h-full min-h-[600px] flex flex-col md:flex-row relative bg-[#EBE7E0]">
                {/* Left Side: Form Area */}
                <div className="w-full md:w-1/2 flex flex-col justify-center relative z-10 overflow-hidden h-full max-h-[90vh]">

                    {/* Step Indicator */}
                    <div className="absolute top-8 left-12 lg:top-12 lg:left-24 z-20 hidden md:flex items-center gap-4">
                        <div className={`h-[1px] w-12 transition-colors duration-500 ${step >= 1 ? 'bg-[#212121]' : 'bg-[#E4E1DE]'}`} />
                        <div className={`h-[1px] w-12 transition-colors duration-500 ${step >= 2 ? 'bg-[#212121]' : 'bg-[#E4E1DE]'}`} />
                    </div>

                    {/* Step 1: Identification */}
                    <div className={`transition-all duration-700 absolute inset-0 p-8 md:p-12 lg:p-24 flex flex-col justify-center bg-[#EBE7E0] overflow-y-auto ${step === 1 ? 'opacity-100 translate-x-0 pointer-events-auto z-10' : 'opacity-0 -translate-x-10 pointer-events-none -z-10'}`}>
                        <div className="my-auto">
                            <h3 className="font-serif italic text-4xl lg:text-5xl text-[#212121] mb-12">Cu cine avem plăcerea?</h3>

                            <div className="space-y-12">
                                <div className="relative group">
                                    <label className="absolute -top-4 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#959595] transition-colors group-focus-within:text-[#212121]">Numele dumneavoastră</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent border-b border-[#E4E1DE] py-4 font-serif text-2xl text-[#212121] outline-none focus:border-[#212121] transition-colors placeholder:text-[#E4E1DE]"
                                        placeholder="ex: Inserați numele"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="relative group">
                                    <label className="absolute -top-4 left-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#959595] transition-colors group-focus-within:text-[#212121]">Număr de telefon</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-transparent border-b border-[#E4E1DE] py-4 font-serif text-2xl text-[#212121] outline-none focus:border-[#212121] transition-colors placeholder:text-[#E4E1DE]"
                                        placeholder="ex: 07xx xxx xxx"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!name || !phone}
                                className="mt-16 self-start text-[10px] font-bold uppercase tracking-[0.3em] text-[#212121] border-b border-[#212121] pb-1 hover:text-[#959595] hover:border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Pasul Următor →
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Date & Time */}
                    <div className={`transition-all duration-700 absolute inset-0 p-8 md:p-12 lg:p-24 flex flex-col bg-[#EBE7E0] overflow-y-auto custom-scrollbar ${step === 2 ? 'opacity-100 translate-x-0 pointer-events-auto z-10' : 'opacity-0 translate-x-10 pointer-events-none -z-10'}`}>
                        <div className="my-auto pb-12 pt-8 md:pt-0">
                            <button onClick={handlePrev} className="mb-8 md:absolute md:top-8 md:right-8 lg:top-12 lg:right-12 text-[10px] uppercase tracking-widest font-bold text-[#959595] hover:text-[#212121] transition-colors">← Înapoi</button>

                            <h3 className="font-serif italic text-4xl lg:text-5xl text-[#212121] mb-10">Când doriți să ne vizitați?</h3>

                            <div className="space-y-10">
                                {/* Calendar Area */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#959595] block mb-2">Alegeți Data</label>
                                    <div className="bg-[#FAF8F5]/80 p-6 shadow-sm border border-white/50 backdrop-blur-sm">
                                        
                                        {/* Month Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <button onClick={handlePrevMonth} className="p-2 text-[#959595] hover:text-[#212121] transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <span className="font-serif text-lg text-[#212121] capitalize-first">{monthNames[currentMonthIndex]} {currentYear}</span>
                                            <button onClick={handleNextMonth} className="p-2 text-[#959595] hover:text-[#212121] transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>

                                        {/* Days Header */}
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {dayNames.map(day => (
                                                <div key={day} className="text-center text-[9px] uppercase tracking-wider font-bold text-[#959595] py-1">{day}</div>
                                            ))}
                                        </div>

                                        {/* Days Grid */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {Array.from({ length: startDayOffset }).map((_, i) => (
                                                <div key={`empty-${i}`} className="p-2"></div>
                                            ))}
                                            {days.map(day => {
                                                const cellDate = new Date(currentYear, currentMonthIndex, day);
                                                const formattedCellDate = formatDate(cellDate);
                                                const isSelected = date === formattedCellDate;
                                                const isToday = formatDate(new Date()) === formattedCellDate;
                                                const isPast = cellDate < new Date(new Date().setHours(0,0,0,0));

                                                return (
                                                    <button
                                                        key={`day-${day}`}
                                                        disabled={isPast}
                                                        onClick={() => setDate(formattedCellDate)}
                                                        className={`
                                                            aspect-square flex items-center justify-center text-sm transition-all duration-300 relative
                                                            ${isPast ? 'text-[#D4D1CE] cursor-not-allowed' : 'hover:bg-[#E4E1DE] cursor-pointer'} 
                                                            ${isSelected ? 'bg-[#212121] text-white hover:bg-black font-medium' : 'text-[#605F5F]'}
                                                        `}
                                                    >
                                                        {day}
                                                        {!isSelected && isToday && !isPast && (
                                                            <div className="absolute bottom-1 w-1 h-1 bg-[#AFA79D] rounded-full"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#959595] block mb-2">Interval orar</label>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {['10:00', '12:00', '14:00', '16:00', '18:00'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setTime(t)}
                                                className={`
                                                    py-3 text-center text-xs tracking-[0.2em] transition-all duration-300 border
                                                    ${time === t ? 'bg-[#212121] text-white border-[#212121]' : 'bg-transparent border-[#E4E1DE] text-[#605F5F] hover:border-[#212121] hover:text-[#212121]'}
                                                `}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={!date || !time}
                                className="mt-12 w-full text-[10px] font-bold uppercase tracking-[0.3em] text-white bg-[#212121] px-8 py-5 hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Confirmă Rezervarea
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Side: Image Context */}
                <div className="hidden md:block w-1/2 h-full bg-[#F3F3F3] relative overflow-hidden">
                    <img src={imageUrl} className={`absolute inset-0 w-full h-full object-cover filter contrast-[0.95] ${imageClass} opacity-90 scale-105 transition-transform duration-[4s] hover:scale-[1.15]`} alt="Appointment Context Preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-12 left-12">
                        {dress && (
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#212121] mb-2 block">Probează Colecția {dress.collection}</span>
                        )}
                        <h4 className="font-serif italic text-5xl text-[#212121]">{headerText}</h4>
                    </div>
                </div>
            </div>
            
            <style>{`
                .capitalize-first::first-letter {
                    text-transform: capitalize;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(33, 33, 33, 0.1);
                    border-radius: 4px;
                }
            `}</style>
        </Modal>
    );
};

export default AppointmentModal;
