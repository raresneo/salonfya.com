import React, { useMemo, useState } from 'react';

import { COLLECTIONS } from '../data/catalog';
import { useCatalog } from '../lib/useCatalog';
import DressCard from '../ui/DressCard';
import { Reveal } from '../lib/motion';

const CollectionsIndex: React.FC = () => {
  const { dresses, loading } = useCatalog();
  const [filter, setFilter] = useState<string>('all');

  const visible = useMemo(
    () => (filter === 'all' ? dresses : dresses.filter((dress) => dress.collection === filter)),
    [dresses, filter]
  );

  return (
    <>
      <section className="phero">
        <div className="phero-media">
          <img src="/images/atelier_royal_vintage.png" alt="" aria-hidden="true" />
        </div>
        <div className="phero-in">
          <p className="eyebrow eyebrow--light">Catalog</p>
          <h1 className="h2">Toate rochiile</h1>
          <p className="lead body--light">
            Patru colecții, croite și ajustate în atelierul din Oradea. Prețul și mărimile se discută la probă, pe
            modelul care te interesează.
          </p>
        </div>
      </section>

      <section className="sec sec--tight">
        <div className="filters">
          <button className={`chip${filter === 'all' ? ' on' : ''}`} onClick={() => setFilter('all')}>
            Toate ({dresses.length})
          </button>
          {COLLECTIONS.map((item) => {
            const count = dresses.filter((dress) => dress.collection === item.collection).length;
            if (count === 0) return null;
            return (
              <button
                key={item.slug}
                className={`chip${filter === item.collection ? ' on' : ''}`}
                onClick={() => setFilter(item.collection)}
              >
                {item.collection} ({count})
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="cat-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="sk" />
                <div className="sk-line" />
              </div>
            ))}
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="state">
            <h3>Încă nu avem rochii încărcate aici</h3>
            <p>Colecția se completează pe măsură ce fotografiem modelele. Scrie-ne și îți trimitem ce avem în atelier.</p>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="cat-grid">
            {visible.map((dress, i) => (
              <DressCard key={dress.id} dress={dress} index={i} showCollection={filter === 'all'} />
            ))}
          </div>
        )}

        <Reveal style={{ marginTop: 64 }}>
          <p className="body">
            Nu găsești exact ce cauți? Vino cu o poză sau o idee și o desenăm împreună. Croitoria e la noi, deci putem
            porni de la zero.
          </p>
        </Reveal>
      </section>
    </>
  );
};

export default CollectionsIndex;
