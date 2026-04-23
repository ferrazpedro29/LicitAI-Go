-- ============================================================
-- LicitAI Go — Setup completo do banco de dados Supabase
-- Execute TUDO de uma vez no SQL Editor do Supabase
-- (Database → SQL Editor → New query → Cole → Run)
-- ============================================================


-- ============================================================
-- 1. TABELA: profiles
--    Criada automaticamente quando um usuário se registra
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT,
  empresa       TEXT,
  plano         TEXT NOT NULL DEFAULT 'basic',
  analises_usadas INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS — cada usuário acessa somente o próprio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own_read" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: cria perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, empresa, plano, analises_usadas)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
    COALESCE(NEW.raw_user_meta_data->>'empresa', ''),
    COALESCE(NEW.raw_user_meta_data->>'plano', 'basic'),
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 2. TABELA: analyses
--    Uma linha por análise de edital realizada
-- ============================================================
CREATE TABLE IF NOT EXISTS analyses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo         TEXT NOT NULL,        -- 'OBRAS_SERVICOS' | 'PRODUTOS_DISPENSA'
  objeto       TEXT,                 -- descrição do objeto licitado
  orgao        TEXT,                 -- órgão contratante
  arquivo_nome TEXT,                 -- nome do arquivo enviado
  decisao      TEXT,                 -- 'GO' | 'NO GO' | 'CONDICIONAL'
  resultado    JSONB,                -- JSON completo retornado pela IA
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índice por usuário para acelerar consultas de histórico
CREATE INDEX IF NOT EXISTS analyses_user_id_idx
  ON analyses (user_id, created_at DESC);

-- RLS — cada usuário vê somente as próprias análises
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analyses_own_all" ON analyses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 3. POPULAR perfis de usuários já existentes
--    (necessário apenas se já há usuários cadastrados antes
--     deste SQL ser executado)
-- ============================================================
INSERT INTO public.profiles (id, nome_completo, empresa, plano, analises_usadas)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'nome_completo', ''),
  COALESCE(raw_user_meta_data->>'empresa', ''),
  COALESCE(raw_user_meta_data->>'plano', 'basic'),
  COALESCE((raw_user_meta_data->>'analises_usadas')::int, 0)
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- VERIFICAÇÃO: rode estas queries para confirmar que tudo
-- foi criado corretamente
-- ============================================================
-- SELECT * FROM profiles LIMIT 5;
-- SELECT * FROM analyses LIMIT 5;
-- SELECT trigger_name FROM information_schema.triggers
--   WHERE event_object_table = 'users'
--   AND trigger_schema = 'auth';
