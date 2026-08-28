-- ============================================
-- SCHEMA: Plataforma de Gestión de Freelancers
-- ============================================

-- Tabla principal de candidatos freelancers
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  roles TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  work_history TEXT NOT NULL DEFAULT '',
  portfolio_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'accepted', 'rejected')),
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 10)),
  rating_admin_email TEXT,
  rating_admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proyectos asignados a candidatos aceptados
CREATE TABLE IF NOT EXISTS candidate_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notas/observaciones de administradores sobre candidatos
CREATE TABLE IF NOT EXISTS candidate_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  admin_email TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valoraciones individuales de administradores sobre candidatos
CREATE TABLE IF NOT EXISTS candidate_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  admin_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_candidate_admin_rating UNIQUE (candidate_id, admin_email)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_ratings ENABLE ROW LEVEL SECURITY;

-- CANDIDATES: Insert público (freelancers se registran sin login)
CREATE POLICY "Public can insert candidates" ON candidates
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- CANDIDATES: Select solo para autenticados
CREATE POLICY "Authenticated can view candidates" ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

-- CANDIDATES: Update solo para autenticados
CREATE POLICY "Authenticated can update candidates" ON candidates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CANDIDATES: Delete solo para autenticados
CREATE POLICY "Authenticated can delete candidates" ON candidates
  FOR DELETE
  TO authenticated
  USING (true);

-- CANDIDATE_PROJECTS: Solo autenticados
CREATE POLICY "Authenticated full access to projects" ON candidate_projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CANDIDATE_NOTES: Solo autenticados
CREATE POLICY "Authenticated full access to notes" ON candidate_notes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- CANDIDATE_RATINGS: Solo autenticados
CREATE POLICY "Authenticated full access to ratings" ON candidate_ratings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Ejecutar en Supabase Dashboard > Storage > Create new bucket:
-- Nombre: freelancer-photos
-- Public: true
--
-- O ejecutar este SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('freelancer-photos', 'freelancer-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage: upload público
CREATE POLICY "Public can upload photos" ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'freelancer-photos');

-- Política de storage: lectura pública
CREATE POLICY "Public can view photos" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'freelancer-photos');

-- ============================================
-- MIGRATIONS / UPGRADES
-- ============================================
-- Si ya tenías la base de datos creada, ejecutá esto en Supabase SQL Editor:
--
-- CREATE TABLE IF NOT EXISTS candidate_ratings (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
--   admin_id UUID REFERENCES auth.users(id),
--   admin_email TEXT NOT NULL,
--   rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   CONSTRAINT unique_candidate_admin_rating UNIQUE (candidate_id, admin_email)
-- );
-- ALTER TABLE candidate_ratings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Authenticated full access to ratings" ON candidate_ratings FOR ALL TO authenticated USING (true) WITH CHECK (true);


