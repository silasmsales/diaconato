import { Evento } from './evento.model';
import { Obreiro } from './obreiro.model';
import { Mes } from './mes.model';
import { Local } from './local.model';

export interface Escala {
  id_escala?: number;
  id_evento: number;
  id_obreiro: number;
  id_mes: number;
  id_local?: number | null;
  horario_turno?: number; // 1: 1º Horário, 2: 2º Horário, 3: 3º Horário
  checkin?: boolean | null;
  criado_em?: string;
  eventos?: Evento;
  obreiros?: Obreiro;
  locais?: Local;
  mes?: Mes;
}

export type CreateEscalaDto = Omit<Escala, 'id_escala' | 'criado_em' | 'eventos' | 'obreiros' | 'locais' | 'mes'>;
export type UpdateEscalaDto = Partial<CreateEscalaDto>;
