import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ObreiroService } from '../../core/services/obreiro.service';
import { EventoService } from '../../core/services/evento.service';
import { BloqueioService } from '../../core/services/bloqueio.service';
import { EscalaService } from '../../core/services/escala.service';
import { MesService } from '../../core/services/mes.service';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';
import { findCurrentMes, formatMesReferencia } from '../../core/models/mes.model';

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

  formatMesReferencia = formatMesReferencia;

  // Mês Atual de Referência
  currentMes = computed(() => findCurrentMes(this.mesService.meses()));
  currentMesLabel = computed(() => {
    const cur = this.currentMes();
    return cur ? formatMesReferencia(cur) : 'Mês Atual';
  });

  // Obreiros
  activeObreiros = computed(() => this.obreiroService.obreiros().filter(o => o.ativo).length);
  diaconosCount = computed(() => this.obreiroService.obreiros().filter(o => o.diacono).length);
  
  // Eventos do Mês Atual
  currentMonthEvents = computed(() => {
    const cur = this.currentMes();
    const all = this.eventoService.eventos();
    if (!cur || !cur.id_mes) return all;
    return all.filter(e => e.id_mes === cur.id_mes);
  });

  // Bloqueios do Mês Atual
  currentMonthBlocks = computed(() => {
    const cur = this.currentMes();
    const all = this.bloqueioService.bloqueios();
    if (!cur) return all;
    return all.filter(b => {
      if (!b.data) return false;
      const parts = b.data.split('-');
      if (parts.length < 2) return false;
      const ano = Number(parts[0]);
      const mes = Number(parts[1]);
      return ano === Number(cur.ano_referencia) && mes === Number(cur.mes_referencia);
    });
  });

  // Escalas do Mês Atual
  currentMonthEscalas = computed(() => {
    const cur = this.currentMes();
    const all = this.escalaService.escalas();
    if (!cur || !cur.id_mes) return all;
    return all.filter(e => e.id_mes === cur.id_mes);
  });

  // Vagas Previstas e Taxa de Preenchimento da Escala no Mês Atual
  totalVagasMes = computed(() => {
    return this.currentMonthEvents().reduce((acc, ev) => {
      const n1 = ev.n_primeiro_horario || 0;
      const n2 = ev.n_segundo_horario || 0;
      const n3 = ev.n_terceiro_horario || 0;
      return acc + n1 + n2 + n3;
    }, 0);
  });

  taxaPreenchimentoEscala = computed(() => {
    const vagas = this.totalVagasMes();
    const escalados = this.currentMonthEscalas().length;
    if (vagas === 0) return 0;
    return Math.min(100, Math.round((escalados / vagas) * 100));
  });

  // Data de hoje no formato YYYY-MM-DD local
  private getTodayString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isToday(dateStr: string): boolean {
    return dateStr === this.getTodayString();
  }

  // Próximos Eventos a partir da data atual (Hoje em diante)
  nextEvents = computed(() => {
    const today = this.getTodayString();
    const all = this.eventoService.eventos();
    
    // 1. Filtrar eventos a partir de hoje (data atual em diante)
    let upcoming = all.filter(e => e.data >= today);
    
    // Ordenar cronologicamente
    upcoming.sort((a, b) => {
      const cmp = a.data.localeCompare(b.data);
      if (cmp !== 0) return cmp;
      return a.turno - b.turno;
    });

    // Se houver eventos futuros, retorna os próximos 6
    if (upcoming.length > 0) {
      return upcoming.slice(0, 6);
    }

    // Fallback: se todos os eventos forem anteriores a hoje (ex: base histórica), exibe os últimos do mês
    const curMonthEvents = [...this.currentMonthEvents()];
    curMonthEvents.sort((a, b) => {
      const cmp = b.data.localeCompare(a.data);
      if (cmp !== 0) return cmp;
      return b.turno - a.turno;
    });
    return curMonthEvents.slice(0, 6).reverse();
  });

  // Próximos Bloqueios a partir de hoje (ou recentes do mês)
  recentBlocks = computed(() => {
    const today = this.getTodayString();
    const all = this.bloqueioService.bloqueios();
    
    let upcoming = all.filter(b => b.data >= today);
    upcoming.sort((a, b) => a.data.localeCompare(b.data));

    if (upcoming.length > 0) {
      return upcoming.slice(0, 6);
    }

    const curMonthBlocks = [...this.currentMonthBlocks()];
    curMonthBlocks.sort((a, b) => b.data.localeCompare(a.data));
    return curMonthBlocks.slice(0, 6).reverse();
  });

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