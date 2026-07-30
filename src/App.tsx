import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

import Nav from './ui/Nav';
import Footer from './ui/Footer';
import Preloader from './ui/Preloader';
import { Cursor, useScrollFx } from './lib/motion';
import { useWishlist } from './lib/useWishlist';
import { SALON } from './data/salon';

const Homepage = lazy(() => import('./pages/Homepage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const CollectionsIndex = lazy(() => import('./pages/CollectionsIndex'));
const DressPage = lazy(() => import('./pages/DressPage'));
const Atelier = lazy(() => import('./pages/Atelier'));
const Programare = lazy(() => import('./pages/Programare'));
const Admin = lazy(() => import('./pages/Admin'));

const PIXEL_ID = '615819990278598';

/** Rutele care au hero întunecat pe toată lățimea; restul primesc nav pe text închis. */
const DARK_HERO = ['/', '/imperial', '/anna', '/mayra', '/beverly', '/atelier', '/programare'];

const Fallback: React.FC = () => (
  <div className="sec" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
    <span className="eyebrow">Se încarcă</span>
  </div>
);

const NotFound: React.FC = () => (
  <section className="sec" style={{ paddingTop: 'clamp(140px, 22vh, 240px)' }}>
    <p className="eyebrow">Eroare 404</p>
    <h1 className="h2" style={{ marginBlock: 24 }}>
      Pagina asta nu există
    </h1>
    <p className="body">Probabil linkul e vechi. Colecțiile sunt toate aici.</p>
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
      <Link className="btn" to="/colectii">
        <span>Vezi colecțiile</span>
        <i>&rarr;</i>
      </Link>
      <Link className="btn btn--outline" to="/">
        <span>Acasă</span>
      </Link>
    </div>
  </section>
);

export default function App() {
  const location = useLocation();
  const [booted, setBooted] = useState(false);
  const { solid, progressRef } = useScrollFx(location.pathname);
  const wishlist = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (booted) document.body.classList.add('ready');
  }, [booted]);

  useEffect(() => {
    ReactPixel.init(PIXEL_ID, undefined, { autoConfig: true, debug: false });
    ReactPixel.pageView();
  }, [location.pathname]);

  // Reținem sursa campaniei o singură dată, ca s-o putem trimite cu programarea.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmCampaign = params.get('utm_campaign');
    const voucher = params.get('voucher');
    if (!utmSource && !utmCampaign && !voucher) return;

    try {
      const stored = JSON.parse(window.localStorage.getItem('fya_tracking') || '{}');
      window.localStorage.setItem(
        'fya_tracking',
        JSON.stringify({
          ...stored,
          utm_source: utmSource || stored.utm_source,
          utm_campaign: utmCampaign || stored.utm_campaign,
          voucher: voucher || stored.voucher,
        })
      );
    } catch {
      // tracking-ul e opțional, nu blocăm navigarea pentru el
    }
  }, []);

  const isAdmin = location.pathname.startsWith('/admin');
  const forceInk = !DARK_HERO.includes(location.pathname);

  return (
    <>
      <a className="skip" href="#main">
        Sari la conținut
      </a>

      {!booted && <Preloader onDone={() => setBooted(true)} />}

      <div className="prog" ref={progressRef} aria-hidden="true" />
      <Cursor />

      {!isAdmin && <Nav solid={solid} forceInk={forceInk} wishlistCount={wishlist.count} />}

      <main id="main">
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/colectii" element={<CollectionsIndex />} />
            <Route path="/imperial" element={<CollectionPage slug="imperial" />} />
            <Route path="/anna" element={<CollectionPage slug="anna" />} />
            <Route path="/mayra" element={<CollectionPage slug="mayra" />} />
            <Route path="/beverly" element={<CollectionPage slug="beverly" />} />
            <Route path="/colectia/:slug" element={<CollectionPage />} />
            <Route path="/rochie/:id" element={<DressPage />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/despre-noi" element={<Atelier />} />
            <Route path="/programare" element={<Programare />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && <Footer />}

      {!isAdmin && location.pathname !== '/programare' && (
        <>
          <Link className="btn fab" to="/programare">
            <span>Programează</span>
            <i>&rarr;</i>
          </Link>

          <nav className="mbar" aria-label="Acțiuni rapide">
            <a href={`tel:${SALON.phoneHref}`}>Sună</a>
            <Link to="/colectii">Colecții</Link>
            <Link to="/programare" className="cta">
              Programare{wishlist.count > 0 ? ` (${wishlist.count})` : ''}
            </Link>
          </nav>
        </>
      )}
    </>
  );
}
