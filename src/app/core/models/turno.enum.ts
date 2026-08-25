export enum TurnoEnum {
  MANHA = 1,
  TARDE = 2,
  NOITE = 3,
  INTEGRAL = 4
}

export const TURNO_LABELS: Record<number, string> = {
  [TurnoEnum.MANHA]: 'Manhã',
  [TurnoEnum.TARDE]: 'Tarde',
  [TurnoEnum.NOITE]: 'Noite',
  [TurnoEnum.INTEGRAL]: 'Dia Inteiro'
};

export const TURNO_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  [TurnoEnum.MANHA]: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  [TurnoEnum.TARDE]: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  [TurnoEnum.NOITE]: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  [TurnoEnum.INTEGRAL]: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' }
};
