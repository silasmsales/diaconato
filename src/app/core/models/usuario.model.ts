import { User } from '@supabase/supabase-js';

export interface Usuario {
  id?: number;
  user_id: string;
  nome_completo: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  profile: Usuario | null;
  loading: boolean;
}