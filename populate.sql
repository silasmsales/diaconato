-- ====================================================================
-- Script de Povoamento Geral (populate.sql)
-- Sistema de Gestão do Diaconato
-- ====================================================================

-- 1. Limpeza prévia e reinicialização das sequências
TRUNCATE TABLE public.escala CASCADE;
TRUNCATE TABLE public.bloqueios CASCADE;
TRUNCATE TABLE public.eventos CASCADE;
TRUNCATE TABLE public.tipo_evento CASCADE;
TRUNCATE TABLE public.obreiros CASCADE;
TRUNCATE TABLE public.locais CASCADE;

ALTER SEQUENCE public.obreiros_id_obreiro_seq RESTART WITH 1;
ALTER SEQUENCE public.tipo_evento_id_tipo_evento_seq RESTART WITH 1;
ALTER SEQUENCE public.locais_id_local_seq RESTART WITH 1;

-- ====================================================================
-- 2. Tabela Obreiros (62 Obreiros/Diáconos)
-- ====================================================================
INSERT INTO public.obreiros (id_obreiro, nome, telefone, diacono, pulpito, lider, ativo) VALUES
(1, 'Aldo', '9899100001', TRUE, FALSE, FALSE, TRUE),
(2, 'Alexandre', '9899100002', TRUE, TRUE, FALSE, TRUE),
(3, 'Antonio Ferreira', '9899100003', TRUE, FALSE, FALSE, TRUE),
(4, 'Carlos', '9899100004', TRUE, FALSE, FALSE, TRUE),
(5, 'Daniel Andrade', '9899100005', TRUE, FALSE, FALSE, TRUE),
(6, 'Daniel Nascimento', '9899100006', TRUE, FALSE, FALSE, TRUE),
(7, 'Davi', '9899100007', TRUE, TRUE, TRUE, TRUE),
(8, 'Deusimar', '9899100008', TRUE, TRUE, FALSE, TRUE),
(9, 'Eduardo Fagundes', '9899100009', TRUE, FALSE, FALSE, TRUE),
(10, 'Eduardo Braga', '9899100010', TRUE, TRUE, FALSE, TRUE),
(11, 'Elison', '9899100011', TRUE, FALSE, FALSE, TRUE),
(12, 'Emanoel', '9899100012', TRUE, TRUE, FALSE, TRUE),
(13, 'Epitacio', '9899100013', TRUE, FALSE, FALSE, FALSE),
(14, 'Ezequiel', '9899100014', TRUE, TRUE, FALSE, TRUE),
(15, 'Felipe Gomes', '9899100015', TRUE, TRUE, FALSE, TRUE),
(16, 'Fellipe Bento', '9899100016', TRUE, FALSE, FALSE, TRUE),
(17, 'Fernando', '9899100017', TRUE, FALSE, FALSE, TRUE),
(18, 'Franklin', '9899100018', TRUE, FALSE, FALSE, TRUE),
(19, 'Frederico', '9899100019', TRUE, FALSE, FALSE, TRUE),
(20, 'Gabriel', '9899100020', TRUE, TRUE, TRUE, TRUE),
(21, 'Gabriel Rodrigues', '9899100021', TRUE, FALSE, FALSE, TRUE),
(22, 'Geovannine', '9899100022', TRUE, FALSE, FALSE, TRUE),
(23, 'Gilberto', '9899100023', TRUE, FALSE, FALSE, TRUE),
(24, 'Humberto', '9899100024', TRUE, FALSE, FALSE, TRUE),
(25, 'Israel', '9899100025', TRUE, FALSE, FALSE, TRUE),
(26, 'Jailton', '9899100026', TRUE, FALSE, FALSE, FALSE),
(27, 'Jairo', '9899100027', TRUE, FALSE, FALSE, FALSE),
(28, 'Jairo Pessoa', '9899100028', TRUE, FALSE, FALSE, TRUE),
(29, 'Joeberty', '9899100029', TRUE, FALSE, FALSE, TRUE),
(30, 'Joel', '9899100030', TRUE, FALSE, FALSE, TRUE),
(31, 'Johannes', '9899100031', TRUE, FALSE, FALSE, TRUE),
(32, 'Jorge', '9899100032', TRUE, FALSE, TRUE, TRUE),
(33, 'Jose Roriz', '9899100033', TRUE, FALSE, FALSE, TRUE),
(34, 'Junior', '9899100034', TRUE, FALSE, FALSE, TRUE),
(35, 'Leonardo', '9899100035', TRUE, FALSE, FALSE, TRUE),
(36, 'Lucas', '9899100036', TRUE, TRUE, TRUE, TRUE),
(37, 'Luiz Antonio', '9899100037', TRUE, FALSE, FALSE, TRUE),
(38, 'Luiz Claudio', '9899100038', TRUE, FALSE, FALSE, FALSE),
(39, 'Marcos', '9899100039', TRUE, FALSE, FALSE, TRUE),
(40, 'Mateus Henrique', '9899100040', TRUE, FALSE, FALSE, TRUE),
(41, 'Matheus Damasceno', '9899100041', TRUE, FALSE, FALSE, TRUE),
(42, 'Moacir', '9899100042', TRUE, FALSE, FALSE, TRUE),
(43, 'Nelito', '9899100043', TRUE, TRUE, FALSE, TRUE),
(44, 'Nelson', '9899100044', TRUE, FALSE, FALSE, TRUE),
(45, 'Oscar', '9899100045', TRUE, FALSE, FALSE, TRUE),
(46, 'Oslei', '9899100046', TRUE, FALSE, FALSE, TRUE),
(47, 'Paulo Henrique', '9899100047', TRUE, FALSE, FALSE, TRUE),
(48, 'Pedro', '9899100048', TRUE, FALSE, FALSE, TRUE),
(49, 'Ribamar', '9899100049', TRUE, FALSE, FALSE, TRUE),
(50, 'Ricardo', '9899100050', TRUE, FALSE, FALSE, TRUE),
(51, 'Rogerio', '9899100043', TRUE, FALSE, FALSE, TRUE),
(52, 'Sadrac', '9899100044', TRUE, FALSE, FALSE, TRUE),
(53, 'Samuel', '9899100045', TRUE, FALSE, FALSE, TRUE),
(54, 'Silas', '9899100046', TRUE, FALSE, FALSE, TRUE),
(55, 'Sirlon', '9899100047', TRUE, FALSE, FALSE, TRUE),
(56, 'Toninho', '9899100048', TRUE, FALSE, TRUE, TRUE),
(57, 'Victor', '9899100049', TRUE, FALSE, TRUE, TRUE),
(58, 'Vinicius', '9899100050', TRUE, FALSE, FALSE, TRUE),
(59, 'Wagner', '9899100043', TRUE, FALSE, FALSE, TRUE),
(60, 'Walker', '9899100044', TRUE, FALSE, FALSE, TRUE),
(61, 'Webert', '9899100045', TRUE, FALSE, FALSE, TRUE),
(62, 'Wilson', '9899100046', TRUE, FALSE, FALSE, TRUE);

SELECT setval('public.obreiros_id_obreiro_seq', 62, true);

-- ====================================================================
-- 3. Tabela Tipo Evento (Modelos Padrão de Cultos)
-- ====================================================================
INSERT INTO public.tipo_evento (
    id_tipo_evento,
    descricao_padrao,
    dia_semana_padrao,
    turno_padrao,
    n_primeiro_horario_padrao,
    exclusivo_diacono_primeiro_padrao,
    n_segundo_horario_padrao,
    exclusivo_diacono_segundo_padrao,
    n_terceiro_horario_padrao,
    exclusivo_diacono_terceiro_padrao,
    pulpito_primeiro,
    pulpito_segundo,
    pulpito_terceiro,
    criado_em
) VALUES
(1, 'Primícias + EBD', 1, 1, 3, FALSE, 0, FALSE, 0, FALSE, TRUE, FALSE, FALSE, '2026-08-25 13:56:46.938113+00'),
(2, 'Primícias', NULL, 1, 3, FALSE, 3, FALSE, 0, FALSE, TRUE, TRUE, FALSE, '2026-08-25 13:57:18.911716+00'),
(3, 'Culto de Domingo', 1, 3, 8, FALSE, 8, FALSE, 0, FALSE, TRUE, TRUE, FALSE, '2026-08-25 13:57:59.021044+00'),
(4, 'Santa Ceia', NULL, 3, 12, TRUE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE, '2026-08-25 13:58:31.026289+00'),
(5, 'Culto de Ensino', 3, 3, 6, FALSE, 4, FALSE, 0, FALSE, TRUE, TRUE, FALSE, '2026-08-25 13:59:31.761581+00'),
(6, 'Culto Profético', 5, 3, 3, FALSE, 2, FALSE, 0, FALSE, TRUE, TRUE, FALSE, '2026-08-25 14:00:49.170036+00');

SELECT setval('public.tipo_evento_id_tipo_evento_seq', 6, true);

-- ====================================================================
-- 4. Tabela Locais de Atuação dos Obreiros
-- ====================================================================

INSERT INTO public.locais (id_local, nome, area, descricao, ordem, ativo) VALUES
(1, 'Porta Principal', 'Igreja', 'Recepção e acolhimento na entrada principal da igreja', 1, TRUE),
(2, 'Porta Lateral', 'Igreja', 'Apoio e fluxo na entrada lateral', 2, TRUE),
(3, 'Púlpito', 'Igreja', 'Serviço e apoio ao altar e púlpito ministerial', 3, TRUE),
(4, 'Anexo', 'Igreja', 'Apoio às dependências anexas e circulação', 4, TRUE),
(5, 'SAMU', 'Estacionamento', 'Coordenação da área de estacionamento próxima ao SAMU', 1, TRUE),
(6, 'Frente Igreja', 'Estacionamento', 'Organização de vagas e fluxo na frente da igreja', 2, TRUE);

SELECT setval('public.locais_id_local_seq', 6, true);

