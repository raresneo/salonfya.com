import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

import { useCatalog } from '../lib/useCatalog';
import { useWishlist } from '../lib/useWishlist';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { COLLECTIONS } from '../data/catalog';
import { SALON } from '../data/salon';
import { Reveal } from '../lib/motion';

type Errors = Partial<Record<'nume' | 'telefon' | 'data', string>>;

/** Preferințe de oră. Salonul lucrează pe programare, deci nu promitem intervale fixe. */
const SLOTS = ['Dimineața', 'La prânz', 'După-amiaza', 'Seara', 'Nu contează'];

const DAYS = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
const MONTHS = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie',
];

/** ISO local (YYYY-MM-DD), fără conversia la UTC care mută ziua cu una. */
const isoDay = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const startOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/** Următoarele zile, pornind de mâine: nimeni nu programează o probă peste o oră. */
const upcomingDays = (count: number) => {
  const base = startOfToday();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i + 1);
    return {
      iso: isoDay(date),
      dayShort: DAYS[date.getDay()].slice(0, 2),
      dayNumber: date.getDate(),
      monthShort: MONTHS[date.getMonth()].slice(0, 3),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });
};

/** Data, scrisă pe românește pentru mesajul de WhatsApp. */
const humanDate = (iso: string): string => {
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  const date = new Date(year, month - 1, day);
  return `${DAYS[date.getDay()]}, ${day} ${MONTHS[month - 1]} ${year}`;
};

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

  const days = useMemo(() => upcomingDays(21), []);
  const minDate = useMemo(() => isoDay(startOfToday()), []);

  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    nume: '',
    telefon: '',
    data: '',
    ora: SLOTS[SLOTS.length - 1],
    colectie: '',
    mesaj: '',
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  // Colecția se precompletează din rochia venită prin URL, dar numai o dată și
  // numai dacă mireasa nu a schimbat deja selecția.
  useEffect(() => {
    if (!dress?.collection) return;
    setForm((current) => (current.colectie ? current : { ...current, colectie: dress.collection as string }));
  }, [dress]);

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    };

  /** Mesajul trimis pe WhatsApp. Îl arătăm și în pagină, ca să nu fie o surpriză. */
  const message = useMemo(() => {
    const wanted = dress ? [dress.name, ...savedNames.filter((name) => name !== dress.name)] : savedNames;

    const lines: string[] = ['Bună! Vreau să programez o probă la Salon Fya.', ''];

    if (form.nume.trim()) lines.push(`Nume: ${form.nume.trim()}`);
    if (form.telefon.trim()) lines.push(`Telefon: ${form.telefon.trim()}`);
    if (form.data) lines.push(`Zi dorită: ${humanDate(form.data)}`);
    if (form.ora) lines.push(`Ora preferată: ${form.ora}`);
    if (form.colectie) lines.push(`Colecție: ${form.colectie}`);
    if (wanted.length > 0) lines.push(`Rochii: ${wanted.join(', ')}`);
    if (form.mesaj.trim()) lines.push(`Detalii: ${form.mesaj.trim()}`);

    return lines.join('\n');
  }, [form, dress, savedNames]);

  const whatsappHref = `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(message)}`;

  const validate = (): boolean => {
    const next: Errors = {};

    if (form.nume.trim().length < 2) next.nume = 'Scrie-ne cum te cheamă.';

    const digits = form.telefon.replace(/[^0-9]/g, '');
    if (digits.length < 9) next.telefon = 'Avem nevoie de un număr valid.';

    if (form.data && new Date(form.data) < startOfToday()) next.data = 'Alege o zi din viitor.';

    setErrors(next);

    if (Object.keys(next).length > 0) {
      formRef.current?.querySelector<HTMLInputElement>('.bad input')?.focus();
      return false;
    }
    return true;
  };

  /**
   * Butonul e un link real către wa.me, deci se deschide nativ, fără blocare de
   * popup. Aici doar validăm și, în fundal, salvăm cererea în baza de date.
   * Dacă inserarea eșuează nu oprim nimic: mesajul pleacă oricum.
   */
  const handleSend = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!validate()) {
      event.preventDefault();
      return;
    }

    const tracking = readTracking();

    if (isSupabaseConfigured) {
      void supabase
        .from('programari')
        .insert({
          nume: form.nume.trim(),
          telefon: form.telefon.trim(),
          data_dorita: form.data || null,
          interval_orar: form.ora,
          dress_id: dress?.id || null,
          colectie: form.colectie || null,
          mesaj: form.mesaj.trim() || null,
          sursa: 'salonfya.com / whatsapp',
          utm_source: tracking.utm_source || null,
          utm_campaign: tracking.utm_campaign || null,
          voucher: tracking.voucher || null,
        })
        .then(() => undefined);
    }

    try {
      ReactPixel.track('Schedule', {
        content_name: dress?.name || form.colectie || 'Probă rochie',
        method: 'whatsapp',
      });
    } catch {
      // pixelul poate fi blocat, nu afectează cererea
    }

    wishlist.clear();
    setSent(true);
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
            Alege ziua, <span className="it">restul îl vorbim</span>
          </h1>
          <p className="lead body--light">
            Completezi în 30 de secunde, apeși pe buton și cererea ajunge direct pe WhatsApp-ul salonului. Confirmăm ora
            în aceeași conversație.
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
                  <dt>Telefon și WhatsApp</dt>
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

            <Reveal index={4} className="map">
              <iframe
                src={SALON.mapsEmbed}
                title={`Harta către ${SALON.name}, ${SALON.addressFull}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>

          <div>
            {sent ? (
              <div className="done">
                <strong>Ți-am deschis conversația.</strong>
                <p>
                  Apasă pe trimite în WhatsApp și îți răspundem cu ora confirmată. Dacă nu s-a deschis singur, folosește
                  butonul de mai jos.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                  <a className="btn" href={whatsappHref} target="_blank" rel="noreferrer">
                    <span>Deschide WhatsApp</span>
                    <i>&rarr;</i>
                  </a>
                  <a className="btn btn--ghost" href={`tel:${SALON.phoneHref}`}>
                    <span>Sună direct</span>
                  </a>
                </div>
                <Link className="link-go" to="/colectii" style={{ marginTop: 16 }}>
                  Mai vezi rochii <u />
                </Link>
              </div>
            ) : (
              <form ref={formRef} onSubmit={(event) => event.preventDefault()} noValidate>
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
                      placeholder="07xx xxx xxx"
                      value={form.telefon}
                      onChange={set('telefon')}
                      required
                    />
                    <span className="err">{errors.telefon}</span>
                  </div>
                </div>

                <fieldset className="cal">
                  <legend>Alege ziua</legend>

                  <div className="cal-days" role="group" aria-label="Următoarele zile">
                    {days.map((day) => {
                      const active = form.data === day.iso;
                      return (
                        <button
                          key={day.iso}
                          type="button"
                          className={`cal-day${active ? ' on' : ''}${day.isWeekend ? ' wk' : ''}`}
                          aria-pressed={active}
                          onClick={() => {
                            setForm((current) => ({ ...current, data: active ? '' : day.iso }));
                            setErrors((current) => ({ ...current, data: undefined }));
                          }}
                        >
                          <span className="cal-dow">{day.dayShort}</span>
                          <span className="cal-num tnum">{day.dayNumber}</span>
                          <span className="cal-mon">{day.monthShort}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="cal-rest">
                    <div className={`field${errors.data ? ' bad' : ''}`}>
                      <label htmlFor="data">Sau altă dată</label>
                      <input id="data" name="data" type="date" min={minDate} value={form.data} onChange={set('data')} />
                      <span className="err">{errors.data}</span>
                    </div>

                    <div className="field">
                      <label>Ora preferată</label>
                      <div className="cal-slots" role="group" aria-label="Ora preferată">
                        {SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`cal-slot${form.ora === slot ? ' on' : ''}`}
                            aria-pressed={form.ora === slot}
                            onClick={() => setForm((current) => ({ ...current, ora: slot }))}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </fieldset>

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

                <div className="field">
                  <label htmlFor="mesaj">Vrei să adaugi ceva</label>
                  <textarea
                    id="mesaj"
                    name="mesaj"
                    rows={3}
                    placeholder="Data nunții, un model care ți-a plăcut, orice detaliu care ne ajută."
                    value={form.mesaj}
                    onChange={set('mesaj')}
                  />
                </div>

                <div className="preview">
                  <p className="eyebrow eyebrow--light">Mesajul care pleacă pe WhatsApp</p>
                  <pre>{message}</pre>
                </div>

                <div className="form-foot">
                  <a className="btn" href={whatsappHref} target="_blank" rel="noreferrer" onClick={handleSend}>
                    <span>Trimite pe WhatsApp</span>
                    <i>&rarr;</i>
                  </a>
                  <small>
                    Se deschide conversația cu salonul, cu mesajul completat. Confirmăm ora pe loc, în aceeași
                    conversație.
                  </small>
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
