import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCatalog } from '../lib/useCatalog';
import { useWishlist } from '../lib/useWishlist';
import { Reveal, SmartImage } from '../lib/motion';
import { priceLabel } from '../ui/DressCard';
import { SALON } from '../data/salon';

const DressPage: React.FC = () => {
  const { id } = useParams();
  const { dresses, loading } = useCatalog();
  const wishlist = useWishlist();
  const [zoom, setZoom] = useState<string | null>(null);

  const dress = useMemo(() => dresses.find((item) => item.id === id), [dresses, id]);

  const neighbours = useMemo(() => {
    if (!dress) return { prev: undefined, next: undefined };
    const family = dresses.filter((item) => item.collection === dress.collection);
    const at = family.findIndex((item) => item.id === dress.id);
    return { prev: family[at - 1], next: family[at + 1] };
  }, [dresses, dress]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoom(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('is-locked');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [zoom]);

  useEffect(() => {
    if (dress) document.title = `${dress.name} · Salon FYA`;
    return () => {
      document.title = 'Salon FYA · Rochii de mireasă croite în atelier, Oradea';
    };
  }, [dress]);

  if (loading && !dress) {
    return (
      <section className="dress">
        <div className="gallery">
          <div className="sk" />
          <div className="sk" />
          <div className="sk" />
        </div>
        <div>
          <div className="sk-line" style={{ width: '40%', height: 32 }} />
          <div className="sk-line" />
          <div className="sk-line" />
        </div>
      </section>
    );
  }

  if (!dress) {
    return (
      <section className="sec" style={{ paddingTop: 'clamp(140px, 22vh, 240px)' }}>
        <p className="eyebrow">Model indisponibil</p>
        <h1 className="h2" style={{ marginBlock: 24 }}>
          Rochia asta nu mai e în catalog
        </h1>
        <p className="body">Se poate să fi fost vândută sau redenumită. Restul modelelor sunt aici.</p>
        <Link className="btn" to="/colectii" style={{ marginTop: 32 }}>
          <span>Vezi toate rochiile</span>
          <i>&rarr;</i>
        </Link>
      </section>
    );
  }

  const gallery = dress.images && dress.images.length > 0 ? dress.images : [dress.imageUrl];
  const saved = wishlist.has(dress.id);

  return (
    <>
      <section className="dress">
        <div className="gallery">
          {gallery.map((src, i) => (
            <figure key={`${src}-${i}`} onClick={() => setZoom(src)}>
              <SmartImage
                src={src}
                alt={`${dress.name}, imaginea ${i + 1}`}
                eager={i === 0}
                sizes="(max-width: 640px) 100vw, 55vw"
              />
            </figure>
          ))}

          {dress.sketches && dress.sketches.length > 0 && (
            <>
              {dress.sketches.map((src, i) => (
                <figure key={`sketch-${i}`} onClick={() => setZoom(src)}>
                  <SmartImage src={src} alt={`Schița de design pentru ${dress.name}`} />
                </figure>
              ))}
            </>
          )}
        </div>

        <div className="dress-info">
          <div>
            {dress.collection && (
              <Link className="eyebrow" to={`/colectia/${dress.collection.toLowerCase()}`}>
                Colecția {dress.collection}
              </Link>
            )}
            <h1 className="dress-name" style={{ marginTop: 12 }}>
              {dress.name}
            </h1>
          </div>

          {dress.description ? (
            <p className="body">{dress.description}</p>
          ) : (
            <p className="body">
              Modelul se probează în atelier, unde vedem împreună cum cade pe tine și ce ajustăm. Croiala, mărimea și
              finisajele se stabilesc la fața locului.
            </p>
          )}

          <dl className="dress-specs">
            <div className="spec">
              <dt>Preț</dt>
              <dd>{priceLabel(dress)}</dd>
            </div>
            {dress.sizes.length > 0 && (
              <div className="spec">
                <dt>Mărimi</dt>
                <dd>{dress.sizes.join(' · ')}</dd>
              </div>
            )}
            {dress.colors.length > 0 && (
              <div className="spec">
                <dt>Culori</dt>
                <dd>{dress.colors.join(' · ')}</dd>
              </div>
            )}
            {dress.details?.fabric && (
              <div className="spec">
                <dt>Material</dt>
                <dd>{dress.details.fabric}</dd>
              </div>
            )}
            {dress.details?.silhouette && (
              <div className="spec">
                <dt>Siluetă</dt>
                <dd>{dress.details.silhouette}</dd>
              </div>
            )}
            {dress.details?.neckline && (
              <div className="spec">
                <dt>Decolteu</dt>
                <dd>{dress.details.neckline}</dd>
              </div>
            )}
            <div className="spec">
              <dt>Ajustări</dt>
              <dd>Făcute în atelier</dd>
            </div>
          </dl>

          <div className="dress-actions">
            <Link className="btn" to={`/programare?dressId=${encodeURIComponent(dress.id)}`}>
              <span>Probează {dress.name}</span>
              <i>&rarr;</i>
            </Link>
            <button className="btn btn--outline" onClick={() => wishlist.toggle(dress.id)} aria-pressed={saved}>
              <span>{saved ? 'Salvată în listă' : 'Salvează pentru probă'}</span>
            </button>
            <a className="btn btn--outline" href={`tel:${SALON.phoneHref}`}>
              <span>Întreabă la telefon</span>
            </a>
          </div>

          {dress.sketches && dress.sketches.length > 0 && (
            <p className="sketch-note">Schițele de mai jos sunt conceptul original, desenat înainte de croială.</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingTop: 8 }}>
            {neighbours.prev ? (
              <Link className="link-go" to={`/rochie/${neighbours.prev.id}`}>
                <u /> {neighbours.prev.name}
              </Link>
            ) : (
              <span />
            )}
            {neighbours.next && (
              <Link className="link-go" to={`/rochie/${neighbours.next.id}`}>
                {neighbours.next.name} <u />
              </Link>
            )}
          </div>
        </div>
      </section>

      {zoom && (
        <div className="lb" onClick={() => setZoom(null)} role="dialog" aria-label={`${dress.name} mărit`}>
          <button className="lb-close">Închide</button>
          <img src={zoom} alt={dress.name} />
        </div>
      )}
    </>
  );
};

export default DressPage;
