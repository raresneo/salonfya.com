import React from 'react';
import { Link } from 'react-router-dom';

import { Reveal, SmartImage } from '../lib/motion';
import { SALON } from '../data/salon';

const Atelier: React.FC = () => (
  <>
    <section className="phero">
      <div className="phero-media">
        <img src="/images/atelier_vintage.png" alt="" aria-hidden="true" />
      </div>
      <div className="phero-in">
        <p className="eyebrow eyebrow--light">Atelierul</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}>
          Totul se întâmplă <span className="it">în același loc</span>
        </h1>
        <p className="lead body--light">
          De la prima schiță până la ultima ajustare înainte de nuntă. Nu externalizăm lucrul la rochii, deci vedem și
          verificăm fiecare detaliu.
        </p>
      </div>
    </section>

    <section className="sec manifest">
      <div>
        <Reveal as="p" className="eyebrow">
          De ce contează
        </Reveal>
        <Reveal index={1} className="manifest-state" style={{ marginTop: 24 }}>
          Un salon care externalizează croitoria îți poate spune doar <span className="it">nu se mai poate</span>.
        </Reveal>
      </div>
      <div className="manifest-side">
        <Reveal as="p" index={2} className="body">
          Când croitoria e în casă, o modificare nu mai e o negociere cu un furnizor. Se măsoară, se desface, se coase
          din nou. Asta schimbă complet ce îți putem promite cu trei săptămâni înainte de nuntă.
        </Reveal>
        <Reveal as="div" index={3}>
          <dl className="pair">
            <dt>Design și execuție</dt>
            <dd>Schițăm, tăiem, cusem și brodăm în atelierul propriu.</dd>
          </dl>
        </Reveal>
        <Reveal as="div" index={4}>
          <dl className="pair">
            <dt>Reparații</dt>
            <dd>Inclusiv pe rochii care nu sunt cumpărate de la noi.</dd>
          </dl>
        </Reveal>
        <Reveal as="div" index={5}>
          <dl className="pair">
            <dt>Acoperire</dt>
            <dd>Vin mirese din {SALON.reach.join(', ')}.</dd>
          </dl>
        </Reveal>
      </div>
    </section>

    <section className="sec sec--plum">
      <div className="atelier-grid">
        <div className="atelier-pin">
          <Reveal as="figure" mode="wipe">
            <SmartImage src="/images/atelier_royal_vintage.png" alt="Interiorul atelierului FYA" />
          </Reveal>
          <figcaption>Atelier și showroom · {SALON.address}</figcaption>
        </div>

        <div>
          <Reveal as="p" className="eyebrow eyebrow--light">
            Procesul, pas cu pas
          </Reveal>
          <Reveal as="h2" index={1} className="h2" style={{ marginBlock: '24px 64px' }}>
            Patru întâlniri, <span className="it">o rochie</span>
          </Reveal>

          <div className="steps">
            <Reveal as="article" className="step">
              <p className="step-n tnum">01</p>
              <h3 className="h3">Prima probă</h3>
              <p>
                Încerci modele din colecții ca să vedem ce siluetă îți vine bine. Nu e nevoie să știi de la început ce
                vrei.
              </p>
            </Reveal>
            <Reveal as="article" className="step">
              <p className="step-n tnum">02</p>
              <h3 className="h3">Măsuri și schiță</h3>
              <p>Luăm măsurile și desenăm varianta ta, cu modificările pe care le vrei față de model.</p>
            </Reveal>
            <Reveal as="article" className="step">
              <p className="step-n tnum">03</p>
              <h3 className="h3">Proba intermediară</h3>
              <p>Vezi rochia pe jumătate lucrată. Aici se corectează liniile, nu la final.</p>
            </Reveal>
            <Reveal as="article" className="step">
              <p className="step-n tnum">04</p>
              <h3 className="h3">Proba finală</h3>
              <p>Ultimele ajustări aproape de zi, ca rochia să fie potrivită pe corpul de atunci, nu de acum.</p>
            </Reveal>
          </div>

          <Reveal className="atelier-foot">
            <Link className="btn" to="/programare">
              <span>Programează prima probă</span>
              <i>&rarr;</i>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="sec sec--warm sec--tight">
      <div className="strip">
        <Reveal as="figure" mode="wipe">
          <SmartImage src="/images/atelier_hands_sewing.png" alt="Cusut manual în atelier" />
        </Reveal>
        <Reveal as="figure" mode="wipe" index={1}>
          <SmartImage src="/images/feminity_vintage.png" alt="Probă de rochie în showroom" />
        </Reveal>
        <Reveal as="figure" mode="wipe" index={2}>
          <SmartImage src="/images/jardin_vintage.png" alt="Rochie finalizată în atelier" />
        </Reveal>
      </div>
    </section>
  </>
);

export default Atelier;
