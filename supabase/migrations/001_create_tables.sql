CREATE TABLE IF NOT EXISTS chapters (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order    INTEGER NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content_html  TEXT NOT NULL,
  summary       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS authorities (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content_html  TEXT NOT NULL,
  summary       TEXT,
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Public can read published authorities" ON authorities FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can manage chapters" ON chapters FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage authorities" ON authorities FOR ALL USING (auth.role() = 'authenticated');

-- Grant DML privileges to authenticated role
GRANT INSERT, UPDATE, DELETE ON chapters TO authenticated;
GRANT INSERT, UPDATE, DELETE ON authorities TO authenticated;

-- Ensure service_role has full access (Supabase standard)
GRANT ALL ON chapters TO service_role;
GRANT ALL ON authorities TO service_role;
