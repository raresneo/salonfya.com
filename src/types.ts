
export enum DressType {
  BUY = 'BUY',
  RENT = 'RENT'
}

export interface Dress {
  id: string;
  name: string;
  description: string;
  price?: number;
  rentPrice?: number;
  type: DressType;
  imageUrl: string;
  images?: string[]; // Optional additional images
  sketches?: string[]; // Optional design sketches
  currency?: string; // Optional currency (default: €)
  sizes: string[];
  colors: string[];
  collection?: Collection;
  details?: {
    fabric: string;
    silhouette: string;
    neckline: string;
  };
}

export interface Appointment {
  date: Date;
  timeSlot: string;
  dressId: string;
  customerName: string;
  customerPhone: string;
}

export interface WardrobeItem {
  dressId: string;
  notes: string;
  preferredStyle: string;
  addedAt: Date;
}

export enum Collection {
  IMPERIAL = 'Imperial',
  ANNA = 'Anna',
  MAYRA = 'Mayra',
  BEVERLY = 'Beverly',
  AURORA = 'Aurora',
  NOBLESSE = 'Noblesse',
}
