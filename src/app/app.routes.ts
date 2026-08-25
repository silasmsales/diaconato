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
    path: 'eventos/gerador',
    canActivate: [authGuard],
    loadComponent: () => import('./features/eventos/evento-gerador.component').then(m => m.EventoGeradorComponent)
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
    path: 'escalas/gerador',
    canActivate: [authGuard],
    loadComponent: () => import('./features/escalas/escala-gerador.component').then(m => m.EscalaGeradorComponent)
  },
  {
    path: 'escalas',
    canActivate: [authGuard],
    loadComponent: () => import('./features/escalas/escalas-list.component').then(m => m.EscalasListComponent)
  },
  {
    path: 'relatorios',
    canActivate: [authGuard],
    loadComponent: () => import('./features/relatorios/relatorios.component').then(m => m.RelatoriosComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];