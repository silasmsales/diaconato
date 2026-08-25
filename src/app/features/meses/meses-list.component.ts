import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesService } from '../../core/services/mes.service';
import { Mes, CreateMesDto, formatMesReferencia, MESES_NOMES } from '../../core/models/mes.model';
import { MesModalComponent } from './mes-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meses-list',
  standalone: true,
  imports: [CommonModule, MesModalComponent, ConfirmModalComponent, RouterLink],
  template: `
    <div class="space-y-6 animate-fade-in pb-20 md:pb-10 max-w-4xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Meses de Referência</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              {{ meses().length }} cadastrados
            </span>
          </h1>
          <p class="text-sm text-slate-400 mt-1">Períodos mensais para organização das escalas de serviço</p>
        </div>

        <button 
          (click)="openCreateModal()"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Novo Mês</span>
        </button>
      </div>

      @if (mesService.loading() && meses().length === 0) {
        <div class="space-y-3">
          @for (i of [1,2,3]; track i) {
            <div class="glass-card rounded-2xl p-4 border border-slate-800 animate-pulse h-16"></div>
          }
        </div>
      }

      @if (!mesService.loading() && meses().length === 0) {
        <div class="glass-panel rounded-3xl p-12 text-center border border-slate-800/80 space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Nenhum mês de referência</h3>
            <p class="text-xs text-slate-400 mt-1">Crie o primeiro mês para vincular e gerar as escalas.</p>
          </div>
          <button 
            (click)="openCreateModal()"
            class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all">
            Cadastrar Mês
          </button>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        @for (item of meses(); track item.id_mes) {
          <div class="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex items-center justify-between">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-extrabold text-sm">
                {{ formatNumber(item.mes_referencia) }}
              </div>
              <div>
                <h3 class="text-base font-bold text-white">{{ formatMesReferencia(item) }}</h3>
                <span class="text-xs text-slate-400">Ano: {{ item.ano_referencia }} • Mês: {{ getNomeMes(item.mes_referencia) }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <a 
                [routerLink]="['/escalas']" 
                [queryParams]="{ mes: item.id_mes }"
                class="px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                Ver Escala
              </a>
              <button 
                (click)="openEditModal(item)"
                class="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all">
                Editar
              </button>
              <button 
                (click)="openDeleteConfirm(item)"
                class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        }
      </div>

      <app-mes-modal 
        [isOpen]="isModalOpen"
        [mes]="selectedMes"
        [loading]="mesService.loading()"
        (save)="handleSave($event)"
        (close)="closeModal()"
      />

      <app-confirm-modal 
        [isOpen]="isConfirmOpen"
        title="Excluir Mês de Referência"
        [message]="'Tem certeza que deseja excluir ' + formatMesReferencia(selectedMes) + '? As escalas vinculadas serão removidas.'"
        (confirm)="handleDelete()"
        (cancel)="closeConfirm()"
      />
    </div>
  `
})
export class MesesListComponent implements OnInit {
  mesService = inject(MesService);
  meses = this.mesService.meses;

  formatMesReferencia = formatMesReferencia;

  isModalOpen = false;
  isConfirmOpen = false;
  selectedMes: Mes | null = null;

  ngOnInit() {
    this.mesService.fetchAll();
  }

  formatNumber(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  getNomeMes(m: number): string {
    return MESES_NOMES[m] || 'Mês ' + m;
  }

  openCreateModal() {
    this.selectedMes = null;
    this.isModalOpen = true;
  }

  openEditModal(item: Mes) {
    this.selectedMes = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedMes = null;
  }

  openDeleteConfirm(item: Mes) {
    this.selectedMes = item;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.isConfirmOpen = false;
    this.selectedMes = null;
  }

  async handleSave(dto: CreateMesDto) {
    if (this.selectedMes && this.selectedMes.id_mes) {
      const res = await this.mesService.update(this.selectedMes.id_mes, dto);
      if (res) this.closeModal();
    } else {
      const res = await this.mesService.create(dto);
      if (res) this.closeModal();
    }
  }

  async handleDelete() {
    if (this.selectedMes && this.selectedMes.id_mes) {
      const success = await this.mesService.delete(this.selectedMes.id_mes);
      if (success) this.closeConfirm();
    }
  }
}