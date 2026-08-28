-- ==============================================================================
-- VIEWS GERENCIAIS — ADTAG DIACONATO (ASSEMBLEIA DE DEUS DE TAGUATINGA)
-- Relatórios de Assiduidade, Ocupação de Vagas, Produtividade e Gestão de Obreiros
-- ==============================================================================

-- 1. VISÃO DETALHADA COMPLETA DA ESCALA (Flat View para Consultas e Relatórios Rápidos)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_escala_detalhada AS
SELECT 
    e.id_escala,
    e.id_mes,
    m.ano_referencia,
    m.mes_referencia,
    e.id_evento,
    ev.data AS data_evento,
    TO_CHAR(ev.data, 'TMDay') AS dia_semana_nome,
    ev.descricao AS descricao_evento,
    ev.turno AS id_turno,
    CASE 
        WHEN ev.turno = 1 THEN 'Manhã'
        WHEN ev.turno = 2 THEN 'Tarde'
        WHEN ev.turno = 3 THEN 'Noite'
        WHEN ev.turno = 4 THEN 'Integral'
        ELSE 'Geral'
    END AS turno_nome,
    e.id_obreiro,
    o.nome AS nome_obreiro,
    o.apelido AS apelido_obreiro,
    o.telefone AS telefone_obreiro,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    o.lider AS is_lider,
    o.ativo AS is_ativo,
    e.checkin,
    CASE 
        WHEN e.checkin IS TRUE THEN 'Presente'
        WHEN e.checkin IS FALSE THEN 'Falta'
        ELSE 'Pendente'
    END AS status_checkin,
    e.criado_em AS escala_criada_em
FROM public.escala e
INNER JOIN public.eventos ev ON e.id_evento = ev.id_evento
INNER JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
INNER JOIN public.mes m ON e.id_mes = m.id_mes;


-- 2. ASSIDUIDADE GERAL DOS OBREIROS (Histórico Acumulado de Presenças e Faltas)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_assiduidade_obreiros AS
SELECT 
    o.id_obreiro,
    o.nome AS nome_obreiro,
    o.apelido AS apelido_obreiro,
    o.telefone,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    o.lider AS is_lider,
    o.ativo AS is_ativo,
    COUNT(e.id_escala) AS total_escalas,
    COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END) AS total_presencas,
    COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END) AS total_faltas,
    COUNT(CASE WHEN e.checkin IS NULL THEN 1 END) AS total_pendentes,
    ROUND(
        (COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END)::NUMERIC * 100.0) / 
        NULLIF(COUNT(CASE WHEN e.checkin IS NOT NULL THEN 1 END), 0),
        1
    ) AS taxa_presenca_pct,
    ROUND(
        (COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END)::NUMERIC * 100.0) / 
        NULLIF(COUNT(CASE WHEN e.checkin IS NOT NULL THEN 1 END), 0),
        1
    ) AS taxa_falta_pct
FROM public.obreiros o
LEFT JOIN public.escala e ON o.id_obreiro = e.id_obreiro
GROUP BY 
    o.id_obreiro, 
    o.nome, 
    o.apelido, 
    o.telefone, 
    o.diacono, 
    o.pulpito, 
    o.lider, 
    o.ativo
ORDER BY total_escalas DESC, taxa_presenca_pct DESC NULLS LAST;


-- 3. ASSIDUIDADE MENSAL POR OBREIRO (Acompanhamento Mês a Mês)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_assiduidade_obreiros_mensal AS
SELECT 
    m.id_mes,
    m.ano_referencia,
    m.mes_referencia,
    o.id_obreiro,
    o.nome AS nome_obreiro,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    COUNT(e.id_escala) AS total_escalas_mes,
    COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END) AS presencas_mes,
    COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END) AS faltas_mes,
    COUNT(CASE WHEN e.checkin IS NULL THEN 1 END) AS pendentes_mes,
    ROUND(
        (COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END)::NUMERIC * 100.0) / 
        NULLIF(COUNT(CASE WHEN e.checkin IS NOT NULL THEN 1 END), 0),
        1
    ) AS taxa_presenca_mes_pct
FROM public.escala e
INNER JOIN public.mes m ON e.id_mes = m.id_mes
INNER JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
GROUP BY 
    m.id_mes, 
    m.ano_referencia, 
    m.mes_referencia, 
    o.id_obreiro, 
    o.nome, 
    o.diacono, 
    o.pulpito
ORDER BY m.ano_referencia DESC, m.mes_referencia DESC, total_escalas_mes DESC;


-- 4. COBERTURA E OCUPAÇÃO DE VAGAS POR CULTO / EVENTO
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_cobertura_eventos AS
SELECT 
    ev.id_evento,
    ev.id_mes,
    m.ano_referencia,
    m.mes_referencia,
    ev.data AS data_evento,
    ev.descricao AS descricao_evento,
    ev.turno AS id_turno,
    CASE 
        WHEN ev.turno = 1 THEN 'Manhã'
        WHEN ev.turno = 2 THEN 'Tarde'
        WHEN ev.turno = 3 THEN 'Noite'
        WHEN ev.turno = 4 THEN 'Integral'
        ELSE 'Geral'
    END AS turno_nome,
    -- Capacidade / Vagas Necessárias
    (COALESCE(ev.n_primeiro_horario, 0) + COALESCE(ev.n_segundo_horario, 0) + COALESCE(ev.n_terceiro_horario, 0)) AS total_vagas_previstas,
    -- Vagas Exclusivas de Diácono
    (
        CASE WHEN ev.exclusivo_diacono_primeiro THEN COALESCE(ev.n_primeiro_horario, 0) ELSE 0 END +
        CASE WHEN ev.exclusivo_diacono_segundo THEN COALESCE(ev.n_segundo_horario, 0) ELSE 0 END +
        CASE WHEN ev.exclusivo_diacono_terceiro THEN COALESCE(ev.n_terceiro_horario, 0) ELSE 0 END
    ) AS vagas_exclusivas_diaconos,
    -- Obreiros Efetivamente Escalados
    COUNT(e.id_escala) AS total_escalados,
    COUNT(CASE WHEN o.diacono IS TRUE THEN 1 END) AS total_diaconos_escalados,
    COUNT(CASE WHEN o.pulpito IS TRUE THEN 1 END) AS total_pulpito_escalados,
    -- Vagas Restantes / Déficit
    GREATEST(0, (COALESCE(ev.n_primeiro_horario, 0) + COALESCE(ev.n_segundo_horario, 0) + COALESCE(ev.n_terceiro_horario, 0)) - COUNT(e.id_escala)) AS vagas_em_aberto,
    -- % de Ocupação da Equipe
    ROUND(
        (COUNT(e.id_escala)::NUMERIC * 100.0) / 
        NULLIF((COALESCE(ev.n_primeiro_horario, 0) + COALESCE(ev.n_segundo_horario, 0) + COALESCE(ev.n_terceiro_horario, 0)), 0),
        1
    ) AS taxa_ocupacao_pct,
    -- Check-in / Presença no Culto
    COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END) AS total_presentes,
    COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END) AS total_faltas,
    COUNT(CASE WHEN e.checkin IS NULL THEN 1 END) AS total_pendentes
FROM public.eventos ev
INNER JOIN public.mes m ON ev.id_mes = m.id_mes
LEFT JOIN public.escala e ON ev.id_evento = e.id_evento
LEFT JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
GROUP BY 
    ev.id_evento,
    ev.id_mes,
    m.ano_referencia,
    m.mes_referencia,
    ev.data,
    ev.descricao,
    ev.turno,
    ev.n_primeiro_horario,
    ev.n_segundo_horario,
    ev.n_terceiro_horario,
    ev.exclusivo_diacono_primeiro,
    ev.exclusivo_diacono_segundo,
    ev.exclusivo_diacono_terceiro
ORDER BY ev.data ASC, ev.turno ASC;


-- 5. RESUMO CONSOLIDADO MENSAL (Dashboard Executivo para Pastores e Diretoria)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_resumo_mensal_diaconato AS
WITH eventos_mes AS (
    SELECT 
        id_mes,
        COUNT(id_evento) AS total_cultos_mes,
        SUM(COALESCE(n_primeiro_horario, 0) + COALESCE(n_segundo_horario, 0) + COALESCE(n_terceiro_horario, 0)) AS total_vagas_ofertadas
    FROM public.eventos
    GROUP BY id_mes
),
escalas_mes AS (
    SELECT 
        id_mes,
        COUNT(id_escala) AS total_escalas_realizadas,
        COUNT(DISTINCT id_obreiro) AS total_obreiros_engajados,
        COUNT(CASE WHEN checkin IS TRUE THEN 1 END) AS total_presencas_mes,
        COUNT(CASE WHEN checkin IS FALSE THEN 1 END) AS total_faltas_mes,
        COUNT(CASE WHEN checkin IS NULL THEN 1 END) AS total_pendentes_mes
    FROM public.escala
    GROUP BY id_mes
)
SELECT 
    m.id_mes,
    m.ano_referencia,
    m.mes_referencia,
    COALESCE(em.total_cultos_mes, 0) AS total_cultos_mes,
    COALESCE(em.total_vagas_ofertadas, 0) AS total_vagas_ofertadas,
    COALESCE(esc.total_escalas_realizadas, 0) AS total_escalas_realizadas,
    COALESCE(esc.total_obreiros_engajados, 0) AS total_obreiros_engajados,
    COALESCE(esc.total_presencas_mes, 0) AS total_presencas_mes,
    COALESCE(esc.total_faltas_mes, 0) AS total_faltas_mes,
    COALESCE(esc.total_pendentes_mes, 0) AS total_pendentes_mes,
    ROUND(
        (COALESCE(esc.total_presencas_mes, 0)::NUMERIC * 100.0) / 
        NULLIF(COALESCE(esc.total_presencas_mes, 0) + COALESCE(esc.total_faltas_mes, 0), 0),
        1
    ) AS taxa_presenca_geral_pct,
    (
        SELECT COUNT(*) 
        FROM public.bloqueios b 
        WHERE TO_CHAR(b.data, 'YYYY-MM') = (m.ano_referencia || '-' || LPAD(m.mes_referencia::TEXT, 2, '0'))
    ) AS total_bloqueios_registrados
FROM public.mes m
LEFT JOIN eventos_mes em ON m.id_mes = em.id_mes
LEFT JOIN escalas_mes esc ON m.id_mes = esc.id_mes
ORDER BY m.ano_referencia DESC, m.mes_referencia DESC;


-- 6. RELATÓRIO DE BLOQUEIOS E INDISPONIBILIDADES DOS OBREIROS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_relatorio_bloqueios AS
SELECT 
    b.id_bloqueio,
    b.data AS data_bloqueio,
    TO_CHAR(b.data, 'YYYY-MM') AS ano_mes_bloqueio,
    b.turno AS id_turno,
    CASE 
        WHEN b.turno = 1 THEN 'Manhã'
        WHEN b.turno = 2 THEN 'Tarde'
        WHEN b.turno = 3 THEN 'Noite'
        WHEN b.turno = 4 THEN 'Integral'
        ELSE 'Geral'
    END AS turno_nome,
    b.id_obreiro,
    o.nome AS nome_obreiro,
    o.apelido AS apelido_obreiro,
    o.telefone AS telefone_obreiro,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    b.motivo,
    b.criado_em AS bloqueio_criado_em
FROM public.bloqueios b
INNER JOIN public.obreiros o ON b.id_obreiro = o.id_obreiro
ORDER BY b.data DESC, o.nome ASC;


-- 7. DISTRIBUIÇÃO E EQUILÍBRIO DE ESCALAS POR TURNO (Análise de Justiça na Escala)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_distribuicao_turnos_obreiros AS
SELECT 
    o.id_obreiro,
    o.nome AS nome_obreiro,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    COUNT(e.id_escala) AS total_geral_escalas,
    COUNT(CASE WHEN ev.turno = 1 THEN 1 END) AS escalas_manha,
    COUNT(CASE WHEN ev.turno = 2 THEN 1 END) AS escalas_tarde,
    COUNT(CASE WHEN ev.turno = 3 THEN 1 END) AS escalas_noite,
    COUNT(CASE WHEN ev.turno = 4 THEN 1 END) AS escalas_integral
FROM public.obreiros o
LEFT JOIN public.escala e ON o.id_obreiro = e.id_obreiro
LEFT JOIN public.eventos ev ON e.id_evento = ev.id_evento
WHERE o.ativo IS TRUE
GROUP BY o.id_obreiro, o.nome, o.diacono, o.pulpito
ORDER BY total_geral_escalas DESC, o.nome ASC;


-- 8. AUDITORIA DE CONFLITOS (Obreiros escalados em datas com bloqueio cadastrado)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_auditoria_conflitos_bloqueio AS
SELECT 
    e.id_escala,
    m.ano_referencia,
    m.mes_referencia,
    ev.data AS data_evento,
    ev.descricao AS descricao_evento,
    ev.turno AS turno_evento,
    o.id_obreiro,
    o.nome AS nome_obreiro,
    o.telefone,
    b.id_bloqueio,
    b.turno AS turno_bloqueio,
    b.motivo AS motivo_bloqueio
FROM public.escala e
INNER JOIN public.eventos ev ON e.id_evento = ev.id_evento
INNER JOIN public.mes m ON e.id_mes = m.id_mes
INNER JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
INNER JOIN public.bloqueios b ON e.id_obreiro = b.id_obreiro 
    AND ev.data = b.data 
    AND (b.turno = ev.turno OR b.turno = 4);


-- 9. DISTRIBUIÇÃO ANUAL DE OBREIROS POR DESCRIÇÃO DO EVENTO / CULTO
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_distribuicao_obreiros_por_descricao_evento AS
SELECT 
    m.ano_referencia,
    COALESCE(TRIM(ev.descricao), 'Sem Descrição') AS descricao_evento,
    o.id_obreiro,
    o.nome AS nome_obreiro,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    COUNT(e.id_escala) AS total_escalas_no_ano,
    COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END) AS total_presencas,
    COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END) AS total_faltas,
    COUNT(CASE WHEN e.checkin IS NULL THEN 1 END) AS total_pendentes,
    MAX(ev.data) AS data_ultima_escala
FROM public.escala e
INNER JOIN public.eventos ev ON e.id_evento = ev.id_evento
INNER JOIN public.mes m ON e.id_mes = m.id_mes
INNER JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
WHERE o.ativo IS TRUE
GROUP BY 
    m.ano_referencia,
    COALESCE(TRIM(ev.descricao), 'Sem Descrição'),
    o.id_obreiro, 
    o.nome, 
    o.diacono, 
    o.pulpito
ORDER BY m.ano_referencia DESC, descricao_evento ASC, total_escalas_no_ano DESC, o.nome ASC;


-- 10. CONSOLIDADO ANUAL POR DESCRIÇÃO DO EVENTO / CULTO (Métricas por Tipo de Culto)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_resumo_por_descricao_evento AS
WITH metricas_eventos AS (
    SELECT 
        m.ano_referencia,
        COALESCE(TRIM(ev.descricao), 'Sem Descrição') AS descricao_evento,
        COUNT(ev.id_evento) AS total_cultos_realizados,
        SUM(COALESCE(ev.n_primeiro_horario, 0) + COALESCE(ev.n_segundo_horario, 0) + COALESCE(ev.n_terceiro_horario, 0)) AS total_vagas_ofertadas
    FROM public.eventos ev
    INNER JOIN public.mes m ON ev.id_mes = m.id_mes
    GROUP BY m.ano_referencia, COALESCE(TRIM(ev.descricao), 'Sem Descrição')
),
metricas_escalas AS (
    SELECT 
        m.ano_referencia,
        COALESCE(TRIM(ev.descricao), 'Sem Descrição') AS descricao_evento,
        COUNT(e.id_escala) AS total_escalados_acumulado,
        COUNT(DISTINCT e.id_obreiro) AS total_obreiros_distintos_atendidos,
        COUNT(CASE WHEN o.diacono IS TRUE THEN 1 END) AS total_diaconos_escalados,
        COUNT(CASE WHEN o.pulpito IS TRUE THEN 1 END) AS total_pulpito_escalados,
        COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END) AS total_presencas,
        COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END) AS total_faltas
    FROM public.escala e
    INNER JOIN public.eventos ev ON e.id_evento = ev.id_evento
    INNER JOIN public.mes m ON e.id_mes = m.id_mes
    LEFT JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
    GROUP BY m.ano_referencia, COALESCE(TRIM(ev.descricao), 'Sem Descrição')
)
SELECT 
    me.ano_referencia,
    me.descricao_evento,
    me.total_cultos_realizados,
    me.total_vagas_ofertadas,
    COALESCE(ms.total_escalados_acumulado, 0) AS total_escalados_acumulado,
    COALESCE(ms.total_obreiros_distintos_atendidos, 0) AS total_obreiros_distintos_atendidos,
    ROUND(COALESCE(ms.total_escalados_acumulado, 0)::NUMERIC / NULLIF(me.total_cultos_realizados, 0), 1) AS media_obreiros_por_culto,
    COALESCE(ms.total_diaconos_escalados, 0) AS total_diaconos_escalados,
    COALESCE(ms.total_pulpito_escalados, 0) AS total_pulpito_escalados,
    COALESCE(ms.total_presencas, 0) AS total_presencas,
    COALESCE(ms.total_faltas, 0) AS total_faltas,
    ROUND(
        (COALESCE(ms.total_presencas, 0)::NUMERIC * 100.0) / 
        NULLIF(COALESCE(ms.total_presencas, 0) + COALESCE(ms.total_faltas, 0), 0),
        1
    ) AS taxa_presenca_pct
FROM metricas_eventos me
LEFT JOIN metricas_escalas ms ON me.ano_referencia = ms.ano_referencia 
    AND me.descricao_evento = ms.descricao_evento
ORDER BY me.ano_referencia DESC, me.total_cultos_realizados DESC, me.descricao_evento ASC;


-- 11. ASSIDUIDADE ANUAL POR OBREIRO (Acompanhamento Ano a Ano)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_assiduidade_obreiros_anual AS
SELECT 
    m.ano_referencia,
    o.id_obreiro,
    o.nome AS nome_obreiro,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    COUNT(e.id_escala) AS total_escalas_ano,
    COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END) AS presencas_ano,
    COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END) AS faltas_ano,
    COUNT(CASE WHEN e.checkin IS NULL THEN 1 END) AS pendentes_ano,
    ROUND(
        (COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END)::NUMERIC * 100.0) / 
        NULLIF(COUNT(CASE WHEN e.checkin IS NOT NULL THEN 1 END), 0),
        1
    ) AS taxa_presenca_ano_pct
FROM public.escala e
INNER JOIN public.mes m ON e.id_mes = m.id_mes
INNER JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
GROUP BY 
    m.ano_referencia, 
    o.id_obreiro, 
    o.nome, 
    o.diacono, 
    o.pulpito
ORDER BY m.ano_referencia DESC, total_escalas_ano DESC, o.nome ASC;


-- 12. ESCALAS DE OBREIROS POR POSTO / LOCAL DE ATUAÇÃO
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_escalas_obreiros_por_posto AS
SELECT 
    m.ano_referencia,
    m.id_mes,
    m.mes_referencia,
    o.id_obreiro,
    o.nome AS nome_obreiro,
    o.apelido AS apelido_obreiro,
    o.diacono AS is_diacono,
    o.pulpito AS is_pulpito,
    COALESCE(l.id_local, 0) AS id_local,
    COALESCE(l.nome, 'Sem Posto Definido') AS nome_local,
    COALESCE(a.id_area, 0) AS id_area,
    COALESCE(a.nome, 'Geral') AS nome_area,
    COALESCE(a.icone, '📍') AS icone_area,
    COUNT(e.id_escala) AS total_escalas_posto,
    COUNT(CASE WHEN e.checkin IS TRUE THEN 1 END) AS total_presencas,
    COUNT(CASE WHEN e.checkin IS FALSE THEN 1 END) AS total_faltas,
    COUNT(CASE WHEN e.checkin IS NULL THEN 1 END) AS total_pendentes,
    MAX(ev.data) AS data_ultima_escala
FROM public.escala e
INNER JOIN public.mes m ON e.id_mes = m.id_mes
INNER JOIN public.obreiros o ON e.id_obreiro = o.id_obreiro
LEFT JOIN public.eventos ev ON e.id_evento = ev.id_evento
LEFT JOIN public.locais l ON e.id_local = l.id_local
LEFT JOIN public.areas a ON l.id_area = a.id_area
WHERE o.ativo IS TRUE
GROUP BY 
    m.ano_referencia,
    m.id_mes,
    m.mes_referencia,
    o.id_obreiro,
    o.nome,
    o.apelido,
    o.diacono,
    o.pulpito,
    COALESCE(l.id_local, 0),
    COALESCE(l.nome, 'Sem Posto Definido'),
    COALESCE(a.id_area, 0),
    COALESCE(a.nome, 'Geral'),
    COALESCE(a.icone, '📍')
ORDER BY 
    m.ano_referencia DESC,
    nome_obreiro ASC,
    total_escalas_posto DESC;

