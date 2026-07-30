import React, { useEffect, useRef, useState } from 'react';

const prefersReduced = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------- Reveal ---------------------------------- */

type RevealProps = {
  children: React.ReactNode;
  /** 'up' translatează pe verticală, 'wipe' descoperă imaginea de jos în sus. */
  mode?: 'up' | 'wipe';
  /** Index pentru stagger, se transformă în delay de 80ms per pas. */
  index?: number;
  as?: 'div' | 'section' | 'article' | 'figure' | 'p' | 'span' | 'li';
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Descoperă conținutul la intrarea în viewport. Un singur observer per nod,
 * dezabonat imediat după prima intersecție, ca să nu ținem observeri activi
 * pentru tot documentul.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  mode = 'up',
  index = 0,
  as = 'div',
  className,
  style,
}) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      node.classList.add('is-in');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    observer.observe(node);

    // Plasă de siguranță: dacă observer-ul nu raportează niciodată (secțiune
    // ascunsă la mount, apoi afișată), descoperim conținutul oricum.
    const safety = window.setTimeout(() => node.classList.add('is-in'), 2600);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  const Tag = as as any;
  return (
    <Tag
      ref={ref as any}
      data-reveal={mode === 'wipe' ? 'wipe' : ''}
      className={className}
      style={{ ['--i' as any]: index, ...style }}
    >
      {children}
    </Tag>
  );
};

/* ------------------------------ Scroll FX -------------------------------- */

/**
 * Un singur rAF pentru tot ce depinde de scroll: bara de progres, starea
 * navului și parallax-ul. Nodurile cu parallax se declară cu `data-par`
 * (valoarea e viteza) și se recitesc la fiecare schimbare de rută.
 */
export const useScrollFx = (routeKey: string) => {
  const [solid, setSolid] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    let nodes: HTMLElement[] = [];
    let lastSolid = false;
    const reduced = prefersReduced();

    const collect = () => {
      nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-par]'));
    };

    // Nodurile lazy apar după primul render, deci recitim de câteva ori.
    collect();
    const timers = [120, 400, 1000].map((delay) => window.setTimeout(collect, delay));

    const tick = () => {
      const vh = window.innerHeight;
      const scrolled = window.scrollY || window.pageYOffset;
      const max = document.documentElement.scrollHeight - vh;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? scrolled / max : 0})`;
      }

      const nextSolid = scrolled > Math.min(vh * 0.8, 560);
      if (nextSolid !== lastSolid) {
        lastSolid = nextSolid;
        setSolid(nextSolid);
      }

      if (!reduced) {
        for (const node of nodes) {
          const rect = node.getBoundingClientRect();
          if (rect.bottom < -300 || rect.top > vh + 300) continue;
          const mid = (rect.top + rect.height / 2 - vh / 2) / vh;
          const speed = parseFloat(node.dataset.par || '0.2');
          node.style.setProperty('--py', `${(mid * speed * -90).toFixed(2)}px`);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [routeKey]);

  return { solid, progressRef };
};

/* -------------------------------- Cursor --------------------------------- */

/** Cursor personalizat, doar pe pointer fin și fără reduced motion. */
export const Cursor: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReduced() || !window.matchMedia('(pointer:fine)').matches) return;

    let targetX = -50;
    let targetY = -50;
    let x = -50;
    let y = -50;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [data-cursor]');
      node.classList.toggle('big', Boolean(interactive));
    };

    const ride = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      node.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      frame = requestAnimationFrame(ride);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    frame = requestAnimationFrame(ride);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
};

/* --------------------------------- Media --------------------------------- */

type SmartImageProps = {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
  sizes?: string;
};

/**
 * Imagine cu fade la încărcare și stare explicită de eroare.
 *
 * Atenție la cazul care a golit homepage-ul o dată: dacă imaginea e deja în
 * cache, `load` se declanșează înainte ca React să atașeze handler-ul, deci
 * `onLoad` nu mai vine niciodată. De aceea verificăm `complete` la mount și
 * păstrăm și un timeout de siguranță: o poză vizibilă fără fade e infinit mai
 * bună decât o secțiune goală.
 */
export const SmartImage: React.FC<SmartImageProps> = ({ src, alt, eager, className, sizes }) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // src nou, o luăm de la capăt (altfel a doua rochie moștenea starea primei)
    setLoaded(false);

    const image = ref.current;
    if (!image) return;

    image.style.removeProperty('display');
    image.parentElement?.classList.remove('failed');

    if (image.complete && image.naturalWidth > 0) {
      setLoaded(true);
      return;
    }

    const safety = window.setTimeout(() => setLoaded(true), 2500);
    return () => window.clearTimeout(safety);
  }, [src]);

  const markFailed = () => {
    const image = ref.current;
    if (!image) return;
    image.style.display = 'none';
    image.parentElement?.classList.add('failed');
  };

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      className={[className, loaded ? 'loaded' : ''].filter(Boolean).join(' ')}
      onLoad={() => setLoaded(true)}
      onError={markFailed}
    />
  );
};
