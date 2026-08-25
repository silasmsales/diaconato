-- Garante que o schema public existe
CREATE SCHEMA IF NOT EXISTS public;

-- Drop das tabelas existentes (respeitando a ordem de dependência das FKs)
DROP TABLE IF EXISTS public.escala CASCADE;
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
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela Escala (Com o campo checkin BOOLEAN sem valor padrão)
CREATE TABLE IF NOT EXISTS public.escala (
    id_escala SERIAL PRIMARY KEY,
    id_evento INTEGER NOT NULL REFERENCES public.eventos(id_evento) ON DELETE CASCADE,
    id_obreiro INTEGER NOT NULL REFERENCES public.obreiros(id_obreiro) ON DELETE CASCADE,
    id_mes INTEGER NOT NULL REFERENCES public.mes(id_mes) ON DELETE CASCADE,
    checkin BOOLEAN,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uk_evento_obreiro UNIQUE (id_evento, id_obreiro)
);