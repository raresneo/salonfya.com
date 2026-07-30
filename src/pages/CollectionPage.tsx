import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { COLLECTIONS, collectionBySlug } from '../data/catalog';
import { useCollection } from '../lib/useCatalog';
import DressCard from '../ui/DressCard';
import { Reveal } from '../lib/motion';

type CollectionPageProps = { slug?: string };

const CollectionPage: React.FC<CollectionPageProps> = ({ slug }) => {
  const params = useParams();
  const meta = collectionBySlug(slug || params.slug);
  const { dresses, loading } = useCollection(meta?.collection);

  if (!meta) {
    return (
      <section className="sec" style={{ paddingTop: 'clamp(140px, 22vh, 240px)' }}>
        <p className="eyebrow">Colecție necunoscută</p>
        <h1 className="h2" style={{ marginBlock: 24 }}>
          Nu avem colecția asta
        </h1>
        <Link className="btn" to="/colectii">
          <span>Vezi toate colecțiile</span>
          <i>&rarr;</i>
        </Link>
      </section>
    );
  }

  const others = COLLECTIONS.filter((item) => item.slug !== meta.slug);

  return (
    <>
      <section className="phero">
        <div className="phero-media">
          {meta.video ? (
            <video autoPlay muted loop playsInline preload="none" poster={meta.cover} aria-hidden="true">
              <source src={meta.video} type="video/mp4" />
            </video>
          ) : (
            <img src={meta.cover} alt="" aria-hidden="true" />
          )}
        </div>
        <div className="phero-in">
          <p className="eyebrow eyebrow--light">Colecția</p>
          <h1 className="display" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
            {meta.collection}
          </h1>
          <p className="lead body--light">{meta.intro}</p>
        </div>
      </section>

      <section className="sec sec--tight">
        {loading && (
          <div className="cat-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="sk" />
                <div className="sk-line" />
              </div>
            ))}
          </div>
        )}

        {!loading && dresses.length === 0 && (
          <div className="state">
            <h3>Fotografiem încă modelele din {meta.collection}</h3>
            <p>Între timp poți vedea celelalte colecții sau ne poți scrie ca să îți trimitem pozele direct.</p>
            <Link className="btn" to="/colectii" style={{ marginTop: 16 }}>
              <span>Vezi celelalte colecții</span>
              <i>&rarr;</i>
            </Link>
          </div>
        )}

        {!loading && dresses.length > 0 && (
          <>
            <p className="eyebrow" style={{ marginBottom: 32 }}>
              {dresses.length} {dresses.length === 1 ? 'model' : 'modele'}
            </p>
            <div className="cat-grid">
              {dresses.map((dress, i) => (
                <DressCard key={dress.id} dress={dress} index={i} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="sec sec--deep sec--tight">
        <Reveal as="p" className="eyebrow eyebrow--light">
          Continuă
        </Reveal>
        <Reveal as="h2" index={1} className="h2" style={{ marginBlock: 24, maxWidth: '20ch' }}>
          Vezi și <span className="it">celelalte colecții</span>
        </Reveal>
        <Reveal index={2} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 32 }}>
          {others.map((item) => (
            <Link key={item.slug} className="btn btn--ghost" to={item.path}>
              <span>{item.collection}</span>
            </Link>
          ))}
          <Link className="btn" to="/programare">
            <span>Programează o probă</span>
            <i>&rarr;</i>
          </Link>
        </Reveal>
      </section>
    </>
  );
};

export default CollectionPage;
