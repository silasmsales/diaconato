import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ObreiroAuthService } from '../services/obreiro-auth.service';
import { SupabaseService } from '../services/supabase.service';

/**
 * Guarda que protege as rotas do Portal do Obreiro.
 * Se houver sessão administrativa ativa, redireciona para o painel principal / (não permite ambos simultâneos).
 * Se o obreiro não estiver autenticado, redireciona para /portal/login.
 */
export const obreiroGuard: CanActivateFn = async () => {
  const obreiroAuth = inject(ObreiroAuthService);
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);

  // 1. Se estiver logado na parte Administrativa, bloqueia o portal do obreiro e manda para o painel admin
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    return router.createUrlTree(['/']);
  }

  // 2. Verifica se o obreiro está autenticado
  if (obreiroAuth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/portal/login']);
};

/**
 * Guarda para páginas públicas do portal (como /portal/login).
 * Se já estiver logado como admin, manda para /
 * Se já estiver logado como obreiro, manda para /portal
 */
export const obreiroGuestGuard: CanActivateFn = async () => {
  const obreiroAuth = inject(ObreiroAuthService);
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);

  // Se estiver logado como Admin, manda para /
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    return router.createUrlTree(['/']);
  }

  // Se estiver logado como Obreiro, manda para /portal
  if (obreiroAuth.isAuthenticated()) {
    return router.createUrlTree(['/portal']);
  }

  return true;
};
