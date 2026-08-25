import { Obreiro } from './obreiro.model';

export interface Bloqueio {
  id_bloqueio?: number;
  data: string;
  turno: number; // 1: Manhã, 2: Tarde, 3: Noite, 4: Integral
  id_obreiro: number;
  motivo?: string | null;
  criado_em?: string;
  obreiros?: Obreiro; // joined relationship
}

export type CreateBloqueioDto = Omit<Bloqueio, 'id_bloqueio' | 'criado_em' | 'obreiros'>;
export type UpdateBloqueioDto = Partial<CreateBloqueioDto>;
