import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BloqueioService } from '../../core/services/bloqueio.service';
import { ObreiroService } from '../../core/services/obreiro.service';
import { MesService } from '../../core/services/mes.service';
import { Bloqueio, CreateBloqueioDto } from '../../core/models/bloqueio.model';
import { Obreiro } from '../../core/models/obreiro.model';
import { formatMesReferencia, findCurrentMes } from '../../core/models/mes.model';
import { TURNO_LABELS, TURNO_COLORS, TurnoEnum } from '../../core/models/turno.enum';
import { BloqueioModalComponent, BloqueioBatchPayload } from './bloqueio-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

export interface ObreiroBloqueioGroup {
  obreiro: Obreiro | { id_obreiro: number; nome: string; apelido?: string; diacono?: boolean };
  bloqueios: Bloqueio[];
}

@Component({
  selector: 'app-bloqueios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BloqueioModalComponent, ConfirmModalComponent],
  templateUrl: './bloqueios-list.component.html'
})
export class BloqueiosListComponent implements OnInit {
  bloqueioService = inject(BloqueioService);
  obreiroService = inject(ObreiroService);
  mesService = inject(MesService);

  formatMesReferencia = formatMesReferencia;
  Number = Number;
  viewMode: 'obreiros' | 'individual' = 'obreiros';

  bloqueios = this.bloqueioService.bloqueios;
  searchQuery = signal<string>('');
  selectedObreiroFilter = signal<number>(0);
  selectedMesFilter = signal<string>(''); // e.g. '2026-09' or ''
  TurnoEnum = TurnoEnum;

  isModalOpen = false;
  isConfirmOpen = false;
  selectedBloqueio: Bloqueio | null = null;
  selectedGroupToDelete: ObreiroBloqueioGroup | null = null;
  defaultObreiroId: number | null = null;

  filteredBloqueios = computed(() => {
    let list = this.bloqueios();
    const query = this.searchQuery().toLowerCase().trim();
    const obreiroId = this.selectedObreiroFilter();
    const mesKey = this.selectedMesFilter(); // 'YYYY-MM'

    // Filter by Month
    if (mesKey) {
      list = list.filter(b => b.data && b.data.startsWith(mesKey));
    }

    // Filter by Obreiro
    if (obreiroId > 0) {
      list = list.filter(b => b.id_obreiro === obreiroId);
    }

    // Filter by search query
    if (query) {
      list = list.filter(b => 
        (b.obreiros?.nome && b.obreiros.nome.toLowerCase().includes(query)) ||
        (b.motivo && b.motivo.toLowerCase().includes(query))
      );
    }

    return list;
  });

  groupedByObreiro = computed(() => {
    const list = this.filteredBloqueios();
    const map = new Map<number, ObreiroBloqueioGroup>();

    for (const b of list) {
      const obId = b.id_obreiro;
      if (!map.has(obId)) {
        const obreiro = b.obreiros || this.obreiroService.obreiros().find(o => o.id_obreiro === obId) || {
          id_obreiro: obId,
          nome: `Obreiro #${obId}`
        };
        map.set(obId, {
          obreiro,
          bloqueios: []
        });
      }
      map.get(obId)!.bloqueios.push(b);
    }

    return Array.from(map.values()).sort((a, b) => 
      (a.obreiro.nome || '').localeCompare(b.obreiro.nome || '')
    );
  });

  async ngOnInit() {
    this.bloqueioService.fetchAll();
    this.obreiroService.fetchAll();
    const meses = await this.mesService.fetchAll();
    if (!this.selectedMesFilter()) {
      const cur = findCurrentMes(meses);
      if (cur) {
        this.selectedMesFilter.set(this.formatMesKey(cur));
      }
    }
  }

  formatMesKey(m: any): string {
    return `${m.ano_referencia}-${String(m.mes_referencia).padStart(2, '0')}`;
  }

  getTurnoLabel(turno: number): string {
    return TURNO_LABELS[turno] || 'Geral';
  }

  getTurnoStyle(turno: number) {
    return TURNO_COLORS[turno] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
  }

  getInitials(name?: string): string {
    if (!name) return 'OB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  openCreateModal(preselectedObreiroId?: number) {
    this.selectedBloqueio = null;
    this.selectedGroupToDelete = null;
    this.defaultObreiroId = preselectedObreiroId || null;
    this.isModalOpen = true;
  }

  openEditModal(item: Bloqueio) {
    this.selectedBloqueio = item;
    this.selectedGroupToDelete = null;
    this.defaultObreiroId = null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedBloqueio = null;
    this.selectedGroupToDelete = null;
    this.defaultObreiroId = null;
  }

  openDeleteConfirm(item: Bloqueio) {
    this.selectedBloqueio = item;
    this.selectedGroupToDelete = null;
    this.isConfirmOpen = true;
  }

  openDeleteGroupConfirm(group: ObreiroBloqueioGroup) {
    this.selectedBloqueio = null;
    this.selectedGroupToDelete = group;
    this.isConfirmOpen = true;
  }

  getDeleteConfirmTitle(): string {
    if (this.selectedGroupToDelete) {
      return `Excluir Bloqueios de ${this.selectedGroupToDelete.obreiro.nome}`;
    }
    return 'Excluir Bloqueio';
  }

  getDeleteConfirmMessage(): string {
    if (this.selectedGroupToDelete) {
      const count = this.selectedGroupToDelete.bloqueios.length;
      return `Tem certeza que deseja remover todos os ${count} bloqueio(s) listados de ${this.selectedGroupToDelete.obreiro.nome} de acordo com os filtros atuais?`;
    }
    return 'Tem certeza que deseja remover este bloqueio? O obreiro voltará a figurar como disponível nesta data.';
  }

  closeConfirm() {
    this.isConfirmOpen = false;
    this.selectedBloqueio = null;
    this.selectedGroupToDelete = null;
  }

  async handleSave(payload: BloqueioBatchPayload) {
    if (this.selectedBloqueio && this.selectedBloqueio.id_bloqueio) {
      // Editing single record
      const res = await this.bloqueioService.update(this.selectedBloqueio.id_bloqueio, {
        id_obreiro: payload.id_obreiro,
        data: payload.datas[0],
        turno: payload.turnos[0] || TurnoEnum.MANHA,
        motivo: payload.motivo
      });
      if (res) this.closeModal();
    } else {
      // Generate combination of all dates and all selected turnos
      const dtos: CreateBloqueioDto[] = [];
      for (const dataStr of payload.datas) {
        for (const turnoNum of payload.turnos) {
          dtos.push({
            id_obreiro: payload.id_obreiro,
            data: dataStr,
            turno: turnoNum,
            motivo: payload.motivo
          });
        }
      }

      const res = await this.bloqueioService.createBatch(dtos);
      if (res) this.closeModal();
    }
  }

  async handleDelete() {
    if (this.selectedGroupToDelete) {
      const ids = this.selectedGroupToDelete.bloqueios
        .map(b => b.id_bloqueio)
        .filter(id => typeof id === 'number') as number[];
      const success = await this.bloqueioService.deleteBatch(ids);
      if (success) this.closeConfirm();
    } else if (this.selectedBloqueio && this.selectedBloqueio.id_bloqueio) {
      const success = await this.bloqueioService.delete(this.selectedBloqueio.id_bloqueio);
      if (success) this.closeConfirm();
    }
  }
}