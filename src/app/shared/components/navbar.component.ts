import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-3">
          <a routerLink="/" class="flex items-center gap-2.5 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div class="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m-7-7l7-7 7 7" />
                  <circle cx="12" cy="12" r="9" stroke-width="2" />
                </svg>
              </div>
            </div>
            <div>
              <span class="text-base font-bold tracking-tight text-white block">Diaconato</span>
              <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider block -mt-1">Gestão & Escalas</span>
            </div>
          </a>
        </div>

        <!-- Desktop Navigation Links (Only if logged in) -->
        @if (authService.isAuthenticated()) {
          <nav class="hidden md:flex items-center gap-1">
            <a 
              routerLink="/" 
              routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all">
              Dashboard
            </a>
            <a 
              routerLink="/obreiros" 
              routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all">
              Obreiros
            </a>
            <a 
              routerLink="/eventos" 
              routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all">
              Cultos & Eventos
            </a>
            <a 
              routerLink="/tipos-evento" 
              routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all">
              Modelos
            </a>
            <a 
              routerLink="/bloqueios" 
              routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all">
              Bloqueios
            </a>
            <a 
              routerLink="/escalas" 
              routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all">
              Escalas
            </a>
            <a 
              routerLink="/meses" 
              routerLinkActive="bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all">
              Meses
            </a>
          </nav>
        }

        <!-- Right Side: User Profile & Actions -->
        <div class="flex items-center gap-3">
          @if (authService.isAuthenticated()) {
            <div class="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              <div class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                {{ getUserInitial() }}
              </div>
              <span class="text-xs text-slate-200 font-medium max-w-[130px] truncate">
                {{ authService.currentProfile()?.nome_completo || authService.currentUser()?.email }}
              </span>
            </div>

            <button 
              (click)="authService.logout()"
              class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all flex items-center gap-1.5"
              title="Encerrar Sessão">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden sm:inline">Sair</span>
            </button>
          } @else {
            <a 
              routerLink="/login" 
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all">
              Entrar
            </a>
          }
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);

  getUserInitial(): string {
    const name = this.authService.currentProfile()?.nome_completo || this.authService.currentUser()?.email || 'U';
    return name.charAt(0).toUpperCase();
  }
}