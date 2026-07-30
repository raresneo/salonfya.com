import React from 'react';
import { Link } from 'react-router-dom';

import { COLLECTIONS } from '../data/catalog';
import { useCatalog } from '../lib/useCatalog';
import { Reveal, SmartImage } from '../lib/motion';
import { SALON } from '../data/salon';

const RATIOS = ['r34', 'r45', 'r11', 'r23'];
const SPEEDS = ['0.16', '0.26', '0.2', '0.3'];

const Homepage: React.FC = () => {
  const { dresses } = useCatalog();

  const countFor = (name: string) => dresses.filter((dress) => dress.collection === name).length;

  return (
    <>
      {/* ---------------------------------- hero --------------------------------- */}
      <section className="hero">
        <div className="hero-media">
          <video autoPlay muted loop playsInline preload="metadata" poster="/images/history_hero_portrait.png" aria-hidden="true">
            <source src="/images/CINEMATIC.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero-in">
          <p className="eyebrow eyebrow--light line" style={{ ['--i' as any]: 0 }}>
            <span>Atelier de rochii de mireasă · Oradea</span>
          </p>
          <h1 className="display">
            <span className="line" style={{ ['--i' as any]: 1 }}>
              <span>Rochii de mireasă,</span>
            </span>
            <span className="line" style={{ ['--i' as any]: 2 }}>
              <span className="it">croite în Oradea.</span>
            </span>
          </h1>
          <p className="lead line" style={{ ['--i' as any]: 3 }}>
            <span>
              Schița, croiala și ultima ajustare se fac în atelierul nostru. Nimic externalizat, nimic comandat gata
              făcut.
            </span>
          </p>
          <div className="line" style={{ ['--i' as any]: 4 }}>
            <span>
              <span className="hero-cta">
                <Link className="btn" to="/programare">
                  <span>Programează o probă</span>
                  <i>&rarr;</i>
                </Link>
                <Link className="btn btn--ghost" to="/colectii">
                  <span>Vezi cele {dresses.length} rochii</span>
                </Link>
              </span>
            </span>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <u />
          Derulează
        </div>
      </section>

      {/* -------------------------------- manifest ------------------------------- */}
      <section className="sec manifest">
        <div>
          <Reveal as="p" className="eyebrow">
            Ce ne diferențiază
          </Reveal>
          <Reveal index={1} className="manifest-state" style={{ marginTop: 24 }}>
            Nu trimitem rochia în altă parte. Se desenează, se coase și se ajustează la{' '}
            <span className="it">același etaj</span>.
          </Reveal>
        </div>

        <div className="manifest-side">
          <Reveal as="p" index={2} className="body">
            Majoritatea saloanelor cumpără modele de la furnizori și externalizează modificările. La FYA croitoria e a
            noastră. Asta înseamnă că poți schimba un decolteu cu trei săptămâni înainte de nuntă, iar răspunsul rămâne
            da.
          </Reveal>

          <Reveal as="div" index={3}>
            <dl className="pair">
              <dt>Design</dt>
              <dd>Pornim de la o schiță făcută cu tine, nu de la catalog.</dd>
            </dl>
          </Reveal>
          <Reveal as="div" index={4}>
            <dl className="pair">
              <dt>Execuție</dt>
              <dd>Tăiat, cusut și brodat în atelierul din Oradea.</dd>
            </dl>
          </Reveal>
          <Reveal as="div" index={5}>
            <dl className="pair">
              <dt>Ajustări</dt>
              <dd>Continuăm până la proba finală, oricâte sunt nevoie.</dd>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------- bandă -------------------------------- */}
      <div className="band" aria-hidden="true">
        <div className="band-track">
          {[0, 1].map((pass) => (
            <React.Fragment key={pass}>
              <span>Atelier propriu</span>
              <span>{dresses.length} rochii în colecții</span>
              <span>Ajustări în casă</span>
              <span>Probe pe bază de programare</span>
              <span>Mirese din {SALON.reach.length} județe</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* -------------------------------- colecții ------------------------------- */}
      <section className="sec" id="colectii">
        <div className="coll-head">
          <Reveal as="p" className="eyebrow">
            Colecțiile
          </Reveal>
          <Reveal as="h2" index={1} className="h2">
            Patru colecții, <span className="it">un singur atelier</span>
          </Reveal>
          <Reveal as="p" index={2} className="body">
            Fiecare colecție acoperă toată paleta de siluete și materiale. Alegi ce te reprezintă, restul îl croim pe
            tine.
          </Reveal>
        </div>

        <div className="coll-grid">
          {COLLECTIONS.map((item, i) => (
            <Reveal key={item.slug} mode="wipe" index={i} as="div">
              <Link className="item" to={item.path}>
                <div className={`item-frame ${RATIOS[i]}`} data-par={SPEEDS[i]} data-label={item.collection}>
                  <SmartImage src={item.cover} alt={`Colecția ${item.collection}`} sizes="(max-width: 860px) 100vw, 45vw" />
                </div>
                <div className="item-meta">
                  <div>
                    <p className="item-num tnum">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="item-name">{item.collection}</h3>
                    <span className="link-go">
                      {countFor(item.collection) || ''} {countFor(item.collection) ? 'rochii' : 'Vezi colecția'} <u />
                    </span>
                  </div>
                  <p className="item-note">{item.note}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------- atelier ------------------------------- */}
      <section className="sec sec--plum">
        <div className="atelier-grid">
          <div className="atelier-pin">
            <Reveal as="figure" mode="wipe">
              <SmartImage src="/images/atelier_hands_sewing.png" alt="Mâini care cos o rochie în atelierul FYA" />
            </Reveal>
            <figcaption>Atelier FYA · Oradea, Bihor</figcaption>
          </div>

          <div>
            <Reveal as="p" className="eyebrow eyebrow--light">
              Cum lucrăm
            </Reveal>
            <Reveal as="h2" index={1} className="h2" style={{ marginBlock: '24px 64px' }}>
              De la o idee vagă la <span className="it">proba finală</span>
            </Reveal>

            <div className="steps">
              <Reveal as="article" className="step">
                <p className="step-n tnum">01</p>
                <h3 className="h3">Schița</h3>
                <p>
                  Vii cu o poză, un screenshot sau doar o senzație. Desenăm împreună până arată ca tine, nu ca modelul
                  din catalog.
                </p>
              </Reveal>
              <Reveal as="article" className="step">
                <p className="step-n tnum">02</p>
                <h3 className="h3">Croiala</h3>
                <p>
                  Materialul se taie și se coase aici. Vezi rochia cum crește pe manechin, cu fiecare probă
                  intermediară.
                </p>
              </Reveal>
              <Reveal as="article" className="step">
                <p className="step-n tnum">03</p>
                <h3 className="h3">Ajustarea</h3>
                <p>
                  Ultima probă e aproape de zi. Dacă se schimbă ceva pe drum, se schimbă și rochia, fără discuții
                  suplimentare.
                </p>
              </Reveal>
            </div>

            <Reveal className="atelier-foot">
              <Link className="btn btn--ghost" to="/atelier">
                <span>Vezi atelierul</span>
                <i>&rarr;</i>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------- citat -------------------------------- */}
      <section className="sec sec--warm">
        <Reveal as="p" className="eyebrow" style={{ textAlign: 'center' }}>
          Salon FYA
        </Reveal>
        <Reveal index={1} style={{ marginTop: 32 }}>
          <blockquote className="quote">
            La noi, doar imaginația e limita.
            <span className="quote-by">Deviza atelierului</span>
          </blockquote>
        </Reveal>

        <div className="strip">
          <Reveal as="figure" mode="wipe">
            <SmartImage src="/images/alma_detail.jpg" alt="Detaliu de broderie pe o rochie FYA" />
          </Reveal>
          <Reveal as="figure" mode="wipe" index={1}>
            <SmartImage src="/images/aurelia_closeup.jpg" alt="Detaliu de corset lucrat manual" />
          </Reveal>
          <Reveal as="figure" mode="wipe" index={2}>
            <SmartImage src="/images/daiana_detail_2.jpg" alt="Detaliu de dantelă aplicată manual" />
          </Reveal>
        </div>

        <Reveal className="callout">
          <p className="eyebrow">Miresele noastre</p>
          <p>
            Dacă ai purtat o rochie FYA, trimite-ne o poză din ziua nunții. O publicăm cu prenumele tău, fără presiune
            și fără termen.
          </p>
          <a className="link-go" href={`mailto:${SALON.email}?subject=Poz%C4%83%20de%20la%20nunt%C4%83`}>
            Trimite o poză <u />
          </a>
        </Reveal>
      </section>

      {/* ----------------------------------- CTA --------------------------------- */}
      <section className="sec sec--deep">
        <Reveal as="p" className="eyebrow eyebrow--light">
          Următorul pas
        </Reveal>
        <Reveal as="h2" index={1} className="h2" style={{ marginBlock: 24 }}>
          Vino la o probă, <span className="it">fără obligații</span>
        </Reveal>
        <Reveal as="p" index={2} className="body body--light">
          Lucrăm pe programare, ca să îți dedicăm salonul întreg. Lasă un număr de telefon și te sunăm noi ca să fixăm
          ziua.
        </Reveal>
        <Reveal index={3} style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link className="btn" to="/programare">
            <span>Programează o probă</span>
            <i>&rarr;</i>
          </Link>
          <a className="btn btn--ghost" href={`tel:${SALON.phoneHref}`}>
            <span>{SALON.phone}</span>
          </a>
        </Reveal>
      </section>
    </>
  );
};

export default Homepage;
