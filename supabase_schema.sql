-- ============================================================================
-- Salon FYA · schema Supabase
-- Rulează în SQL Editor. Scriptul e idempotent, poate fi rulat de mai multe ori.
-- ============================================================================

-- 1. Colecții -----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

INSERT INTO collections (id, name) VALUES
  ('IMPERIAL', 'Colecția Imperial'),
  ('ANNA', 'Colecția Anna'),
  ('MAYRA', 'Colecția Mayra'),
  ('BEVERLY', 'Colecția Beverly')
ON CONFLICT (id) DO NOTHING;

-- 2. Rochii -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS dresses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rent_price NUMERIC,
  price NUMERIC,
  type TEXT,
  currency TEXT DEFAULT 'RON',
  collection_id TEXT REFERENCES collections(id),
  fabric TEXT,
  silhouette TEXT,
  neckline TEXT,
  image_url TEXT,
  sizes TEXT[],
  colors TEXT[],
  images TEXT[],
  sketches TEXT[]
);

-- Aplicația normalizează 'IMPERIAL' / 'Imperial' / 'Colecția Imperial', deci
-- nu contează forma exactă salvată aici.

-- 3. Programări ---------------------------------------------------------------
-- Formularul public scrie aici. Nu ținem date sensibile în afară de contact.

CREATE TABLE IF NOT EXISTS programari (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  nume TEXT NOT NULL,
  telefon TEXT NOT NULL,
  email TEXT,
  data_dorita DATE,
  interval_orar TEXT,
  dress_id TEXT,
  colectie TEXT,
  mesaj TEXT,
  sursa TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  voucher TEXT,
  -- folosită de fluxul de probă virtuală, când îl activăm
  imagine_generata_url TEXT,
  status TEXT NOT NULL DEFAULT 'nou'
);

CREATE INDEX IF NOT EXISTS programari_created_at_idx ON programari (created_at DESC);
CREATE INDEX IF NOT EXISTS programari_status_idx ON programari (status);

-- 4. Row Level Security -------------------------------------------------------

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE dresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE programari ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read collections" ON collections;
CREATE POLICY "Public read collections" ON collections
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read dresses" ON dresses;
CREATE POLICY "Public read dresses" ON dresses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth write collections" ON collections;
CREATE POLICY "Auth write collections" ON collections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Auth write dresses" ON dresses;
CREATE POLICY "Auth write dresses" ON dresses
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Programările: oricine poate trimite o cerere, dar nimeni din public nu le
-- poate citi. Lista se vede doar autentificat sau din service role.
DROP POLICY IF EXISTS "Public insert programari" ON programari;
CREATE POLICY "Public insert programari" ON programari
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Auth read programari" ON programari;
CREATE POLICY "Auth read programari" ON programari
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Auth update programari" ON programari;
CREATE POLICY "Auth update programari" ON programari
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
