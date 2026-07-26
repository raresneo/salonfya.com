-- Schema pentru WS2 (Catalog Rochii)

-- 1. Table: collections
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- 2. Table: dresses
CREATE TABLE dresses (
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

-- 3. Inserare colecții predefinite (din enum)
INSERT INTO collections (id, name) VALUES 
('IMPERIAL', 'Colecția Imperial'),
('ANNA', 'Colecția Anna'),
('MAYRA', 'Colecția Mayra'),
('BEVERLY', 'Colecția Beverly')
ON CONFLICT (id) DO NOTHING;

-- 4. Setare Row Level Security (RLS)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE dresses ENABLE ROW LEVEL SECURITY;

-- Select permis tuturor (necesar pentru afisare pe site)
CREATE POLICY "Public read access on collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Public read access on dresses" ON dresses FOR SELECT USING (true);

-- Modificări (Insert/Update/Delete) permise doar adminilor logați
CREATE POLICY "Auth write access on collections" ON collections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access on dresses" ON dresses FOR ALL USING (auth.role() = 'authenticated');
