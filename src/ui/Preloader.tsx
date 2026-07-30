import React, { useEffect, useRef, useState } from 'react';

type PreloaderProps = { onDone: () => void };

const DURATION = 900;

/**
 * Cortina de deschidere. Durată fixă și scurtă, animată din rAF, nu dependentă
 * de evenimente de rețea: varianta veche aștepta încărcarea completă și lăsa
 * ecranul blocat secunde întregi.
 */
const Preloader: React.FC<PreloaderProps> = ({ onDone }) => {
  const [gone, setGone] = useState(false);
  const [pct, setPct] = useState(0);
  const barRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 120 : DURATION;
    const start = performance.now();
    let frame = 0;
    let hideTimer = 0;

    const tick = (now: number) => {
      const ratio = Math.min(1, (now - start) / duration);
      const value = Math.round(ratio * 100);
      setPct(value);
      if (barRef.current) barRef.current.style.width = `${value}%`;

      if (ratio < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      setGone(true);
      onDone();
      hideTimer = window.setTimeout(() => setPct(-1), 1200);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
    };
  }, [onDone]);

  if (pct < 0) return null;

  return (
    <div className={`veil${gone ? ' gone' : ''}`} aria-hidden="true">
      <div className="veil-in">
        <span className="veil-mark">FYA</span>
        <span className="veil-num">{pct}%</span>
      </div>
      <div className="veil-rule">
        <i ref={barRef as any} />
      </div>
    </div>
  );
};

export default Preloader;
