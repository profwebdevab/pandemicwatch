-- PandemicWatch — Schema Inicial
-- Execute este arquivo no Supabase SQL Editor

-- Tabela de surtos/patógenos
CREATE TABLE IF NOT EXISTS outbreaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathogen_name TEXT NOT NULL,
  pathogen_type TEXT NOT NULL CHECK (pathogen_type IN ('virus','bacteria','fungus','prion')),
  pandemic_potential TEXT NOT NULL CHECK (pandemic_potential IN ('low','medium','high','critical')),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  region TEXT,
  suspected_cases INTEGER DEFAULT 0,
  confirmed_cases INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('monitoring','outbreak','epidemic','pandemic')),
  source_url TEXT,
  source_name TEXT,
  first_reported_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pathogen_name, country_code)
);

-- Tabela de notícias agregadas
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  ai_summary TEXT,
  url TEXT UNIQUE NOT NULL,
  source TEXT,
  language TEXT DEFAULT 'pt',
  country_code TEXT,
  pathogen_mentioned TEXT[],
  category TEXT CHECK (category IN ('outbreak','legislation','freedom','relocation')),
  sentiment TEXT CHECK (sentiment IN ('restrictive','neutral','libertarian')),
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de scores de liberdade por país
CREATE TABLE IF NOT EXISTS freedom_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT UNIQUE NOT NULL,
  country_name TEXT NOT NULL,
  overall_score NUMERIC(4,2),
  pandemic_response_score NUMERIC(4,2),
  lockdown_severity INTEGER CHECK (lockdown_severity BETWEEN 1 AND 5),
  vaccine_mandate_level TEXT CHECK (vaccine_mandate_level IN ('none','soft','hard','forced')),
  travel_restriction_history TEXT,
  economic_freedom NUMERIC(4,2),
  personal_freedom NUMERIC(4,2),
  press_freedom NUMERIC(4,2),
  flag_theory_suitability TEXT CHECK (flag_theory_suitability IN ('excellent','good','fair','poor')),
  flag_theory_tags TEXT[],
  visa_options JSONB,
  cost_of_living_usd INTEGER,
  digital_nomad_visa BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de mudanças legislativas
CREATE TABLE IF NOT EXISTS legislation_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ai_analysis TEXT,
  type TEXT CHECK (type IN ('proposed','passed','repealed')),
  direction TEXT CHECK (direction IN ('restrictive','libertarian','neutral')),
  category TEXT CHECK (category IN ('health_mandate','travel','surveillance','speech','economic')),
  impact_level TEXT CHECK (impact_level IN ('low','medium','high','critical')),
  source_url TEXT,
  effective_date DATE,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de guia de relocação
CREATE TABLE IF NOT EXISTS relocation_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT UNIQUE NOT NULL,
  country_name TEXT NOT NULL,
  budget_tier TEXT CHECK (budget_tier IN ('shoestring','budget','mid','comfort')),
  monthly_budget_min_usd INTEGER,
  monthly_budget_max_usd INTEGER,
  steps JSONB NOT NULL DEFAULT '[]',
  visa_process JSONB,
  banking_options JSONB,
  healthcare_info JSONB,
  communities TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE outbreaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freedom_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislation_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE relocation_guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON outbreaks;
DROP POLICY IF EXISTS "Public read access" ON news_articles;
DROP POLICY IF EXISTS "Public read access" ON freedom_scores;
DROP POLICY IF EXISTS "Public read access" ON legislation_changes;
DROP POLICY IF EXISTS "Public read access" ON relocation_guides;

CREATE POLICY "Public read access" ON outbreaks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON freedom_scores FOR SELECT USING (true);
CREATE POLICY "Public read access" ON legislation_changes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON relocation_guides FOR SELECT USING (true);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE outbreaks;
ALTER PUBLICATION supabase_realtime ADD TABLE news_articles;
ALTER PUBLICATION supabase_realtime ADD TABLE legislation_changes;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_outbreaks_status ON outbreaks(status);
CREATE INDEX IF NOT EXISTS idx_outbreaks_country ON outbreaks(country_code);
CREATE INDEX IF NOT EXISTS idx_outbreaks_updated ON outbreaks(last_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_freedom_score ON freedom_scores(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_legislation_published ON legislation_changes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_legislation_direction ON legislation_changes(direction);

-- Dados iniciais de freedom scores
INSERT INTO freedom_scores (country_code, country_name, overall_score, pandemic_response_score, lockdown_severity, vaccine_mandate_level, economic_freedom, personal_freedom, press_freedom, flag_theory_suitability, flag_theory_tags, cost_of_living_usd, digital_nomad_visa)
VALUES
  ('GE', 'Georgia', 8.5, 8.0, 2, 'none', 8.2, 7.8, 6.5, 'excellent', ARRAY['residency','banking','lifestyle'], 800, false),
  ('PY', 'Paraguay', 7.8, 7.5, 2, 'none', 7.5, 7.2, 6.0, 'excellent', ARRAY['residency','banking','business'], 700, false),
  ('PA', 'Panama', 7.5, 6.5, 3, 'soft', 7.8, 7.0, 6.8, 'good', ARRAY['residency','banking','business'], 1500, false),
  ('AE', 'UAE', 7.2, 5.5, 3, 'hard', 8.5, 6.0, 4.5, 'good', ARRAY['banking','business','passport'], 3500, true),
  ('PT', 'Portugal', 6.8, 5.0, 4, 'soft', 7.0, 7.5, 7.5, 'good', ARRAY['residency','passport','lifestyle'], 2000, true),
  ('MX', 'Mexico', 7.0, 7.0, 2, 'none', 6.8, 7.0, 5.5, 'good', ARRAY['residency','lifestyle'], 1000, false),
  ('TH', 'Thailand', 6.5, 6.0, 3, 'soft', 7.0, 6.5, 5.0, 'good', ARRAY['lifestyle','residency'], 1200, true),
  ('EE', 'Estonia', 7.5, 6.5, 3, 'soft', 7.8, 8.0, 8.5, 'good', ARRAY['business','residency'], 2000, true),
  ('SG', 'Singapore', 6.8, 5.5, 4, 'hard', 9.0, 6.0, 4.5, 'good', ARRAY['banking','business'], 4000, false),
  ('CO', 'Colombia', 6.8, 6.5, 3, 'none', 6.5, 6.8, 5.5, 'good', ARRAY['residency','lifestyle'], 900, true),
  ('EC', 'Ecuador', 7.0, 7.0, 2, 'none', 6.5, 7.0, 6.0, 'good', ARRAY['residency','lifestyle'], 700, false),
  ('UY', 'Uruguay', 7.2, 7.0, 2, 'soft', 7.0, 8.0, 7.5, 'good', ARRAY['residency','lifestyle'], 1500, false),
  ('HN', 'Honduras', 7.2, 7.8, 2, 'none', 6.5, 6.8, 5.5, 'good', ARRAY['residency','lifestyle'], 600, false),
  ('US', 'United States', 6.2, 5.5, 3, 'soft', 8.0, 7.0, 6.5, 'fair', ARRAY['business'], 4000, false),
  ('BR', 'Brazil', 5.8, 6.0, 3, 'soft', 5.5, 6.5, 6.0, 'fair', ARRAY['lifestyle'], 800, false),
  ('CH', 'Switzerland', 6.5, 5.5, 3, 'soft', 8.5, 7.5, 7.8, 'fair', ARRAY['banking'], 6000, false),
  ('AU', 'Australia', 4.5, 2.0, 5, 'forced', 7.5, 5.5, 6.0, 'poor', ARRAY[]::text[], 4500, false),
  ('CA', 'Canada', 4.8, 3.0, 5, 'forced', 7.2, 6.0, 7.5, 'poor', ARRAY[]::text[], 3500, false),
  ('AT', 'Austria', 4.2, 2.5, 5, 'forced', 7.0, 5.5, 7.0, 'poor', ARRAY[]::text[], 3000, false),
  ('NZ', 'New Zealand', 3.8, 1.5, 5, 'forced', 7.5, 5.0, 7.0, 'poor', ARRAY[]::text[], 4000, false)
ON CONFLICT (country_code) DO UPDATE SET
  overall_score = EXCLUDED.overall_score,
  pandemic_response_score = EXCLUDED.pandemic_response_score,
  updated_at = NOW();

-- Dados de exemplo de surtos ativos
INSERT INTO outbreaks (pathogen_name, pathogen_type, pandemic_potential, country_code, country_name, region, suspected_cases, confirmed_cases, deaths, status, source_name, first_reported_at)
VALUES
  ('H5N1 Influenza A', 'virus', 'critical', 'US', 'United States', 'North America', 250, 89, 12, 'outbreak', 'CDC', '2024-01-15'),
  ('Hantavirus', 'virus', 'medium', 'AR', 'Argentina', 'South America', 45, 23, 8, 'outbreak', 'PAHO', '2024-02-01'),
  ('Mpox Clade I', 'virus', 'high', 'CD', 'Democratic Republic of Congo', 'Africa', 8500, 4200, 650, 'epidemic', 'WHO', '2023-09-01'),
  ('MERS-CoV', 'virus', 'high', 'SA', 'Saudi Arabia', 'Middle East', 12, 8, 2, 'monitoring', 'WHO EMRO', '2024-03-10'),
  ('Dengue Fever', 'virus', 'medium', 'BR', 'Brazil', 'South America', 850000, 620000, 1200, 'epidemic', 'PAHO', '2024-01-01'),
  ('Cholera', 'bacteria', 'medium', 'SY', 'Syria', 'Middle East', 12000, 8500, 95, 'outbreak', 'WHO EMRO', '2024-02-15')
ON CONFLICT (pathogen_name, country_code) DO NOTHING;

-- Dados de exemplo de legislação
INSERT INTO legislation_changes (country_code, country_name, title, description, type, direction, category, impact_level)
VALUES
  ('AU', 'Australia', 'Digital ID Act 2024', 'Sistema obrigatório de identidade digital ligado a serviços de saúde e financeiros.', 'passed', 'restrictive', 'surveillance', 'high'),
  ('EU', 'European Union', 'AI Act — Biometric Surveillance', 'Regulamentação que permite vigilância biométrica em espaços públicos em situações de emergência.', 'passed', 'restrictive', 'surveillance', 'high'),
  ('US', 'United States', 'PREP Act Extension', 'Extensão de imunidade para fabricantes de vacinas em caso de emergência declarada.', 'passed', 'restrictive', 'health_mandate', 'medium'),
  ('GE', 'Georgia', 'Foreign Agents Law Repeal', 'Revogação de lei que forçava ONGs financiadas externamente a se registrarem como agentes estrangeiros.', 'proposed', 'libertarian', 'speech', 'medium'),
  ('PT', 'Portugal', 'Digital Nomad Visa Expansion', 'Expansão do programa D8 para trabalhadores remotos com renda mínima de €3,280/mês.', 'passed', 'libertarian', 'travel', 'medium')
ON CONFLICT DO NOTHING;
