import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { SupabaseService } from '../services/supabase.service';
import { UserRole } from '../models/usuario.model';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return async () => {
    const authService = inject(AuthService);
    const supabase = inject(SupabaseService).client;
    const router = inject(Router);
    const toast = inject(ToastService);

    // Se o perfil ainda não foi carregado, carrega antes de verificar a permissão
    if (!authService.currentProfile()) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await authService.loadUserProfile(data.session.user.id);
      }
    }

    const currentRole = authService.userRole();

    if (allowedRoles.includes(currentRole)) {
      return true;
    }

    toast.warning(
      'Acesso Não Autorizado',
      'Seu perfil de acesso não possui permissão para acessar esta área.'
    );
    return router.createUrlTree(['/']);
  };
}
