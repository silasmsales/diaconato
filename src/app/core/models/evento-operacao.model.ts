import { Area } from './area.model';

export type TrajeTipo = 'Camisa Preta' | 'Camisa Vinho' | 'Camisa Cinza' | 'Terno';

export const TRAJE_OPCOES: { label: string; value: TrajeTipo; bg: string; text: string; border: string; icon: string }[] = [
  { label: 'Camisa Preta', value: 'Camisa Preta', bg: 'bg-slate-900', text: 'text-slate-100', border: 'border-slate-700', icon: '👔' },
  { label: 'Camisa Vinho', value: 'Camisa Vinho', bg: 'bg-rose-950', text: 'text-rose-200', border: 'border-rose-800/80', icon: '👔' },
  { label: 'Camisa Cinza', value: 'Camisa Cinza', bg: 'bg-zinc-800', text: 'text-zinc-200', border: 'border-zinc-700', icon: '👔' },
  { label: 'Terno Completo', value: 'Terno', bg: 'bg-indigo-950', text: 'text-indigo-200', border: 'border-indigo-800/80', icon: '🤵' }
];

export const CORES_TERNO = [
  'Preto',
  'Azul Marinho',
  'Cinza Escuro / Chumbo',
  'Cinza Claro',
  'Grafite',
  'Azul Petróleo',
  'Marrom / Café'
];

export const CORES_GRAVATA = [
  'Vermelho / Bordô',
  'Azul Marinho',
  'Azul Real / Caneta',
  'Preto',
  'Prata / Cinza',
  'Dourado / Amarelo',
  'Rosa / Rosê',
  'Vinho',
  'Laranja'
];

export const CORES_CAMISA = [
  'Branca',
  'Azul Claro',
  'Preta',
  'Cinza Claro',
  'Rosa Claro'
];

export interface EventoAreaHorario {
  id_area_horario?: number;
  id_evento: number;
  id_area: number;
  horario_turno: number; // 1, 2 ou 3
  hora_inicio: string; // "08:30"
  hora_fim: string; // "10:00"
  criado_em?: string;
  areas?: Area;
}

export interface SaveAreaHorarioDto {
  id_area: number;
  horario_turno: number;
  hora_inicio: string;
  hora_fim: string;
}

export interface TrajeAndLideresConfigDto {
  traje_tipo: TrajeTipo;
  terno_cor_obrigatoria: boolean;
  terno_cor?: string | null;
  gravata_cor_obrigatoria: boolean;
  gravata_cor?: string | null;
  camisa_cor_obrigatoria: boolean;
  camisa_cor?: string | null;
  cracha_obrigatorio: boolean;
  lideres_responsaveis_ids: number[];
}
