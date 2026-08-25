import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ObreiroService } from '../../core/services/obreiro.service';
import { EventoService } from '../../core/services/evento.service';
import { BloqueioService } from '../../core/services/bloqueio.service';
import { EscalaService } from '../../core/services/escala.service';
import { MesService } from '../../core/services/mes.service';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 animate-fade-in pb-20 md:pb-10">
      <!-- Welcome Header -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div class="relative z-10 space-y-2 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Painel Geral do Diaconato
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Gestão Pastoral & Ministerial
          </h1>
          <p class="text-sm text-slate-300 leading-relaxed">
            Bem-vindo ao sistema de controle e escalas. Organize equipes, visualize disponibilidades e monte escalas de serviço com facilidade.
          </p>

          <div class="flex flex-wrap gap-2.5 pt-2">
            <a 
              routerLink="/escalas" 
              class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5">
              <span>Montar Escala</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a 
              routerLink="/obreiros" 
              class="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all">
              Ver Equipe de Obreiros
            </a>
          </div>
        </div>

        <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none hidden sm:block"></div>
      </div>

      <!-- KPI Metrics Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Obreiros Ativos -->
        <a routerLink="/obreiros" class="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/40 hover:scale-[1.02] transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Obreiros</span>
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-white mt-3">{{ obreiroService.obreiros().length }}</div>
          <div class="text-xs text-emerald-400 mt-1 font-medium">{{ activeObreiros() }} disponíveis</div>
        </a>

        <!-- Diáconos -->
        <a routerLink="/obreiros" class="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/40 hover:scale-[1.02] transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Diáconos</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-white mt-3">{{ diaconosCount() }}</div>
          <div class="text-xs text-amber-400 mt-1 font-medium">Consagrados</div>
        </a>

        <!-- Cultos & Eventos -->
        <a routerLink="/eventos" class="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/40 hover:scale-[1.02] transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Cultos / Eventos</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-white mt-3">{{ eventoService.eventos().length }}</div>
          <div class="text-xs text-slate-400 mt-1 font-medium">Cadastrados</div>
        </a>

        <!-- Bloqueios Ativos -->
        <a routerLink="/bloqueios" class="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/40 hover:scale-[1.02] transition-all group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Bloqueios</span>
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-white mt-3">{{ bloqueioService.bloqueios().length }}</div>
          <div class="text-xs text-rose-400 mt-1 font-medium">Indisponibilidades</div>
        </a>
      </div>

      <!-- Quick Sections: Next Events & Recent Blocks -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Next Events -->
        <div class="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Próximos Cultos & Eventos</span>
            </h3>
            <a routerLink="/eventos" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">Ver todos</a>
          </div>

          <div class="space-y-2.5">
            @for (ev of nextEvents(); track ev.id_evento) {
              <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span 
                      [class]="getTurnoStyle(ev.turno).bg + ' ' + getTurnoStyle(ev.turno).text + ' ' + getTurnoStyle(ev.turno).border"
                      class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border">
                      {{ getTurnoLabel(ev.turno) }}
                    </span>
                    <span class="text-xs text-slate-400 font-medium">{{ ev.data | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <div class="text-sm font-semibold text-white">{{ ev.descricao }}</div>
                </div>

                <a 
                  routerLink="/escalas" 
                  class="px-3 py-1 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition-all">
                  Escalar
                </a>
              </div>
            }

            @if (nextEvents().length === 0) {
              <p class="text-xs text-slate-500 text-center py-4">Nenhum evento futuro cadastrado.</p>
            }
          </div>
        </div>

        <!-- Recent Blocks -->
        <div class="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>Últimos Bloqueios Registrados</span>
            </h3>
            <a routerLink="/bloqueios" class="text-xs text-rose-400 hover:text-rose-300 font-semibold">Ver todos</a>
          </div>

          <div class="space-y-2.5">
            @for (bl of recentBlocks(); track bl.id_bloqueio) {
              <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-white">{{ bl.obreiros?.nome }}</div>
                  <div class="text-[11px] text-rose-400">Data: {{ bl.data | date:'dd/MM/yyyy' }} {{ bl.motivo ? '• ' + bl.motivo : '' }}</div>
                </div>
                <span 
                  [class]="getTurnoStyle(bl.turno).bg + ' ' + getTurnoStyle(bl.turno).text + ' ' + getTurnoStyle(bl.turno).border"
                  class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border">
                  {{ getTurnoLabel(bl.turno) }}
                </span>
              </div>
            }

            @if (recentBlocks().length === 0) {
              <p class="text-xs text-slate-500 text-center py-4">Nenhum bloqueio cadastrado recentemente.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  obreiroService = inject(ObreiroService);
  eventoService = inject(EventoService);
  bloqueioService = inject(BloqueioService);
  escalaService = inject(EscalaService);
  mesService = inject(MesService);

  activeObreiros = computed(() => this.obreiroService.obreiros().filter(o => o.ativo).length);
  diaconosCount = computed(() => this.obreiroService.obreiros().filter(o => o.diacono).length);
  
  nextEvents = computed(() => this.eventoService.eventos().slice(0, 5));
  recentBlocks = computed(() => this.bloqueioService.bloqueios().slice(0, 5));

  ngOnInit() {
    this.obreiroService.fetchAll();
    this.eventoService.fetchAll();
    this.bloqueioService.fetchAll();
    this.escalaService.fetchAll();
    this.mesService.fetchAll();
  }

  getTurnoLabel(turno: number): string {
    return TURNO_LABELS[turno] || 'Geral';
  }

  getTurnoStyle(turno: number) {
    return TURNO_COLORS[turno] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
  }
}