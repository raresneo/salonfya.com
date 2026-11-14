import React, { Suspense, lazy, useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

import Nav from './ui/Nav';
import Footer from './ui/Footer';
import { useScrollFx } from './lib/motion';
import { useWishlist } from './lib/useWishlist';
import { hasDarkHero } from './lib/routes';
import { applySeo, notFoundSeo, staticRouteSeo, useSeo } from './lib/seo';
import { COLLECTIONS } from './data/catalog';
import { SALON } from './data/salon';

const Homepage = lazy(() => import('./pages/Homepage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const CollectionsIndex = lazy(() => import('./pages/CollectionsIndex'));
const DressPage = lazy(() => import('./pages/DressPage'));
const Atelier = lazy(() => import('./pages/Atelier'));
const Programare = lazy(() => import('./pages/Programare'));
const Admin = lazy(() => import('./pages/Admin'));

const PIXEL_ID = '615819990278598';

/** Sluguri de colecție, pentru rutele cu hero întunecat. */
const COLLECTION_SLUGS = COLLECTIONS.map((item) => item.slug);

const Fallback: React.FC = () => (
  <div className="sec" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
    <span className="eyebrow">Se încarcă</span>
  </div>
);

const NotFound: React.FC = () => {
  const location = useLocation();
  useSeo(notFoundSeo(location.pathname));

  return (
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
};

export default function App() {
  const location = useLocation();
  const { solid, progressRef } = useScrollFx(location.pathname);
  const wishlist = useWishlist();

  useEffect(() => {
    // Instant: clasa scroll-smooth din index.html făcea fiecare navigare să
    // deruleze animat până sus, lent pe paginile lungi.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  // SEO pentru rutele fără date proprii. Colecțiile, rochiile și 404 îl setează singure.
  useEffect(() => {
    const meta = staticRouteSeo(location.pathname);
    if (meta) applySeo(meta);
  }, [location.pathname]);

  // Fără preloader: pagina apare imediat, `ready` pornește doar intrarea scurtă a titlului.
  useEffect(() => {
    const frame = requestAnimationFrame(() => document.body.classList.add('ready'));
    return () => cancelAnimationFrame(frame);
  }, []);

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
  const forceInk = !hasDarkHero(location.pathname, COLLECTION_SLUGS);

  return (
    <>
      <a className="skip" href="#main">
        Sari la conținut
      </a>

      <div className="prog" ref={progressRef} aria-hidden="true" />

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
            <Route path="/aurora" element={<CollectionPage slug="aurora" />} />
            <Route path="/noblesse" element={<CollectionPage slug="noblesse" />} />
            <Route path="/colectia/:slug" element={<CollectionPage />} />
            {/* Redenumiri Aurora 14 nov (catalog Beatrice, aprobat de Rares la 17:59): CARA->ANABELLE, EMMA->ANNA, MEGAN->DIANA. Linkurile vechi rămân funcționale. */}
            <Route path="/rochie/aurora-cara" element={<Navigate to="/rochie/aurora-anabelle" replace />} />
            <Route path="/rochie/aurora-emma" element={<Navigate to="/rochie/aurora-anna" replace />} />
            <Route path="/rochie/aurora-megan" element={<Navigate to="/rochie/aurora-diana" replace />} />
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
