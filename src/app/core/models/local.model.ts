export interface Local {
  id_local: number;
  nome: string;
  area: string; // 'Igreja', 'Estacionamento' ou outras áreas cadastradas
  descricao?: string | null;
  ordem: number;
  ativo: boolean;
  criado_em?: string;
}

export interface CreateLocalDto {
  nome: string;
  area: string;
  descricao?: string | null;
  ordem?: number;
  ativo?: boolean;
}

export interface UpdateLocalDto {
  nome?: string;
  area?: string;
  descricao?: string | null;
  ordem?: number;
  ativo?: boolean;
}

export const PRESET_AREAS: string[] = ['Igreja', 'Estacionamento'];

export const AREA_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'Igreja': {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    icon: '🏛️'
  },
  'Estacionamento': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: '🚗'
  }
};

export function getAreaStyle(area: string) {
  if (AREA_STYLES[area]) {
    return AREA_STYLES[area];
  }
  // Default style for dynamic/custom areas
  return {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    icon: '📍'
  };
}
