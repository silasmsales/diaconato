-- ==============================================================================
-- SCRIPT DE SEGURANÇA (RLS) - SUPABASE
-- Execute este script no SQL Editor do Supabase Dashboard
-- ==============================================================================

-- 1. Habilitar RLS (Row Level Security) em todas as tabelas
ALTER TABLE public.obreiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_evento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bloqueios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evento_area_horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escala ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 2. Limpar políticas antigas (se houver) para evitar duplicações
DROP POLICY IF EXISTS "Acesso autenticado obreiros" ON public.obreiros;
DROP POLICY IF EXISTS "Acesso autenticado mes" ON public.mes;
DROP POLICY IF EXISTS "Acesso autenticado tipo_evento" ON public.tipo_evento;
DROP POLICY IF EXISTS "Acesso autenticado bloqueios" ON public.bloqueios;
DROP POLICY IF EXISTS "Acesso autenticado eventos" ON public.eventos;
DROP POLICY IF EXISTS "Acesso autenticado areas" ON public.areas;
DROP POLICY IF EXISTS "Acesso autenticado locais" ON public.locais;
DROP POLICY IF EXISTS "Acesso autenticado horarios" ON public.evento_area_horarios;
DROP POLICY IF EXISTS "Acesso autenticado escala" ON public.escala;
DROP POLICY IF EXISTS "Permitir leitura de usuarios para autenticados" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir insercao de usuarios para autenticados" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir atualizacao do proprio perfil" ON public.usuarios;

-- 3. Criar Políticas de Acesso Restrito a Usuários Autenticados (Login obrigatório)
CREATE POLICY "Acesso autenticado obreiros" 
ON public.obreiros FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado mes" 
ON public.mes FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado tipo_evento" 
ON public.tipo_evento FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado bloqueios" 
ON public.bloqueios FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado eventos" 
ON public.eventos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado areas" 
ON public.areas FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado locais" 
ON public.locais FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado horarios" 
ON public.evento_area_horarios FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Acesso autenticado escala" 
ON public.escala FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de usuarios para autenticados" 
ON public.usuarios FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir insercao de usuarios para autenticados" 
ON public.usuarios FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir atualizacao do proprio perfil" 
ON public.usuarios FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);
