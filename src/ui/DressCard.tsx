import React from 'react';
import { Link } from 'react-router-dom';

import { Dress, DressType } from '../types';
import { Reveal, SmartImage } from '../lib/motion';

/** Preț afișabil. Fără preț în baza de date nu inventăm nimic. */
export const priceLabel = (dress: Dress): React.ReactNode => {
  const currency = dress.currency || 'RON';
  if (dress.type === DressType.RENT && dress.rentPrice) return `de la ${dress.rentPrice} ${currency}`;
  // Rochiile cu ambele prețuri (Noblesse): preț întreg = rochie nouă comandată din fabrică,
  // preț mic = sample din magazin în promoție. Etichetele au fost cerute explicit de Rareș/Ramona (14 nov).
  if (dress.price && dress.fullPrice) {
    return (
      <>
        <span className="price-line">Rochie nouă, comandată din fabrică: {dress.fullPrice} {currency}</span>
        <span className="price-line">Sample din magazin, în promoție: {dress.price} {currency}</span>
      </>
    );
  }
  if (dress.price) return `${dress.price} ${currency}`;
  return 'Preț la probă';
};

type DressCardProps = { dress: Dress; index?: number; showCollection?: boolean };

const DressCard: React.FC<DressCardProps> = ({ dress, index = 0, showCollection }) => (
  <Reveal mode="up" index={index % 6} className="card-wrap">
    <Link className="card" to={`/rochie/${dress.id}`}>
      <div className="card-frame">
        <SmartImage src={dress.imageUrl} alt={`Rochie de mireasă ${dress.name}`} sizes="(max-width: 700px) 50vw, 25vw" />
        {showCollection && dress.collection && <span className="card-tag">{dress.collection}</span>}
      </div>
      <div className="card-body">
        <h3 className="card-name">{dress.name}{dress.code && <span className="card-code"> · {dress.code}</span>}</h3>
        <span className="card-hint">{priceLabel(dress)}</span>
      </div>
    </Link>
  </Reveal>
);

export default DressCard;
