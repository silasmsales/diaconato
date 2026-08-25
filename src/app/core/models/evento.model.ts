import { Mes } from './mes.model';

export interface Evento {
  id_evento?: number;
  id_mes: number;
  data: string;
  descricao?: string | null;
  turno: number; // 1: Manhã, 2: Tarde, 3: Noite
  n_primeiro_horario: number;
  exclusivo_diacono_primeiro: boolean;
  n_segundo_horario: number;
  exclusivo_diacono_segundo: boolean;
  n_terceiro_horario: number;
  exclusivo_diacono_terceiro: boolean;
  pulpito_primeiro: boolean;
  pulpito_segundo: boolean;
  pulpito_terceiro: boolean;
  criado_em?: string;
  mes?: Mes;
}

export type CreateEventoDto = Omit<Evento, 'id_evento' | 'criado_em' | 'mes'>;
export type UpdateEventoDto = Partial<CreateEventoDto>;


