import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'obreiros',
    canActivate: [authGuard],
    loadComponent: () => import('./features/obreiros/obreiros-list.component').then(m => m.ObreirosListComponent)
  },
  {
    path: 'eventos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/eventos/eventos-list.component').then(m => m.EventosListComponent)
  },
  {
    path: 'tipos-evento',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tipos-evento/tipos-evento-list.component').then(m => m.TiposEventoListComponent)
  },
  {
    path: 'bloqueios',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bloqueios/bloqueios-list.component').then(m => m.BloqueiosListComponent)
  },
  {
    path: 'meses',
    canActivate: [authGuard],
    loadComponent: () => import('./features/meses/meses-list.component').then(m => m.MesesListComponent)
  },
  {
    path: 'escalas',
    canActivate: [authGuard],
    loadComponent: () => import('./features/escalas/escalas-list.component').then(m => m.EscalasListComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];