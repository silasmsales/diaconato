import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'manager' | 'operator';

export interface Usuario {
  id?: number;
  user_id: string;
  nome_completo: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  profile: Usuario | null;
  loading: boolean;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  operator: 'Operador'
};

export const ROLE_BADGE_STYLES: Record<UserRole, { bg: string; text: string; border: string }> = {
  admin: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30'
  },
  manager: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30'
  },
  operator: {
    bg: 'bg-slate-700/40',
    text: 'text-slate-300',
    border: 'border-slate-600/40'
  }
};