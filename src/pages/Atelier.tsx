import React from 'react';
import { Link } from 'react-router-dom';

import { Reveal, SmartImage } from '../lib/motion';

const Atelier: React.FC = () => (
  <>
    <section className="phero phero--editorial">
      <div className="phero-media">
        <img src="/images/AURORA/CARA/CARA_03_detaliu.jpg" alt="" aria-hidden="true" />
      </div>
      <div className="phero-in">
        <p className="eyebrow eyebrow--light">Atelierul</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}>
          Totul se întâmplă <span className="it">în același loc</span>
        </h1>
        <p className="lead body--light">
          De la prima probă până la ultima ajustare înainte de nuntă. Rochiile la comandă le croim aici, iar pe cele din
          colecții le ajustăm pe tine în același atelier.
        </p>
      </div>
    </section>

    <section className="sec manifest">
      <div>
        <Reveal as="p" className="eyebrow">
          De ce contează
        </Reveal>
        <Reveal index={1} className="manifest-state" style={{ marginTop: 24 }}>
          Când atelierul e la același etaj, o modificare nu mai înseamnă <span className="it">așteptare</span>.
        </Reveal>
      </div>
      <div className="manifest-side">
        <Reveal as="p" index={2} className="body">
          Se măsoară, se desface și se coase din nou, la noi. Asta contează mai ales cu trei săptămâni înainte de
          nuntă.
        </Reveal>
        <Reveal as="div" index={3}>
          <dl className="pair">
            <dt>La comandă</dt>
            <dd>Pentru rochiile la comandă schițăm, croim și cusem în atelierul propriu.</dd>
          </dl>
        </Reveal>
        <Reveal as="div" index={4}>
          <dl className="pair">
            <dt>Din colecții</dt>
            <dd>Rochiile din colecții sunt alese de noi și ajustate pe tine aici.</dd>
          </dl>
        </Reveal>
        <Reveal as="div" index={5}>
          <dl className="pair">
            <dt>Reparații</dt>
            <dd>Inclusiv pe rochii care nu sunt cumpărate de la noi.</dd>
          </dl>
        </Reveal>
      </div>
    </section>

    <section className="sec sec--plum">
      <div className="atelier-grid">
        <div className="atelier-pin">
          <Reveal as="figure" mode="wipe">
            <SmartImage src="/images/AURORA/EMMA/EMMA_01_plan_intreg.jpg" alt="Emma, din colecția Aurora" />
          </Reveal>
          <figcaption>Emma · Colecția Aurora</figcaption>
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
              <p>
                Luăm măsurile. Pentru o rochie la comandă desenăm varianta ta; pentru una din colecții notăm ce ajustăm
                față de model.
              </p>
            </Reveal>
            <Reveal as="article" className="step">
              <p className="step-n tnum">03</p>
              <h3 className="h3">Proba intermediară</h3>
              <p>Vezi rochia în lucru. Aici se corectează liniile, nu la final.</p>
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
          <SmartImage src="/images/NOBLESSE/FYA2803/FYA2803_03_detaliu_asezata.jpg" alt="Amelia, detaliu din colecția Noblesse" />
        </Reveal>
        <Reveal as="figure" mode="wipe" index={1}>
          <SmartImage src="/images/AURORA/CARA/CARA_01_plan_intreg.jpg" alt="Cara, din colecția Aurora" />
        </Reveal>
        <Reveal as="figure" mode="wipe" index={2}>
          <SmartImage src="/images/NOBLESSE/FYA2804/FYA2804_01_plan_intreg.jpg" alt="Antonia, din colecția Noblesse" />
        </Reveal>
      </div>
    </section>
  </>
);

export default Atelier;
