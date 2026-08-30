import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ObreiroAuthService } from '../services/obreiro-auth.service';

/**
 * Guarda que protege as rotas do Portal do Obreiro.
 * Redireciona para /portal/login se o obreiro não estiver autenticado.
 */
export const obreiroGuard: CanActivateFn = () => {
  const obreiroAuth = inject(ObreiroAuthService);
  const router = inject(Router);

  if (obreiroAuth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/portal/login']);
};

/**
 * Guarda para páginas públicas do portal (como /portal/login).
 * Redireciona para /portal se o obreiro já estiver logado.
 */
export const obreiroGuestGuard: CanActivateFn = () => {
  const obreiroAuth = inject(ObreiroAuthService);
  const router = inject(Router);

  if (obreiroAuth.isAuthenticated()) {
    return router.createUrlTree(['/portal']);
  }

  return true;
};
