import { Area, getAreaBadgeStyle } from './area.model';

export interface Local {
  id_local: number;
  id_area: number;
  nome: string;
  descricao?: string | null;
  ordem: number;
  ativo: boolean;
  criado_em?: string;
  areas?: Area; // Relacionamento com tabela areas
}

export interface CreateLocalDto {
  id_area: number;
  nome: string;
  descricao?: string | null;
  ordem?: number;
  ativo?: boolean;
}

export interface UpdateLocalDto {
  id_area?: number;
  nome?: string;
  descricao?: string | null;
  ordem?: number;
  ativo?: boolean;
}

export function getAreaStyle(areaNome?: string) {
  return getAreaBadgeStyle(areaNome || '');
}
