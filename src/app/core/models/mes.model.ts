export interface Mes {
  id_mes?: number;
  ano_referencia: number;
  mes_referencia: number; // 1 a 12
  criado_em?: string;
}

export type CreateMesDto = Omit<Mes, 'id_mes' | 'criado_em'>;
export type UpdateMesDto = Partial<CreateMesDto>;

export const MESES_NOMES: Record<number, string> = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Abril',
  5: 'Maio',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro'
};

export function formatMesReferencia(mes?: Mes | null): string {
  if (!mes) return '';
  const nome = MESES_NOMES[mes.mes_referencia] || `Mês ${mes.mes_referencia}`;
  return `${nome}/${mes.ano_referencia}`;
}