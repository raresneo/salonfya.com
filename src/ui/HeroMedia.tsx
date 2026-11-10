import React from 'react';

import { useReducedMotion } from '../lib/reducedMotion';

type HeroMediaProps = {
  /** Fișierul video existent; nu îl modificăm, doar decidem dacă pornește. */
  video?: string;
  /** Posterul existent, afișat static când nu rulăm video. */
  poster: string;
  preload?: 'none' | 'metadata';
};

/**
 * Fundalul hero. Cu reduced motion afișăm doar posterul, fără autoplay.
 * Fără video setat, la fel: imaginea existentă.
 */
const HeroMedia: React.FC<HeroMediaProps> = ({ video, poster, preload = 'metadata' }) => {
  const reduced = useReducedMotion();

  if (!video || reduced) return <><img src={poster} alt="" aria-hidden="true" />{/^\/images\/(AURORA|NOBLESSE)\//.test(poster) && <span className="ai-image-note">Imagine generată cu AI</span>}</>;

  return (
    <video autoPlay muted loop playsInline preload={preload} poster={poster} aria-hidden="true">
      <source src={video} type="video/mp4" />
    </video>
  );
};

export default HeroMedia;
