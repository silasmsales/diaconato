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

export function findCurrentMes(meses: Mes[]): Mes | undefined {
  if (!meses || meses.length === 0) return undefined;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1 a 12

  // 1. Tentar encontrar o mês e ano exatos de hoje
  const exact = meses.find(m => Number(m.ano_referencia) === currentYear && Number(m.mes_referencia) === currentMonth);
  if (exact) return exact;

  // 2. Tentar encontrar o mês atual ou seguinte no mesmo ano
  const futureOrCurrentYear = meses.find(m => Number(m.ano_referencia) === currentYear && Number(m.mes_referencia) >= currentMonth);
  if (futureOrCurrentYear) return futureOrCurrentYear;

  // 3. Fallback para o primeiro mês cadastrado
  return meses[0];
}