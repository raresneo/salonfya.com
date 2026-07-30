import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

import { useCatalog } from '../lib/useCatalog';
import { useWishlist } from '../lib/useWishlist';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { COLLECTIONS } from '../data/catalog';
import { SALON } from '../data/salon';
import { Reveal } from '../lib/motion';

type Errors = Partial<Record<'nume' | 'telefon' | 'data', string>>;
type Status = 'idle' | 'sending' | 'done' | 'failed';

/**
 * Preferințe de interval, nu program de funcționare: salonul lucrează doar pe
 * bază de programare, deci nu promitem ore fixe.
 */
const SLOTS = ['Dimineața', 'La prânz', 'După-amiaza', 'Seara', 'Nu contează'];

const readTracking = (): Record<string, string> => {
  try {
    return JSON.parse(window.localStorage.getItem('fya_tracking') || '{}');
  } catch {
    return {};
  }
};

const Programare: React.FC = () => {
  const [params] = useSearchParams();
  const { dresses } = useCatalog();
  const wishlist = useWishlist();

  const preselected = params.get('dressId') || '';
  const dress = useMemo(() => dresses.find((item) => item.id === preselected), [dresses, preselected]);

  const savedNames = useMemo(
    () =>
      wishlist.ids
        .map((id) => dresses.find((item) => item.id === id)?.name)
        .filter((name): name is string => Boolean(name)),
    [wishlist.ids, dresses]
  );

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    nume: '',
    telefon: '',
    email: '',
    data: '',
    interval: SLOTS[SLOTS.length - 1],
    colectie: dress?.collection || '',
    mesaj: savedNames.length > 0 ? `Mă interesează: ${savedNames.join(', ')}.` : '',
  });

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const whatsappHref = useMemo(() => {
    const lines = [
      'Bună! Vreau să programez o probă la Salon Fya.',
      form.nume && `Nume: ${form.nume}`,
      form.data && `Data dorită: ${form.data}`,
      dress && `Rochie: ${dress.name}`,
      savedNames.length > 0 && `Rochii salvate: ${savedNames.join(', ')}`,
    ].filter(Boolean);
    return `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [form.nume, form.data, dress, savedNames]);

  const validate = (): boolean => {
    const next: Errors = {};

    if (form.nume.trim().length < 2) next.nume = 'Scrie-ne cum te cheamă.';

    const digits = form.telefon.replace(/[^0-9]/g, '');
    if (digits.length < 9) next.telefon = 'Avem nevoie de un număr valid.';

    if (form.data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.data) < today) next.data = 'Alege o dată din viitor.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    const tracking = readTracking();

    if (!isSupabaseConfigured) {
      setStatus('failed');
      return;
    }

    const { error } = await supabase.from('programari').insert({
      nume: form.nume.trim(),
      telefon: form.telefon.trim(),
      email: form.email.trim() || null,
      data_dorita: form.data || null,
      interval_orar: form.interval,
      dress_id: dress?.id || null,
      colectie: form.colectie || null,
      mesaj: form.mesaj.trim() || null,
      sursa: 'salonfya.com',
      utm_source: tracking.utm_source || null,
      utm_campaign: tracking.utm_campaign || null,
      voucher: tracking.voucher || null,
    });

    if (error) {
      setStatus('failed');
      return;
    }

    try {
      ReactPixel.track('Schedule', { content_name: dress?.name || form.colectie || 'Probă rochie' });
    } catch {
      // pixelul poate fi blocat de browser, nu afectează programarea
    }

    wishlist.clear();
    setStatus('done');
  };

  return (
    <>
      <section className="phero">
        <div className="phero-media">
          <img src="/images/feminity_vintage.png" alt="" aria-hidden="true" />
        </div>
        <div className="phero-in">
          <p className="eyebrow eyebrow--light">Programare</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}>
            Lucrăm doar <span className="it">pe programare</span>
          </h1>
          <p className="lead body--light">
            Ca să îți dedicăm salonul întreg, nu o jumătate de oră între alte două cliente. Lasă datele și te sunăm ca
            să fixăm ziua.
          </p>
        </div>
      </section>

      <section className="sec sec--deep">
        <div className="book-grid">
          <div className="book-side">
            {dress && (
              <Reveal>
                <p className="eyebrow eyebrow--light">Rochia selectată</p>
                <p className="h3" style={{ color: 'var(--sand)', marginTop: 8 }}>
                  {dress.name}
                </p>
                <Link className="link-go" to={`/rochie/${dress.id}`} style={{ marginTop: 12 }}>
                  Vezi modelul <u />
                </Link>
              </Reveal>
            )}

            {savedNames.length > 0 && (
              <Reveal index={1}>
                <p className="eyebrow eyebrow--light">Rochii salvate de tine</p>
                <p className="body body--light" style={{ marginTop: 8 }}>
                  {savedNames.join(' · ')}
                </p>
              </Reveal>
            )}

            <Reveal as="div" index={2}>
              <dl>
                <div>
                  <dt>Atelier și showroom</dt>
                  <dd>
                    <a href={SALON.maps} target="_blank" rel="noreferrer">
                      {SALON.street}, {SALON.city}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Telefon</dt>
                  <dd>
                    <a href={`tel:${SALON.phoneHref}`}>{SALON.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Program</dt>
                  <dd>{SALON.hours}</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal as="p" index={3} className="body body--light">
              Prima probă durează în jur de o oră. Poți veni însoțită, majoritatea mireselor vin cu mama sau cu o
              prietenă. {SALON.hoursNote}
            </Reveal>

            <Reveal index={4}>
              <a className="btn btn--ghost" href={whatsappHref} target="_blank" rel="noreferrer">
                <span>Scrie-ne pe WhatsApp</span>
                <i>&rarr;</i>
              </a>
            </Reveal>

            <Reveal index={5} className="map">
              <iframe
                src={SALON.mapsEmbed}
                title={`Harta către ${SALON.name}, ${SALON.addressFull}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>

          <div>
            {status === 'done' ? (
              <div className="done">
                <strong>Am primit cererea.</strong>
                <p>
                  Te sunăm în maximum o zi lucrătoare ca să fixăm ora. Dacă vrei mai repede, sună la {SALON.phone} sau
                  scrie-ne pe WhatsApp.
                </p>
                <Link className="btn btn--ghost" to="/colectii" style={{ marginTop: 16, justifySelf: 'start' }}>
                  <span>Mai vezi rochii</span>
                  <i>&rarr;</i>
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="row">
                  <div className={`field${errors.nume ? ' bad' : ''}`}>
                    <label htmlFor="nume">Nume</label>
                    <input id="nume" name="nume" autoComplete="name" value={form.nume} onChange={set('nume')} required />
                    <span className="err">{errors.nume}</span>
                  </div>
                  <div className={`field${errors.telefon ? ' bad' : ''}`}>
                    <label htmlFor="telefon">Telefon</label>
                    <input
                      id="telefon"
                      name="telefon"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.telefon}
                      onChange={set('telefon')}
                      required
                    />
                    <span className="err">{errors.telefon}</span>
                  </div>
                </div>

                <div className="row">
                  <div className={`field${errors.data ? ' bad' : ''}`}>
                    <label htmlFor="data">Data preferată</label>
                    <input id="data" name="data" type="date" value={form.data} onChange={set('data')} />
                    <span className="err">{errors.data}</span>
                  </div>
                  <div className="field">
                    <label htmlFor="interval">Când ți-ar fi comod</label>
                    <select id="interval" name="interval" value={form.interval} onChange={set('interval')}>
                      {SLOTS.map((slot) => (
                        <option key={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label htmlFor="email">Email, opțional</label>
                    <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} />
                  </div>
                  <div className="field">
                    <label htmlFor="colectie">Colecția care te atrage</label>
                    <select id="colectie" name="colectie" value={form.colectie} onChange={set('colectie')}>
                      <option value="">Nu m-am hotărât</option>
                      {COLLECTIONS.map((item) => (
                        <option key={item.slug} value={item.collection}>
                          {item.collection}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="mesaj">Ce ai în minte, opțional</label>
                  <textarea id="mesaj" name="mesaj" rows={3} value={form.mesaj} onChange={set('mesaj')} />
                </div>

                {status === 'failed' && (
                  <p className="form-err">
                    Nu am putut trimite cererea acum. Sună la <a href={`tel:${SALON.phoneHref}`}>{SALON.phone}</a> sau
                    scrie-ne pe{' '}
                    <a href={whatsappHref} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                    , mesajul e deja pregătit.
                  </p>
                )}

                <div className="form-foot">
                  <button className="btn" type="submit" disabled={status === 'sending'}>
                    <span>{status === 'sending' ? 'Se trimite' : 'Trimite cererea'}</span>
                    {status === 'sending' ? <i className="spin" /> : <i>&rarr;</i>}
                  </button>
                  <small>Te contactăm în maximum o zi lucrătoare. Nu trimitem newslettere.</small>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Programare;
