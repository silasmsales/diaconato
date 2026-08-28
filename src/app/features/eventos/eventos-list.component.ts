import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../core/services/evento.service';
import { MesService } from '../../core/services/mes.service';
import { AuthService } from '../../core/services/auth.service';
import { Evento, CreateEventoDto } from '../../core/models/evento.model';
import { formatMesReferencia, findCurrentMes } from '../../core/models/mes.model';
import { TURNO_LABELS, TURNO_COLORS, TurnoEnum } from '../../core/models/turno.enum';
import { EventoModalComponent } from './evento-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-eventos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EventoModalComponent, ConfirmModalComponent, RouterLink],
  templateUrl: './eventos-list.component.html'
})
export class EventosListComponent implements OnInit {
  authService = inject(AuthService);
  eventoService = inject(EventoService);
  mesService = inject(MesService);
  route = inject(ActivatedRoute);

  formatMesReferencia = formatMesReferencia;
  eventos = this.eventoService.eventos;
  searchQuery = signal<string>('');
  selectedMesFilter = signal<number>(0);
  currentTurnoFilter = signal<number>(0);
  TurnoEnum = TurnoEnum;

  isModalOpen = false;
  isConfirmOpen = false;
  selectedEvento: Evento | null = null;

  filteredEventos = computed(() => {
    let list = this.eventos();
    const query = this.searchQuery().toLowerCase().trim();
    const mesId = this.selectedMesFilter();
    const turno = this.currentTurnoFilter();

    if (query) {
      list = list.filter(e => e.descricao && e.descricao.toLowerCase().includes(query));
    }

    if (mesId > 0) {
      list = list.filter(e => e.id_mes === mesId);
    }

    if (turno > 0) {
      list = list.filter(e => e.turno === turno);
    }

    return list;
  });

  async ngOnInit() {
    this.eventoService.fetchAll();
    const meses = await this.mesService.fetchAll();
    
    this.route.queryParams.subscribe(params => {
      if (params['mes']) {
        this.selectedMesFilter.set(Number(params['mes']));
      } else if (this.selectedMesFilter() === 0) {
        const cur = findCurrentMes(meses);
        if (cur && cur.id_mes) {
          this.selectedMesFilter.set(cur.id_mes);
        }
      }
    });
  }

  getTurnoLabel(turno: number): string {
    return TURNO_LABELS[turno] || 'Geral';
  }

  getTurnoStyle(turno: number) {
    return TURNO_COLORS[turno] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
  }

  getTotalVagas(e: Evento): number {
    return (e.n_primeiro_horario || 0) + (e.n_segundo_horario || 0) + (e.n_terceiro_horario || 0);
  }

  openCreateModal() {
    this.selectedEvento = null;
    this.isModalOpen = true;
  }

  openEditModal(item: Evento) {
    this.selectedEvento = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEvento = null;
  }

  openDeleteConfirm(item: Evento) {
    this.selectedEvento = item;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.isConfirmOpen = false;
    this.selectedEvento = null;
  }

  async handleSave(dto: CreateEventoDto) {
    if (this.selectedEvento && this.selectedEvento.id_evento) {
      const res = await this.eventoService.update(this.selectedEvento.id_evento, dto);
      if (res) this.closeModal();
    } else {
      const res = await this.eventoService.create(dto);
      if (res) this.closeModal();
    }
  }

  async handleDelete() {
    if (this.selectedEvento && this.selectedEvento.id_evento) {
      const success = await this.eventoService.delete(this.selectedEvento.id_evento);
      if (success) this.closeConfirm();
    }
  }
}