import React, { useState, useEffect, Suspense, lazy } from 'react';
// import { DRESSES } from './constants';
import { Dress, DressType, WardrobeItem, Collection } from './types';

// UI Components
import Button from './components/ui/Button';
import Tag from './components/ui/Tag';
import Modal from './components/ui/Modal';
import CustomCursor from './components/ui/CustomCursor';

// Feature Components
import WardrobeModal from './components/features/WardrobeModal';
import ImageZoomModal from './components/features/ImageZoomModal';
import AppointmentModal from './components/features/AppointmentModal';

import IntroAnimation from './components/features/IntroAnimation';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingBar from './components/ui/FloatingBar';
import ScrollProgress from './components/ui/ScrollProgress';
import PageTransition from './components/layout/PageTransition';
import Preloader from './components/layout/Preloader';

import ReactPixel from 'react-facebook-pixel';
import { supabase } from './lib/supabase';

import { Routes, Route, useLocation, Link } from 'react-router-dom';

// Lazy loaded pages for ultra-fast startup
const Homepage = lazy(() => import('./pages/Homepage'));
const ImperialCollection = lazy(() => import('./pages/ImperialCollection'));
const AnnaCollection = lazy(() => import('./pages/AnnaCollection'));
const MayraCollection = lazy(() => import('./pages/MayraCollection'));
const BeverlyCollection = lazy(() => import('./pages/BeverlyCollection'));
const DespreNoi = lazy(() => import('./pages/DespreNoi'));
const Programare = lazy(() => import('./pages/Programare'));
const Admin = lazy(() => import('./pages/Admin'));




export default function App() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [modalType, setModalType] = useState<'details' | 'appointment' | 'wardrobe' | 'global-appointment' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [introFinished, setIntroFinished] = useState(true);
  const [isPreloading, setIsPreloading] = useState(true);

  // Wardrobe Logic
  const toggleWardrobe = (dress: Dress) => {
    setWardrobe(prev => {
      const exists = prev.find(item => item.dressId === dress.id);
      if (exists) {
        return prev.filter(item => item.dressId !== dress.id);
      } else {
        setToastMessage(`Rochia ${dress.name} a fost adăugată în Wishlist ♡`);
        setTimeout(() => setToastMessage(null), 3000);
        return [...prev, { dressId: dress.id, notes: '', preferredStyle: '', addedAt: new Date() }];
      }
    });
  };

  const updateWardrobeItem = (id: string, field: keyof WardrobeItem, value: string) => {
    setWardrobe(prev => prev.map(item =>
      item.dressId === id ? { ...item, [field]: value } : item
    ));
  };

  const removeFromWardrobe = (id: string) => {
    setWardrobe(prev => prev.filter(item => item.dressId !== id));
  };

  const clearWardrobe = () => {
    if (confirm("Ești sigură că vrei să ștergi întreaga garderobă?")) {
      setWardrobe([]);
    }
  };

  const openDetails = (dress: Dress) => {
    setSelectedDress(dress);
    setModalType('details');
  };

  const closeModal = () => {
    setModalType(null);
    setTimeout(() => { if (!modalType) setSelectedDress(null); }, 500);
  };

  // Extract collections
  const imperialDresses = dresses.filter(d => d.collection === Collection.IMPERIAL);
  const annaDresses = dresses.filter(d => d.collection === Collection.ANNA);
  const mayraDresses = dresses.filter(d => d.collection === Collection.MAYRA);
  const beverlyDresses = dresses.filter(d => d.collection === Collection.BEVERLY);

  const isInWardrobe = (id: string) => wardrobe.some(item => item.dressId === id);

  const bgColor = '#EBE7E0';

  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // UTM parameter capturing
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source');
    const utmCampaign = searchParams.get('utm_campaign');
    const voucher = searchParams.get('voucher');

    let trackingData: any = {};
    const stored = localStorage.getItem('fya_tracking');
    if (stored) {
      try { trackingData = JSON.parse(stored); } catch (e) { }
    }

    let updated = false;
    if (utmSource || utmCampaign) {
      trackingData.utm_source = utmSource || trackingData.utm_source;
      trackingData.utm_campaign = utmCampaign || trackingData.utm_campaign;
      updated = true;
    }
    if (voucher) {
      trackingData.voucher = voucher;
      updated = true;
      setToastMessage(`VOUCHER APLICAT: Reducerea ta a fost adăugată pentru programare!`);
      setTimeout(() => setToastMessage(null), 5000);
    }

    if (updated) {
      localStorage.setItem('fya_tracking', JSON.stringify(trackingData));
    }
  }, []);

  useEffect(() => {
    const fetchDresses = async () => {
      const { data } = await supabase.from('dresses').select('*');
      if (data) {
          // Transform db fields to match Dress type (like rent_price -> rentPrice, collection_id -> collection)
          const formatted = data.map(d => ({
              ...d,
              rentPrice: d.rent_price,
              collection: d.collection_id,
              imageUrl: d.image_url,
              details: {
                  fabric: d.fabric || '',
                  silhouette: d.silhouette || '',
                  neckline: d.neckline || ''
              }
          }));
          setDresses(formatted);
      }
    };
    fetchDresses();
  }, []);

  // Initialize and track PageViews with Meta Pixel
  useEffect(() => {
    const options = {
      autoConfig: true, 
      debug: false, 
    };
    ReactPixel.init('615819990278598', undefined, options);
    ReactPixel.pageView();
  }, [location.pathname]);

  return (
    <>
      <CustomCursor />
      {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}

      {!isPreloading && !introFinished && <IntroAnimation onComplete={() => setIntroFinished(true)} />}

      {!isPreloading && (
        <div
          className={`min-h-screen text-[var(--color-text)] selection:bg-[#E4E1DE] font-sans transition-colors duration-[1.5s] ease-in-out ${!introFinished ? 'overflow-hidden h-screen' : ''}`}
          style={{ backgroundColor: bgColor }}
        >
          <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(1.1); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(3rem, 5vw, 6rem);
          line-height: 1.1;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        .logo-mask {
          mask-image: radial-gradient(circle at 100% 100%, transparent 0%, transparent 8%, black 12%);
          -webkit-mask-image: radial-gradient(circle at 100% 100%, transparent 0%, transparent 8%, black 12%);
        }
        `}</style>



          {/* Navigation */}
          <Navbar onOpenWardrobe={() => setModalType('wardrobe')} onOpenAppointment={() => setModalType('global-appointment')} wardrobeCount={wardrobe.length} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

          <PageTransition>
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[var(--color-bg-secondary)]"><span className="text-[10px] uppercase tracking-wider text-[var(--color-secondary)] font-bold">Așteaptă puțin...</span></div>}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/imperial" element={<ImperialCollection dresses={imperialDresses} onOpenDetails={openDetails} />} />
                <Route path="/anna" element={<AnnaCollection dresses={annaDresses} onOpenDetails={openDetails} />} />
                <Route path="/mayra" element={<MayraCollection dresses={mayraDresses} onOpenDetails={openDetails} />} />
                <Route path="/beverly" element={<BeverlyCollection dresses={beverlyDresses} onOpenDetails={openDetails} />} />
                <Route path="/despre-noi" element={<DespreNoi onOpenAppointment={() => setModalType('global-appointment')} />} />
                <Route path="/programare" element={<Programare />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>

          </PageTransition>

          <Footer />

          {/* Lucesposa-inspired UI elements */}
          <FloatingBar onOpenWardrobe={() => setModalType('wardrobe')} onOpenAppointment={() => setModalType('global-appointment')} wardrobeCount={wardrobe.length} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          <ScrollProgress />

          {/* Global Sticky Appointment Button */}
          <Link
              to="/programare"
              className="hidden md:flex fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[80] bg-[var(--color-text)] text-white px-5 py-3 md:px-6 md:py-4 shadow-[0_8px_32px_rgba(33,33,33,0.3)] hover:bg-black hover:scale-105 transition-all group items-center gap-2 md:gap-3 rounded-full md:rounded-none"
              aria-label="Programează Vizită"
          >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:hidden">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider font-bold whitespace-nowrap">Programează</span>
              <span className="hidden md:inline-block text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>


          {/* Image Zoom Modal */}
          <ImageZoomModal isOpen={!!zoomImage} onClose={() => setZoomImage(null)} imageUrl={zoomImage} />

          {/* Wardrobe Modal */}
          <WardrobeModal
            isOpen={modalType === 'wardrobe'}
            onClose={closeModal}
            wardrobe={wardrobe}
            dresses={dresses}
            onUpdateItem={updateWardrobeItem}
            onRemoveItem={removeFromWardrobe}
            onClearAll={clearWardrobe}
          />

          {/* Detail Modal */}
          <Modal isOpen={modalType === 'details'} onClose={closeModal} title={selectedDress?.name || ''} fullScreen={true}>
            {selectedDress && (
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
                {/* Image Gallery Side */}
                <div className="lg:col-span-7 bg-[var(--color-bg-secondary)] p-6 lg:p-12 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDress.images && selectedDress.images.length > 0 ? (
                      selectedDress.images.map((img, i) => (
                        <div
                          key={i}
                          className={`${i === 0 ? 'col-span-2' : 'col-span-1'} aspect-[3/4] cursor-zoom-in group overflow-hidden bg-white`}
                          onClick={() => setZoomImage(img)}
                        >
                          <img
                            src={img}
                            className={`w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105 vintage-pastel ${selectedDress.id.includes('alma') ? 'logo-mask' : ''}`}
                            alt={`${selectedDress.name} view ${i + 1}`}
                            style={{
                              imageRendering: 'auto'
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 aspect-[3/4] cursor-zoom-in group overflow-hidden" onClick={() => setZoomImage(selectedDress.imageUrl)}>
                        <img src={selectedDress.imageUrl} className="w-full h-full object-contain bg-white object-center transition-transform duration-700 group-hover:scale-105 vintage-pastel" alt={selectedDress.name} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Side - Editorial Layout */}
                <div className="lg:col-span-5 p-8 lg:p-20 xl:px-24 bg-white flex flex-col h-full overflow-y-auto relative">
                  <div className="mb-14 mt-4 lg:mt-8">
                    <div className="flex justify-between items-center mb-10">
                      <Tag>{selectedDress.collection}</Tag>
                      <span className="text-xl md:text-2xl font-serif italic text-[#605F5F]">
                        {selectedDress.type === DressType.RENT
                          ? `de la ${selectedDress.rentPrice} ${selectedDress.currency || '€'}`
                          : `${selectedDress.price} ${selectedDress.currency || '€'}`}
                      </span>
                    </div>
                    <h2 className="font-serif text-[3.5rem] md:text-[5rem] lg:text-[6rem] text-[var(--color-text)] leading-[0.85] mb-10 tracking-tight">{selectedDress.name}</h2>
                    <p className="editorial-dropcap text-[#5a5a5a] text-lg leading-[2.2] font-light">
                      {selectedDress.description}
                    </p>

                    {selectedDress.sketches && selectedDress.sketches.length > 0 && (
                      <div className="mt-12">
                        <h3 className="font-serif text-2xl text-[var(--color-text)] mb-6 border-b border-[var(--color-text)]/10 pb-2">Schițe de Design</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedDress.sketches.map((img, i) => (
                            <div
                              key={i}
                              className="w-full aspect-[2/3] md:aspect-auto md:h-[60vh] cursor-zoom-in group overflow-hidden bg-white border border-[var(--color-text)]/5"
                              onClick={() => setZoomImage(img)}
                            >
                              <img
                                src={img}
                                className="w-full h-full object-contain object-center p-2 transition-transform duration-700 group-hover:scale-105"
                                alt={`${selectedDress.name} sketch ${i + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-xs text-[var(--color-secondary)] italic text-center">
                          Conceptul original, ilustrat în faza de creație.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Technical Details Block */}
                  {selectedDress.details && (
                    <div className="grid grid-cols-3 gap-6 border-y border-[var(--color-border)] py-10 mb-12">
                      <div className="space-y-2">
                        <span className="block text-[9px] uppercase tracking-wider font-bold text-[var(--color-accent-light)]">Material</span>
                        <span className="text-sm font-light text-[var(--color-text)] leading-relaxed">{selectedDress.details.fabric}</span>
                      </div>
                      <div className="space-y-2">
                        <span className="block text-[9px] uppercase tracking-wider font-bold text-[var(--color-accent-light)]">Siluetă</span>
                        <span className="text-sm font-light text-[var(--color-text)] leading-relaxed">{selectedDress.details.silhouette}</span>
                      </div>
                      <div className="space-y-2">
                        <span className="block text-[9px] uppercase tracking-wider font-bold text-[var(--color-accent-light)]">Decolteu</span>
                        <span className="text-sm font-light text-[var(--color-text)] leading-relaxed">{selectedDress.details.neckline}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-10 pt-4 mb-16">
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider font-bold text-[var(--color-accent-light)] mb-4">Culori</span>
                        <div className="flex gap-3 flex-wrap">
                          {selectedDress.colors.map(c => (
                            <span key={c} className="text-xs px-4 py-2 border border-[var(--color-border)] text-[#605F5F] tracking-wide">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider font-bold text-[var(--color-accent-light)] mb-4">Mărimi</span>
                        <div className="flex gap-2 flex-wrap">
                          {selectedDress.sizes.map(s => (
                            <span key={s} className="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-xs text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white transition-colors cursor-pointer">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4 pb-10">
                    <div className="flex flex-col gap-4">
                      <Link to={`/programare?dressId=${selectedDress.id}`} className="w-full">
                        <Button variant="primary" className="w-full">
                          Programează Vizită
                        </Button>
                      </Link>

                      <Button
                        onClick={() => selectedDress && toggleWardrobe(selectedDress)}
                        variant="secondary"
                        className="w-full"
                        icon={isInWardrobe(selectedDress.id) ? "♥" : "♡"}
                      >
                        {isInWardrobe(selectedDress.id) ? "În Garderobă" : "Adaugă la Wishlist"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal >

          {/* Feature Modals */}
          {
            selectedDress && (
              <AppointmentModal
                dress={selectedDress}
                isOpen={modalType === 'appointment'}
                onClose={() => setModalType('details')}
                location="Oradea"
              />
            )
          }

          {/* Global Appointment Modal */}
          <AppointmentModal
            isOpen={modalType === 'global-appointment'}
            onClose={() => setModalType(null)}
            location="Oradea"
          />

          <ImageZoomModal
            isOpen={!!zoomImage}
            onClose={() => setZoomImage(null)}
            imageUrl={zoomImage}
          />

          {/* Toast Notification */}
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-[var(--color-text)] text-white px-8 py-4 shadow-xl flex items-center gap-3">
              <span className="text-sm font-light tracking-wide">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}