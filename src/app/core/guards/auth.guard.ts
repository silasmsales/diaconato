import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);

  // Se o estado ainda está carregando, checa a sessão direto do Supabase
  const { data } = await supabase.auth.getSession();
  const hasUser = !!data.session?.user;

  if (hasUser) {
    if (!authService.currentUser()) {
      authService.currentUser.set(data.session!.user);
      authService.session.set(data.session);
      authService.loadUserProfile(data.session!.user.id);
    }
    return true;
  }

  // Redireciona para o login caso não esteja autenticado
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const guestGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService).client;
  const router = inject(Router);

  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    return router.createUrlTree(['/']);
  }
  return true;
};