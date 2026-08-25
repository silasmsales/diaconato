import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EscalaService } from '../../core/services/escala.service';
import { EventoService } from '../../core/services/evento.service';
import { ObreiroService } from '../../core/services/obreiro.service';
import { MesService } from '../../core/services/mes.service';
import { BloqueioService } from '../../core/services/bloqueio.service';
import { Escala, CreateEscalaDto } from '../../core/models/escala.model';
import { formatMesReferencia } from '../../core/models/mes.model';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';
import { EscalaModalComponent } from './escala-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-escalas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EscalaModalComponent, ConfirmModalComponent],
  templateUrl: './escalas-list.component.html'
})
export class EscalasListComponent implements OnInit {
  escalaService = inject(EscalaService);
  eventoService = inject(EventoService);
  obreiroService = inject(ObreiroService);
  mesService = inject(MesService);
  bloqueioService = inject(BloqueioService);
  route = inject(ActivatedRoute);

  formatMesReferencia = formatMesReferencia;
  viewMode: 'eventos' | 'obreiros' = 'eventos';
  
  selectedMesId = signal<number>(0);
  selectedEventoId: number | null = null;
  selectedEscala: Escala | null = null;

  isModalOpen = false;
  isConfirmOpen = false;

  filteredEventos = computed(() => {
    const mesId = this.selectedMesId();
    const all = this.eventoService.eventos();
    if (mesId === 0) return all;
    return all.filter(e => e.id_mes === mesId);
  });

  filteredEscalas = computed(() => {
    const mesId = this.selectedMesId();
    const all = this.escalaService.escalas();
    if (mesId === 0) return all;
    return all.filter(e => e.id_mes === mesId);
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mes']) {
        const id = Number(params['mes']);
        if (!isNaN(id)) {
          this.selectedMesId.set(id);
        }
      }
    });

    this.mesService.fetchAll();
    this.eventoService.fetchAll();
    this.obreiroService.fetchAll();
    this.bloqueioService.fetchAll();
    this.escalaService.fetchAll();
  }

  onMesChange(mesId: number) {
    this.selectedMesId.set(mesId);
  }

  getEscaladosByEvent(idEvento: number): Escala[] {
    return this.filteredEscalas().filter(e => e.id_evento === idEvento);
  }

  getEscalasByObreiro(idObreiro: number): Escala[] {
    return this.filteredEscalas().filter(e => e.id_obreiro === idObreiro);
  }

  getCheckinStats(idEvento: number) {
    const escalados = this.getEscaladosByEvent(idEvento);
    const presentes = escalados.filter(e => e.checkin === true).length;
    const faltas = escalados.filter(e => e.checkin === false).length;
    const pendentes = escalados.filter(e => e.checkin === null || e.checkin === undefined).length;
    return { presentes, faltas, pendentes };
  }

  async toggleCheckin(escala: Escala, newStatus: boolean | null) {
    if (!escala.id_escala) return;
    await this.escalaService.updateCheckin(escala.id_escala, newStatus);
  }

  openAddModal(eventoId?: number, mesId?: number) {
    this.selectedEventoId = eventoId || null;
    if (mesId && this.selectedMesId() === 0) {
      this.selectedMesId.set(mesId);
    }
    this.isModalOpen = true;
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

  closeModal() {
    this.isModalOpen = false;
    this.selectedEventoId = null;
  }

  confirmDeleteEscala(item: Escala) {
    this.selectedEscala = item;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.isConfirmOpen = false;
    this.selectedEscala = null;
  }

  async handleSave(dto: CreateEscalaDto) {
    const res = await this.escalaService.addObreiroToEvento(dto);
    if (res) this.closeModal();
  }

  async handleDelete() {
    if (this.selectedEscala && this.selectedEscala.id_escala) {
      const success = await this.escalaService.removeObreiroFromEvento(this.selectedEscala.id_escala);
      if (success) this.closeConfirm();
    }
  }
}