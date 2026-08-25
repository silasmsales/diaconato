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
  templateUrl: './dashboard.component.html'
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