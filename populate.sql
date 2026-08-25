-- ====================================================================
-- Script de Povoamento Completo e Variado (populate.sql)
-- Sistema de Gestão do Diaconato
-- ====================================================================

-- 1. Limpeza prévia dos dados e reinicialização de sequências
TRUNCATE TABLE public.escala CASCADE;
TRUNCATE TABLE public.bloqueios CASCADE;
TRUNCATE TABLE public.eventos CASCADE;
TRUNCATE TABLE public.tipo_evento CASCADE;
TRUNCATE TABLE public.mes CASCADE;
TRUNCATE TABLE public.obreiros CASCADE;

ALTER SEQUENCE public.obreiros_id_obreiro_seq RESTART WITH 1;
ALTER SEQUENCE public.mes_id_mes_seq RESTART WITH 1;
ALTER SEQUENCE public.tipo_evento_id_tipo_evento_seq RESTART WITH 1;
ALTER SEQUENCE public.bloqueios_id_bloqueio_seq RESTART WITH 1;
ALTER SEQUENCE public.eventos_id_evento_seq RESTART WITH 1;
ALTER SEQUENCE public.escala_id_escala_seq RESTART WITH 1;

-- ====================================================================
-- 2. Tabela Obreiros (32 Obreiros com grande variedade de perfis)
-- ====================================================================
INSERT INTO public.obreiros (nome, apelido, telefone, email, diacono, pulpito, lider, ativo, foto, data_nascimento) VALUES
-- Líderes e Diáconos Veteranos
('Silas Martins Sales', 'Silas', '(11) 98765-4321', 'silas.sales@diaconato.org', TRUE, TRUE, TRUE, TRUE, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '1988-05-15'),
('Marcos Paulo de Oliveira', 'Marcão', '(11) 97654-3210', 'marcos.oliveira@diaconato.org', TRUE, TRUE, TRUE, TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '1982-08-20'),
('Roberto Carlos de Almeida', 'Beto', '(11) 92109-8765', 'roberto.almeida@diaconato.org', TRUE, TRUE, TRUE, TRUE, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '1975-12-05'),
('Ezequiel Duarte dos Anjos', 'Pr. Zequinha', '(11) 93456-7890', 'ezequiel.anjos@diaconato.org', TRUE, TRUE, TRUE, TRUE, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '1972-03-10'),

-- Diáconos Ativos
('Gabriel Souza Santos', 'Biel', '(11) 95432-1098', 'gabriel.santos@diaconato.org', TRUE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '1996-02-17'),
('Daniel Felipe Cardoso', 'Dani', '(11) 90987-6543', 'daniel.cardoso@diaconato.org', TRUE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', '1989-03-30'),
('Fernanda Costa e Silva', 'Nanda', '(11) 97623-4567', 'fernanda.costa@diaconato.org', TRUE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '1987-01-25'),
('Claudio Roberto Nogueira', 'Claudinho', '(11) 94567-8901', 'claudio.nogueira@diaconato.org', TRUE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '1980-09-14'),
('Samuel Henrique Farias', 'Samuca', '(11) 95678-9012', 'samuel.farias@diaconato.org', TRUE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150', '1991-06-22'),
('Renato Augusto Moreira', 'Renatinho', '(11) 96789-0123', 'renato.moreira@diaconato.org', TRUE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', '1984-11-18'),

-- Obreiras e Apoio de Púlpito
('Ana Carolina Ferreira', 'Carol', '(11) 96543-2109', 'ana.ferreira@diaconato.org', FALSE, FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '1993-11-03'),
('Juliana Maria Mendes', 'Ju', '(11) 94321-0987', 'juliana.mendes@diaconato.org', FALSE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '1995-09-28'),
('Priscila Barbosa Ramos', 'Pri', '(11) 99876-5432', 'priscila.ramos@diaconato.org', FALSE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '1992-10-14'),
('Beatriz Helena Guimarães', 'Bia', '(11) 97890-1234', 'beatriz.guimaraes@diaconato.org', FALSE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', '1997-04-05'),
('Debora Cristina Peixoto', 'Deby', '(11) 98901-2345', 'debora.peixoto@diaconato.org', FALSE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', '1990-12-11'),
('Talita Roberta Antunes', 'Tali', '(11) 99012-3456', 'talita.antunes@diaconato.org', FALSE, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150', '1994-07-09'),

-- Obreiros de Recepção e Portaria
('Lucas Henrique Lima', 'Luquinhas', '(11) 93210-9876', 'lucas.lima@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', '2001-04-12'),
('Camila Rodrigues Alves', 'Cami', '(11) 91098-7654', 'camila.alves@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '1996-07-22'),
('Tiago Ribeiro Silva', 'Tiaguinho', '(11) 98712-3456', 'tiago.silva@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', '2000-06-08'),
('Matheus Vinicius Correa', 'Theus', '(11) 91234-5678', 'matheus.correa@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150', '2002-08-15'),
('Larissa Manoela Prado', 'Lari', '(11) 92345-6789', 'larissa.prado@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '1999-01-20'),
('Felipe Andre Brandão', 'Lipe', '(11) 93456-7891', 'felipe.brandao@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', '1997-10-02'),
('Gustavo Henrique Passos', 'Guga', '(11) 94567-8912', 'gustavo.passos@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', '2003-03-25'),
('Jessica Lorraine Castro', 'Jess', '(11) 95678-9123', 'jessica.castro@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '1995-05-30'),
('Bruno Leonardo Martins', 'Bruninho', '(11) 96789-1234', 'bruno.martins@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '1998-12-14'),
('Patricia Regina Fontes', 'Pati', '(11) 97890-2345', 'patricia.fontes@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '1991-08-07'),
('Rodrigo Cesar Vasconcelos', 'Digão', '(11) 98901-3456', 'rodrigo.vasconcelos@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '1986-04-18'),
('Vanessa Souza Bittencourt', 'Nessa', '(11) 99012-4567', 'vanessa.bittencourt@diaconato.org', FALSE, FALSE, FALSE, TRUE, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '1993-09-03'),

-- Obreiros Inativos / Licenciados
('Eduardo Castro Vieira', 'Dudu', '(11) 96534-5678', 'eduardo.vieira@diaconato.org', FALSE, FALSE, FALSE, FALSE, NULL, '1994-08-19'),
('Andreia Cristina Toledo', 'Deia', '(11) 91122-3344', 'andreia.toledo@diaconato.org', FALSE, FALSE, FALSE, FALSE, NULL, '1989-11-27'),
('Wellington Jorge Ramos', 'Tom', '(11) 92233-4455', 'wellington.ramos@diaconato.org', TRUE, FALSE, FALSE, FALSE, NULL, '1981-02-14'),
('Claudia Regina Batista', 'Clau', '(11) 93344-5566', 'claudia.batista@diaconato.org', FALSE, TRUE, FALSE, FALSE, NULL, '1990-06-01');

-- ====================================================================
-- 3. Tabela Mes (12 Meses do Ano de 2026)
-- ====================================================================
INSERT INTO public.mes (ano_referencia, mes_referencia) VALUES
(2026, 1),  -- id_mes = 1 (Janeiro/2026)
(2026, 2),  -- id_mes = 2 (Fevereiro/2026)
(2026, 3),  -- id_mes = 3 (Março/2026)
(2026, 4),  -- id_mes = 4 (Abril/2026)
(2026, 5),  -- id_mes = 5 (Maio/2026)
(2026, 6),  -- id_mes = 6 (Junho/2026)
(2026, 7),  -- id_mes = 7 (Julho/2026)
(2026, 8),  -- id_mes = 8 (Agosto/2026)
(2026, 9),  -- id_mes = 9 (Setembro/2026)
(2026, 10), -- id_mes = 10 (Outubro/2026)
(2026, 11), -- id_mes = 11 (Novembro/2026)
(2026, 12); -- id_mes = 12 (Dezembro/2026)

-- ====================================================================
-- 4. Tabela Tipo Evento (Modelos Padrão de Cultos)
-- ====================================================================
INSERT INTO public.tipo_evento (
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
    pulpito_terceiro
) VALUES
-- 1: Culto da Família (Domingo Noite)
('Culto de Celebração da Família', 1, 3, 4, TRUE, 3, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
-- 2: Santa Ceia do Senhor (1º Domingo Noite)
('Culto de Santa Ceia do Senhor', 1, 3, 6, TRUE, 4, TRUE, 2, FALSE, TRUE, TRUE, TRUE),
-- 3: Escola Bíblica Dominical (Domingo Manhã)
('Escola Bíblica Dominical (EBD)', 1, 1, 3, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
-- 4: Culto de Doutrina e Ensino (Quinta Noite)
('Culto de Doutrina e Ensino Bíblico', 5, 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- 5: Reunião de Oração e Avivamento (Terça Noite)
('Culto de Oração e Clamor', 3, 3, 2, FALSE, 1, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
-- 6: Culto de Jovens Conectados (Sábado Noite)
('Culto Conectados (Jovens e Adolescentes)', 7, 3, 3, FALSE, 3, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- 7: Chá de Mulheres / Encontro de Casais (Sábado Tarde)
('Encontro Especial de Mulheres / Família', 7, 2, 3, FALSE, 2, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
-- 8: Vigília de Oração e Intercessão (Sexta Noite/Madrugada)
('Vigília Geral de Oração e Clamor', 6, 3, 4, TRUE, 3, FALSE, 0, FALSE, TRUE, FALSE, FALSE);

-- ====================================================================
-- 5. Tabela Eventos (Cultos nos meses de Setembro e Outubro/2026)
-- ====================================================================
INSERT INTO public.eventos (
    id_mes,
    data,
    descricao,
    turno,
    n_primeiro_horario,
    exclusivo_diacono_primeiro,
    n_segundo_horario,
    exclusivo_diacono_segundo,
    n_terceiro_horario,
    exclusivo_diacono_terceiro,
    pulpito_primeiro,
    pulpito_segundo,
    pulpito_terceiro
) VALUES
-- === SETEMBRO / 2026 (id_mes = 9) ===
-- Terça 01/09
(9, '2026-09-01', 'Culto de Oração e Clamor', 3, 2, FALSE, 1, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
-- Quinta 03/09
(9, '2026-09-03', 'Culto de Doutrina e Ensino Bíblico', 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Sexta 04/09
(9, '2026-09-04', 'Vigília de Abertura do Mês', 3, 4, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Domingo 06/09 (Santa Ceia)
(9, '2026-09-06', 'Escola Bíblica Dominical', 1, 3, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
(9, '2026-09-06', 'Culto Solene de Santa Ceia', 3, 6, TRUE, 4, TRUE, 2, FALSE, TRUE, TRUE, TRUE),
-- Terça 08/09
(9, '2026-09-08', 'Culto de Oração e Clamor', 3, 2, FALSE, 1, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
-- Quinta 10/09
(9, '2026-09-10', 'Culto de Doutrina e Ensino Bíblico', 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Sábado 12/09
(9, '2026-09-12', 'Culto Conectados (Jovens)', 3, 3, FALSE, 3, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Domingo 13/09
(9, '2026-09-13', 'Escola Bíblica Dominical', 1, 3, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
(9, '2026-09-13', 'Culto de Celebração da Família', 3, 4, TRUE, 3, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
-- Terça 15/09
(9, '2026-09-15', 'Culto de Oração e Clamor', 3, 2, FALSE, 1, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
-- Quinta 17/09
(9, '2026-09-17', 'Culto de Doutrina e Ensino Bíblico', 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Sábado 19/09
(9, '2026-09-19', 'Chá e Encontro de Mulheres', 2, 3, FALSE, 2, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
(9, '2026-09-19', 'Culto de Louvor e Gratidão', 3, 3, FALSE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Domingo 20/09
(9, '2026-09-20', 'Escola Bíblica Dominical', 1, 3, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
(9, '2026-09-20', 'Culto de Celebração da Família', 3, 4, TRUE, 3, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
-- Terça 22/09
(9, '2026-09-22', 'Culto de Oração e Clamor', 3, 2, FALSE, 1, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
-- Quinta 24/09
(9, '2026-09-24', 'Culto de Doutrina e Ensino Bíblico', 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Domingo 27/09
(9, '2026-09-27', 'Escola Bíblica Dominical', 1, 3, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
(9, '2026-09-27', 'Culto de Missões e Evangelismo', 3, 4, TRUE, 3, FALSE, 0, FALSE, TRUE, TRUE, FALSE),

-- === OUTUBRO / 2026 (id_mes = 10) ===
-- Quinta 01/10
(10, '2026-10-01', 'Culto de Doutrina e Abertura', 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Domingo 04/10 (Santa Ceia)
(10, '2026-10-04', 'Escola Bíblica Dominical', 1, 3, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
(10, '2026-10-04', 'Culto Solene de Santa Ceia', 3, 6, TRUE, 4, TRUE, 2, FALSE, TRUE, TRUE, TRUE),
-- Quinta 08/10
(10, '2026-10-08', 'Culto de Doutrina e Ensino Bíblico', 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Domingo 11/10
(10, '2026-10-11', 'Escola Bíblica Dominical', 1, 3, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
(10, '2026-10-11', 'Culto de Celebração da Família', 3, 4, TRUE, 3, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
-- Segunda 12/10 (Feriado - Dia das Crianças)
(10, '2026-10-12', 'Festa e Culto das Crianças', 2, 4, FALSE, 4, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
-- Quinta 15/10
(10, '2026-10-15', 'Culto de Doutrina e Ensino Bíblico', 3, 3, TRUE, 2, FALSE, 0, FALSE, TRUE, FALSE, FALSE),
-- Sábado 17/10
(10, '2026-10-17', 'Congresso de Jovens (Noite 1)', 3, 5, TRUE, 4, FALSE, 0, FALSE, TRUE, TRUE, FALSE),
-- Domingo 18/10
(10, '2026-10-18', 'Escola Bíblica Dominical Especial', 1, 4, FALSE, 0, FALSE, 0, FALSE, FALSE, FALSE, FALSE),
(10, '2026-10-18', 'Encerramento Congresso de Jovens', 3, 6, TRUE, 5, FALSE, 0, FALSE, TRUE, TRUE, FALSE);

-- ====================================================================
-- 6. Tabela Bloqueios (Variados entre Datas, Períodos e Turnos)
-- ====================================================================
INSERT INTO public.bloqueios (data, turno, id_obreiro, motivo) VALUES
-- Silas Martins Sales (Viagem de trabalho no início de Setembro)
('2026-09-01', 1, 1, 'Viagem corporativa para conferência'),
('2026-09-01', 2, 1, 'Viagem corporativa para conferência'),
('2026-09-01', 3, 1, 'Viagem corporativa para conferência'),
('2026-09-02', 3, 1, 'Retorno de viagem'),

-- Marcos Paulo (Folga programada e plantão)
('2026-09-06', 1, 2, 'Compromisso com família no interior'),
('2026-09-06', 2, 2, 'Compromisso com família no interior'),
('2026-09-06', 3, 2, 'Compromisso com família no interior'),
('2026-10-12', 2, 2, 'Almoço de aniversário de casamento'),

-- Gabriel Souza Santos (Estudos e Faculdade)
('2026-09-10', 3, 5, 'Semana de provas na faculdade'),
('2026-09-17', 3, 5, 'Apresentação de TCC / Seminário'),
('2026-10-15', 3, 5, 'Plantão de estágio'),

-- Daniel Felipe Cardoso (Plantão médico/hospitalar)
('2026-09-13', 1, 6, 'Plantão de 24h no pronto atendimento'),
('2026-09-13', 2, 6, 'Plantão de 24h no pronto atendimento'),
('2026-09-13', 3, 6, 'Plantão de 24h no pronto atendimento'),

-- Fernanda Costa (Viagem de férias)
('2026-09-20', 1, 7, 'Férias da família'),
('2026-09-20', 3, 7, 'Férias da família'),
('2026-09-27', 1, 7, 'Férias da família'),
('2026-09-27', 3, 7, 'Férias da família'),

-- Juliana Mendes (Consulta e repouso médico)
('2026-09-03', 3, 12, 'Consulta médica com especialista'),
('2026-10-04', 3, 12, 'Procedimento odontológico'),

-- Lucas Henrique (Trabalho no sábado)
('2026-09-12', 3, 17, 'Plantão noturno no trabalho'),
('2026-10-17', 3, 17, 'Hora extra na empresa'),

-- Matheus Vinicius (Retiro da faculdade)
('2026-09-19', 2, 20, 'Retiro de estudantes'),
('2026-09-19', 3, 20, 'Retiro de estudantes'),

-- Patricia Regina (Compromisso pessoal)
('2026-09-27', 3, 26, 'Viagem para o casamento da irmã');

-- ====================================================================
-- 7. Tabela Escala (Com campo checkin: TRUE=Presente, FALSE=Falta, NULL=Pendente)
-- ====================================================================
INSERT INTO public.escala (id_evento, id_obreiro, id_mes, checkin) VALUES
-- Evento 1: Terça 01/09 - Culto de Oração (id_mes = 9) (Culto já realizado)
(1, 2, 9, TRUE),
(1, 11, 9, TRUE),
(1, 19, 9, FALSE),

-- Evento 2: Quinta 03/09 - Doutrina (id_mes = 9) (Culto já realizado)
(2, 1, 9, TRUE),
(2, 3, 9, TRUE),
(2, 6, 9, TRUE),
(2, 13, 9, TRUE),
(2, 17, 9, TRUE),

-- Evento 3: Sexta 04/09 - Vigília (id_mes = 9) (Culto já realizado)
(3, 1, 9, TRUE),
(3, 4, 9, TRUE),
(3, 7, 9, TRUE),
(3, 9, 9, FALSE),
(3, 18, 9, TRUE),
(3, 22, 9, TRUE),

-- Evento 4: Domingo 06/09 Manhã - EBD (id_mes = 9) (Culto já realizado)
(4, 3, 9, TRUE),
(4, 11, 9, TRUE),
(4, 21, 9, TRUE),

-- Evento 5: Domingo 06/09 Noite - Santa Ceia Solene (id_mes = 9) (Culto já realizado)
(5, 1, 9, TRUE),
(5, 3, 9, TRUE),
(5, 4, 9, TRUE),
(5, 6, 9, TRUE),
(5, 7, 9, TRUE),
(5, 9, 9, TRUE),
(5, 11, 9, TRUE),
(5, 13, 9, TRUE),
(5, 14, 9, TRUE),
(5, 15, 9, TRUE),
(5, 18, 9, TRUE),
(5, 19, 9, FALSE),

-- Evento 6: Terça 08/09 - Oração (id_mes = 9)
(6, 2, 9, TRUE),
(6, 8, 9, TRUE),
(6, 23, 9, NULL),

-- Evento 7: Quinta 10/09 - Doutrina (id_mes = 9)
(7, 1, 9, TRUE),
(7, 2, 9, TRUE),
(7, 10, 9, NULL),
(7, 12, 9, NULL),
(7, 24, 9, NULL),

-- Evento 8: Sábado 12/09 - Culto Jovens (id_mes = 9)
(8, 14, 9, NULL),
(8, 19, 9, NULL),
(8, 20, 9, NULL),
(8, 21, 9, NULL),
(8, 22, 9, NULL),
(8, 25, 9, NULL),

-- Evento 9: Domingo 13/09 Manhã - EBD (id_mes = 9)
(9, 2, 9, NULL),
(9, 15, 9, NULL),
(9, 26, 9, NULL),

-- Evento 10: Domingo 13/09 Noite - Família (id_mes = 9)
(10, 1, 9, NULL),
(10, 3, 9, NULL),
(10, 7, 9, NULL),
(10, 8, 9, NULL),
(10, 11, 9, NULL),
(10, 12, 9, NULL),
(10, 17, 9, NULL),

-- Evento 11: Terça 15/09 - Oração (id_mes = 9)
(11, 5, 9, NULL),
(11, 10, 9, NULL),
(11, 27, 9, NULL),

-- Evento 12: Quinta 17/09 - Doutrina (id_mes = 9)
(12, 2, 9, NULL),
(12, 4, 9, NULL),
(12, 6, 9, NULL),
(12, 13, 9, NULL),
(12, 28, 9, NULL),

-- Evento 13: Sábado 19/09 Tarde - Mulheres (id_mes = 9)
(13, 11, 9, NULL),
(13, 12, 9, NULL),
(13, 13, 9, NULL),
(13, 14, 9, NULL),
(13, 15, 9, NULL),

-- Evento 14: Sábado 19/09 Noite - Louvor (id_mes = 9)
(14, 5, 9, NULL),
(14, 9, 9, NULL),
(14, 17, 9, NULL),
(14, 22, 9, NULL),
(14, 25, 9, NULL),

-- Evento 15: Domingo 20/09 Manhã - EBD (id_mes = 9)
(15, 1, 9, NULL),
(15, 16, 9, NULL),
(15, 18, 9, NULL),

-- Evento 16: Domingo 20/09 Noite - Família (id_mes = 9)
(16, 2, 9, NULL),
(16, 3, 9, NULL),
(16, 4, 9, NULL),
(16, 6, 9, NULL),
(16, 12, 9, NULL),
(16, 14, 9, NULL),
(16, 20, 9, NULL),

-- Evento 17: Terça 22/09 - Oração (id_mes = 9)
(17, 8, 9, NULL),
(17, 23, 9, NULL),
(17, 27, 9, NULL),

-- Evento 18: Quinta 24/09 - Doutrina (id_mes = 9)
(18, 1, 9, NULL),
(18, 5, 9, NULL),
(18, 9, 9, NULL),
(18, 15, 9, NULL),
(18, 28, 9, NULL),

-- Evento 19: Domingo 27/09 Manhã - EBD (id_mes = 9)
(19, 4, 9, NULL),
(19, 13, 9, NULL),
(19, 21, 9, NULL),

-- Evento 20: Domingo 27/09 Noite - Missões (id_mes = 9)
(20, 1, 9, NULL),
(20, 2, 9, NULL),
(20, 3, 9, NULL),
(20, 6, 9, NULL),
(20, 11, 9, NULL),
(20, 16, 9, NULL),
(20, 19, 9, NULL),

-- OUTUBRO / 2026 (id_mes = 10)
-- Evento 21: Quinta 01/10
(21, 1, 10, NULL),
(21, 2, 10, NULL),
(21, 7, 10, NULL),
(21, 14, 10, NULL),
(21, 17, 10, NULL),

-- Evento 22: Domingo 04/10 Manhã - EBD
(22, 3, 10, NULL),
(22, 11, 10, NULL),
(22, 18, 10, NULL),

-- Evento 23: Domingo 04/10 Noite - Santa Ceia Solene
(23, 1, 10, NULL),
(23, 2, 10, NULL),
(23, 3, 10, NULL),
(23, 4, 10, NULL),
(23, 6, 10, NULL),
(23, 7, 10, NULL),
(23, 8, 10, NULL),
(23, 11, 10, NULL),
(23, 13, 10, NULL),
(23, 15, 10, NULL),
(23, 19, 10, NULL),
(23, 20, 10, NULL),

-- Evento 27: Segunda 12/10 Tarde - Festa das Crianças
(27, 5, 10, NULL),
(27, 11, 10, NULL),
(27, 12, 10, NULL),
(27, 14, 10, NULL),
(27, 17, 10, NULL),
(27, 18, 10, NULL),
(27, 21, 10, NULL),
(27, 22, 10, NULL),

-- Evento 29: Sábado 17/10 Noite - Congresso de Jovens
(29, 1, 10, NULL),
(29, 5, 10, NULL),
(29, 9, 10, NULL),
(29, 14, 10, NULL),
(29, 19, 10, NULL),
(29, 20, 10, NULL),
(29, 21, 10, NULL),
(29, 22, 10, NULL),
(29, 25, 10, NULL),

-- Evento 31: Domingo 18/10 Noite - Encerramento Congresso
(31, 1, 10, NULL),
(31, 2, 10, NULL),
(31, 3, 10, NULL),
(31, 4, 10, NULL),
(31, 7, 10, NULL),
(31, 9, 10, NULL),
(31, 11, 10, NULL),
(31, 13, 10, NULL),
(31, 15, 10, NULL),
(31, 16, 10, NULL),
(31, 20, 10, NULL);

