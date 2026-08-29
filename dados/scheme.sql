-- Garante que o schema public existe
CREATE SCHEMA IF NOT EXISTS public;

-- Drop das tabelas existentes (respeitando a ordem de dependência das FKs)
DROP TABLE IF EXISTS public.escala CASCADE;
DROP TABLE IF EXISTS public.evento_area_horarios CASCADE;
DROP TABLE IF EXISTS public.locais CASCADE;
DROP TABLE IF EXISTS public.areas CASCADE;
DROP TABLE IF EXISTS public.bloqueios CASCADE;
DROP TABLE IF EXISTS public.eventos CASCADE;
DROP TABLE IF EXISTS public.tipo_evento CASCADE;
DROP TABLE IF EXISTS public.mes CASCADE;
DROP TABLE IF EXISTS public.obreiros CASCADE;

-- 1. Tabela Obreiros
CREATE TABLE IF NOT EXISTS public.obreiros (
    id_obreiro SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    apelido VARCHAR(100),
    telefone VARCHAR(30),
    email VARCHAR(255),
    diacono BOOLEAN DEFAULT FALSE,
    pulpito BOOLEAN DEFAULT FALSE,
    lider BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    foto TEXT,
    data_nascimento DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela Mes
CREATE TABLE IF NOT EXISTS public.mes (
    id_mes SERIAL PRIMARY KEY,
    ano_referencia INTEGER NOT NULL CHECK (ano_referencia >= 1000),
    mes_referencia INTEGER NOT NULL CHECK (mes_referencia BETWEEN 1 AND 12),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela Tipo Evento (Modelos de eventos)
CREATE TABLE IF NOT EXISTS public.tipo_evento (
    id_tipo_evento SERIAL PRIMARY KEY,
    descricao_padrao TEXT NOT NULL,
    dia_semana_padrao INTEGER CHECK (dia_semana_padrao BETWEEN 1 AND 7),
    turno_padrao INTEGER NOT NULL,
    n_primeiro_horario_padrao INTEGER DEFAULT 0,
    exclusivo_diacono_primeiro_padrao BOOLEAN DEFAULT FALSE,
    n_segundo_horario_padrao INTEGER DEFAULT 0,
    exclusivo_diacono_segundo_padrao BOOLEAN DEFAULT FALSE,
    n_terceiro_horario_padrao INTEGER DEFAULT 0,
    exclusivo_diacono_terceiro_padrao BOOLEAN DEFAULT FALSE,
    pulpito_primeiro BOOLEAN DEFAULT TRUE,
    pulpito_segundo BOOLEAN DEFAULT TRUE,
    pulpito_terceiro BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela Bloqueios
CREATE TABLE IF NOT EXISTS public.bloqueios (
    id_bloqueio SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    turno INTEGER NOT NULL,
    id_obreiro INTEGER NOT NULL REFERENCES public.obreiros(id_obreiro) ON DELETE CASCADE,
    motivo TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela Eventos
CREATE TABLE IF NOT EXISTS public.eventos (
    id_evento SERIAL PRIMARY KEY,
    id_mes INTEGER NOT NULL REFERENCES public.mes(id_mes) ON DELETE CASCADE,
    data DATE NOT NULL,
    descricao TEXT,
    turno INTEGER NOT NULL,
    n_primeiro_horario INTEGER DEFAULT 0,
    exclusivo_diacono_primeiro BOOLEAN DEFAULT FALSE,
    n_segundo_horario INTEGER DEFAULT 0,
    exclusivo_diacono_segundo BOOLEAN DEFAULT FALSE,
    n_terceiro_horario INTEGER DEFAULT 0,
    exclusivo_diacono_terceiro BOOLEAN DEFAULT FALSE,
    pulpito_primeiro BOOLEAN DEFAULT TRUE,
    pulpito_segundo BOOLEAN DEFAULT TRUE,
    pulpito_terceiro BOOLEAN DEFAULT TRUE,
    -- Campos de Gestão Operacional do Culto
    traje_tipo VARCHAR(50) DEFAULT 'Camisa Preta',
    terno_cor_obrigatoria BOOLEAN DEFAULT FALSE,
    terno_cor VARCHAR(50),
    gravata_cor_obrigatoria BOOLEAN DEFAULT FALSE,
    gravata_cor VARCHAR(50),
    camisa_cor_obrigatoria BOOLEAN DEFAULT FALSE,
    camisa_cor VARCHAR(50),
    cracha_obrigatorio BOOLEAN DEFAULT TRUE,
    lideres_responsaveis_ids INTEGER[] DEFAULT '{}',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Áreas de Atuação (Setores: Igreja, Estacionamento, etc.)
CREATE TABLE IF NOT EXISTS public.areas (
    id_area SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    icone VARCHAR(50) DEFAULT '📍',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Locais de Atuação dos Obreiros
CREATE TABLE IF NOT EXISTS public.locais (
    id_local SERIAL PRIMARY KEY,
    id_area INTEGER NOT NULL REFERENCES public.areas(id_area) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de Horários de Funcionamento por Área no Evento
CREATE TABLE IF NOT EXISTS public.evento_area_horarios (
    id_area_horario SERIAL PRIMARY KEY,
    id_evento INTEGER NOT NULL REFERENCES public.eventos(id_evento) ON DELETE CASCADE,
    id_area INTEGER NOT NULL REFERENCES public.areas(id_area) ON DELETE CASCADE,
    horario_turno INTEGER NOT NULL CHECK (horario_turno IN (1, 2, 3)),
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uk_evento_area_turno UNIQUE (id_evento, id_area, horario_turno)
);

-- 9. Tabela Escala
CREATE TABLE IF NOT EXISTS public.escala (
    id_escala SERIAL PRIMARY KEY,
    id_evento INTEGER NOT NULL REFERENCES public.eventos(id_evento) ON DELETE CASCADE,
    id_obreiro INTEGER NOT NULL REFERENCES public.obreiros(id_obreiro) ON DELETE CASCADE,
    id_mes INTEGER NOT NULL REFERENCES public.mes(id_mes) ON DELETE CASCADE,
    id_local INTEGER REFERENCES public.locais(id_local) ON DELETE SET NULL,
    horario_turno INTEGER DEFAULT 1 CHECK (horario_turno IN (1, 2, 3)),
    checkin BOOLEAN,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uk_evento_obreiro UNIQUE (id_evento, id_obreiro)
);

-- 10. Tabela Usuários (Perfis de Acesso e RBAC: admin, manager, operator)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    nome_completo TEXT,
    role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'manager', 'operator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de Acesso RLS para Usuários (apenas usuários requer RLS por segurança)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura de usuarios para autenticados" ON public.usuarios;
CREATE POLICY "Permitir leitura de usuarios para autenticados" 
ON public.usuarios 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Permitir atualizacao do proprio perfil" ON public.usuarios;
CREATE POLICY "Permitir atualizacao do proprio perfil" 
ON public.usuarios 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);
