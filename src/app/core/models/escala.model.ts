import { Evento } from './evento.model';
import { Obreiro } from './obreiro.model';
import { Mes } from './mes.model';

export interface Escala {
  id_escala?: number;
  id_evento: number;
  id_obreiro: number;
  id_mes: number;
  checkin?: boolean | null;
  criado_em?: string;
  eventos?: Evento;
  obreiros?: Obreiro;
  mes?: Mes;
}

export type CreateEscalaDto = Omit<Escala, 'id_escala' | 'criado_em' | 'eventos' | 'obreiros' | 'mes'>;
export type UpdateEscalaDto = Partial<CreateEscalaDto>;

