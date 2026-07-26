import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { DRESSES } from '../src/constants';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Starting to seed ${DRESSES.length} dresses...`);

  for (const dress of DRESSES) {
    const { data, error } = await supabase
      .from('dresses')
      .upsert({
        id: dress.id,
        name: dress.name,
        description: dress.description,
        rent_price: dress.rentPrice,
        price: dress.price,
        type: dress.type,
        currency: dress.currency,
        collection_id: dress.collection,
        fabric: dress.details?.fabric || null,
        silhouette: dress.details?.silhouette || null,
        neckline: dress.details?.neckline || null,
        image_url: dress.imageUrl,
        sizes: dress.sizes || [],
        colors: dress.colors || [],
        images: dress.images || [],
        sketches: dress.sketches || [],
      }, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting dress ${dress.name}:`, error.message);
    } else {
      console.log(`Inserted dress: ${dress.name}`);
    }
  }

  console.log('Seeding completed!');
}

seed();
