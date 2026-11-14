import React from 'react';

const base = import.meta.env.BASE_URL;

type IconProps = { className?: string; title?: string };

/** Coin (xu) artwork used everywhere in the app. */
export const CoinIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', title }) => (
  <img src={`${base}assets/icons/coin.png`} alt={title ?? ''} aria-hidden={title ? undefined : true} draggable={false} className={`inline-block object-contain shrink-0 ${className}`} />
);

/** Star (sao) artwork used everywhere in the app. */
export const StarIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', title }) => (
  <img src={`${base}assets/icons/star.png`} alt={title ?? ''} aria-hidden={title ? undefined : true} draggable={false} className={`inline-block object-contain shrink-0 ${className}`} />
);
