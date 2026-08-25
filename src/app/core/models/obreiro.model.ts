export interface Obreiro {
  id_obreiro?: number;
  nome: string;
  apelido?: string | null;
  telefone?: string | null;
  email?: string | null;
  diacono: boolean;
  pulpito: boolean;
  lider: boolean;
  ativo: boolean;
  foto?: string | null;
  data_nascimento?: string | null;
  criado_em?: string;
}

export type CreateObreiroDto = Omit<Obreiro, 'id_obreiro' | 'criado_em'>;
export type UpdateObreiroDto = Partial<CreateObreiroDto>;

