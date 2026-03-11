import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Dress } from '../../types';
import { supabase } from '../../lib/supabase';

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

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

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

        const voucherText = trackingData.voucher ? ` (Am voucherul: ${trackingData.voucher})` : '';
        const intentText = dress ? `pentru rochia *${dress.name}*` : `pentru o vizită la atelier`;
        const message = `Bună ziua. Mă numesc ${name} (tel: ${phone}). Doresc o programare la showroom-ul din ${location} ${intentText} pe data de ${date}, la ora ${time}.${voucherText}`;
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
        }, 500);
    };

    const imageUrl = dress ? dress.imageUrl : '/images/about/istoric_atelier.jpg';
    const imageClass = dress && dress.id.includes('alma') ? 'logo-mask' : 'vintage-pastel';
    const headerText = dress ? `Probează rochia ${dress.name}` : 'Programează o Vizită';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Serviciu Concierge">
            <div className="w-full h-full min-h-[600px] flex flex-col md:flex-row relative bg-[#EBE7E0]">
                {/* Left Side: Form Area */}
                <div className="w-full md:w-1/2 p-12 lg:p-24 flex flex-col justify-center relative z-10 overflow-hidden">

                    {/* Step Indicator */}
                    <div className="mb-16 flex items-center gap-4 relative z-20 hidden md:flex">
                        <div className={`h-[1px] w-12 transition-colors duration-500 ${step >= 1 ? 'bg-[#212121]' : 'bg-[#E4E1DE]'}`} />
                        <div className={`h-[1px] w-12 transition-colors duration-500 ${step >= 2 ? 'bg-[#212121]' : 'bg-[#E4E1DE]'}`} />
                    </div>

                    {/* Step 1: Identification */}
                    <div className={`transition-all duration-700 absolute inset-0 p-8 md:p-12 lg:p-24 flex flex-col justify-center bg-[#EBE7E0] ${step === 1 ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                        <h3 className="font-serif italic text-4xl lg:text-5xl text-[#212121] mb-12">Cu cine avem plăcerea?</h3>

                        <div className="space-y-12">
                            <div className="relative group">
                                <label className="absolute -top-4 left-0 text-[9px] font-bold uppercase tracking-[0.2em] text-[#959595] transition-colors group-focus-within:text-[#212121]">Numele dumneavoastră</label>
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
                                <label className="absolute -top-4 left-0 text-[9px] font-bold uppercase tracking-[0.2em] text-[#959595] transition-colors group-focus-within:text-[#212121]">Număr de telefon</label>
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

                    {/* Step 2: Date & Time */}
                    <div className={`transition-all duration-700 absolute inset-0 p-8 md:p-12 lg:p-24 flex flex-col justify-center bg-[#EBE7E0] ${step === 2 ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                        <button onClick={handlePrev} className="absolute top-8 left-8 md:top-12 md:left-12 lg:top-24 lg:left-24 text-[10px] uppercase tracking-widest font-bold text-[#959595] hover:text-[#212121] transition-colors">← Înapoi</button>

                        <h3 className="font-serif italic text-4xl lg:text-5xl text-[#212121] mb-12">Când doriți să ne vizitați?</h3>

                        <div className="space-y-12">
                            <div className="relative group">
                                <label className="absolute -top-4 left-0 text-[9px] font-bold uppercase tracking-[0.2em] text-[#959595] transition-colors group-focus-within:text-[#212121]">Data programării</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-transparent border-b border-[#E4E1DE] py-4 font-serif text-2xl text-[#212121] outline-none focus:border-[#212121] transition-colors"
                                />
                            </div>

                            <div className="relative group">
                                <label className="absolute -top-4 left-0 text-[9px] font-bold uppercase tracking-[0.2em] text-[#959595] transition-colors group-focus-within:text-[#212121]">Interval orar</label>
                                <select
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-transparent border-b border-[#E4E1DE] py-4 font-serif text-2xl text-[#212121] outline-none focus:border-[#212121] transition-colors cursor-pointer"
                                    style={{ color: time ? '#212121' : '#959595' }}
                                >
                                    <option value="" disabled className="text-[#959595]">Selectați ora</option>
                                    <option value="10:00" className="text-[#212121]">10:00 - 11:30</option>
                                    <option value="12:00" className="text-[#212121]">12:00 - 13:30</option>
                                    <option value="14:00" className="text-[#212121]">14:00 - 15:30</option>
                                    <option value="16:00" className="text-[#212121]">16:00 - 17:30</option>
                                    <option value="18:00" className="text-[#212121]">18:00 - 19:30</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={!date || !time}
                            className="mt-16 self-start text-[10px] font-bold uppercase tracking-[0.3em] text-white bg-[#212121] px-8 py-4 hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            data-cursor-text="WHATSAPP"
                        >
                            Confirmă Rezervarea
                        </button>
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
        </Modal>
    );
};

export default AppointmentModal;
