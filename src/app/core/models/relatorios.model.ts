export interface AssiduidadeObreiro {
  id_obreiro: number;
  nome_obreiro: string;
  apelido_obreiro?: string;
  telefone?: string;
  is_diacono: boolean;
  is_pulpito: boolean;
  is_lider: boolean;
  is_ativo: boolean;
  total_escalas: number;
  total_presencas: number;
  total_faltas: number;
  total_pendentes: number;
  taxa_presenca_pct: number | null;
  taxa_falta_pct: number | null;
}

export interface AssiduidadeObreiroMensal {
  id_mes: number;
  ano_referencia: number;
  mes_referencia: number;
  id_obreiro: number;
  nome_obreiro: string;
  is_diacono: boolean;
  is_pulpito: boolean;
  total_escalas_mes: number;
  presencas_mes: number;
  faltas_mes: number;
  pendentes_mes: number;
  taxa_presenca_mes_pct: number | null;
}

export interface AssiduidadeObreiroAnual {
  ano_referencia: number;
  id_obreiro: number;
  nome_obreiro: string;
  is_diacono: boolean;
  is_pulpito: boolean;
  total_escalas_ano: number;
  presencas_ano: number;
  faltas_ano: number;
  pendentes_ano: number;
  taxa_presenca_ano_pct: number | null;
}

export interface CoberturaEvento {
  id_evento: number;
  id_mes: number;
  ano_referencia: number;
  mes_referencia: number;
  data_evento: string;
  descricao_evento: string;
  id_turno: number;
  turno_nome: string;
  total_vagas_previstas: number;
  vagas_exclusivas_diaconos: number;
  total_escalados: number;
  total_diaconos_escalados: number;
  total_pulpito_escalados: number;
  vagas_em_aberto: number;
  taxa_ocupacao_pct: number | null;
  total_presentes: number;
  total_faltas: number;
  total_pendentes: number;
}

export interface ResumoMensalDiaconato {
  id_mes: number;
  ano_referencia: number;
  mes_referencia: number;
  total_cultos_mes: number;
  total_vagas_ofertadas: number;
  total_escalas_realizadas: number;
  total_obreiros_engajados: number;
  total_presencas_mes: number;
  total_faltas_mes: number;
  total_pendentes_mes: number;
  taxa_presenca_geral_pct: number | null;
  total_bloqueios_registrados: number;
}

export interface DistribuicaoObreiroEvento {
  ano_referencia: number;
  descricao_evento: string;
  id_obreiro: number;
  nome_obreiro: string;
  is_diacono: boolean;
  is_pulpito: boolean;
  total_escalas_no_ano: number;
  total_presencas: number;
  total_faltas: number;
  total_pendentes: number;
  data_ultima_escala: string;
}

export interface ResumoPorDescricaoEvento {
  ano_referencia: number;
  descricao_evento: string;
  total_cultos_realizados: number;
  total_vagas_ofertadas: number;
  total_escalados_acumulado: number;
  total_obreiros_distintos_atendidos: number;
  media_obreiros_por_culto: number;
  total_diaconos_escalados: number;
  total_pulpito_escalados: number;
  total_presencas: number;
  total_faltas: number;
  taxa_presenca_pct: number | null;
}

export interface ConflitoBloqueio {
  id_escala: number;
  ano_referencia: number;
  mes_referencia: number;
  data_evento: string;
  descricao_evento: string;
  turno_evento: number;
  id_obreiro: number;
  nome_obreiro: string;
  telefone?: string;
  id_bloqueio: number;
  turno_bloqueio: number;
  motivo_bloqueio?: string;
}

export interface EscalaObreiroPosto {
  ano_referencia?: number;
  id_mes?: number;
  mes_referencia?: number;
  id_obreiro: number;
  nome_obreiro: string;
  apelido_obreiro?: string;
  is_diacono: boolean;
  is_pulpito: boolean;
  id_local: number;
  nome_local: string;
  id_area: number;
  nome_area: string;
  icone_area?: string;
  total_escalas_posto: number;
  total_presencas?: number;
  total_faltas?: number;
  total_pendentes?: number;
  data_ultima_escala?: string;
}

