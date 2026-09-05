import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EscalaService } from '../../core/services/escala.service';
import { EventoService } from '../../core/services/evento.service';
import { ObreiroService } from '../../core/services/obreiro.service';
import { MesService } from '../../core/services/mes.service';
import { BloqueioService } from '../../core/services/bloqueio.service';
import { EscalaPdfService } from '../../core/services/escala-pdf.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Escala, CreateEscalaDto } from '../../core/models/escala.model';
import { Obreiro } from '../../core/models/obreiro.model';
import { formatMesReferencia, findCurrentMes } from '../../core/models/mes.model';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';
import { EscalaModalComponent } from './escala-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-escalas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EscalaModalComponent, ConfirmModalComponent],
  templateUrl: './escalas-list.component.html'
})
export class EscalasListComponent implements OnInit {
  authService = inject(AuthService);
  escalaService = inject(EscalaService);
  eventoService = inject(EventoService);
  obreiroService = inject(ObreiroService);
  mesService = inject(MesService);
  bloqueioService = inject(BloqueioService);
  pdfService = inject(EscalaPdfService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);

  formatMesReferencia = formatMesReferencia;
  viewMode: 'eventos' | 'obreiros' = 'eventos';
  
  selectedMesId = signal<number>(0);
  selectedEventoId: number | null = null;
  selectedEscala: Escala | null = null;

  isModalOpen = false;
  isConfirmOpen = false;
  isPdfMenuOpen = false;

  filteredEventos = computed(() => {
    const mesId = this.selectedMesId();
    const all = this.eventoService.eventos();
    const list = mesId === 0 ? all : all.filter(e => e.id_mes === mesId);
    return [...list].sort((a, b) => {
      const d = (a.data || '').localeCompare(b.data || '');
      if (d !== 0) return d;
      return (a.turno || 0) - (b.turno || 0);
    });
  });

  filteredEscalas = computed(() => {
    const mesId = this.selectedMesId();
    const all = this.escalaService.escalas();
    if (mesId === 0) return all;
    return all.filter(e => e.id_mes === mesId);
  });

  // Estado de Substituição de Obreiro
  isSubstituirModalOpen = false;
  selectedEscalaParaSubstituir = signal<Escala | null>(null);
  substitutoSearchQuery = signal<string>('');
  substitutoSelecionadoId = signal<number | null>(null);

  escalasPorObreiroNoMes = computed(() => {
    const esc = this.selectedEscalaParaSubstituir();
    const idMes = esc?.id_mes || this.selectedMesId();
    const todasEscalas = this.escalaService.escalas();
    const countMap = new Map<number, number>();

    todasEscalas
      .filter(e => idMes === 0 || e.id_mes === idMes)
      .forEach(e => {
        if (e.id_obreiro) {
          countMap.set(e.id_obreiro, (countMap.get(e.id_obreiro) || 0) + 1);
        }
      });

    return countMap;
  });

  candidatosSubstitutos = computed(() => {
    const esc = this.selectedEscalaParaSubstituir();
    if (!esc) return [];

    const obreiros = this.obreiroService.obreiros().filter(o => o.ativo);
    const bloqueios = this.bloqueioService.bloqueios();
    const query = this.substitutoSearchQuery().toLowerCase().trim();
    const escalasMesCount = this.escalasPorObreiroNoMes();
    const taxasMap = this.escalaService.taxasPresencaTipoMap();

    // Evento desta escala
    const idEvento = esc.id_evento;
    const evento = esc.eventos || this.eventoService.eventos().find(e => e.id_evento === idEvento);
    const dataEvento = evento?.data;
    const turnoEvento = evento?.turno;
    const descEvento = (evento?.descricao || '').trim().toLowerCase();

    // IDs de obreiros já escalados neste evento (exceto o que está sendo substituído)
    const escaladosNesteEvento = new Set(
      this.escalaService.escalas()
        .filter(e => e.id_evento === idEvento && e.id_obreiro !== esc.id_obreiro)
        .map(e => e.id_obreiro)
    );

    return obreiros
      .filter((ob): ob is Obreiro & { id_obreiro: number } => typeof ob.id_obreiro === 'number')
      .filter(ob => ob.id_obreiro !== esc.id_obreiro) // Não é o próprio obreiro sendo substituído
      .map(ob => {
        const isJaEscalado = escaladosNesteEvento.has(ob.id_obreiro);
        const totalEscalasMes = escalasMesCount.get(ob.id_obreiro) || 0;
        let isBloqueado = false;
        let motivoBloqueio = '';

        if (dataEvento) {
          const block = bloqueios.find(b => 
            b.id_obreiro === ob.id_obreiro && 
            b.data === dataEvento && 
            (b.turno === turnoEvento || b.turno === 4 || b.turno === 0)
          );
          if (block) {
            isBloqueado = true;
            motivoBloqueio = block.motivo || 'Indisponibilidade informada';
          }
        }

        const keyTaxa = `${ob.id_obreiro}_${descEvento}`;
        const stats = taxasMap.get(keyTaxa);
        const taxaPct = stats?.pct ?? null;
        let taxaTooltip = `Sem histórico de presenças apurado em ${evento?.descricao || 'Culto'}`;
        if (stats && (stats.presencas + stats.faltas > 0)) {
          taxaTooltip = `Taxa de presença em ${evento?.descricao || 'Culto'}: ${stats.pct}% (${stats.presencas} ${stats.presencas === 1 ? 'presença' : 'presenças'}, ${stats.faltas} ${stats.faltas === 1 ? 'falta' : 'faltas'})`;
        }

        return {
          ...ob,
          isJaEscalado,
          isBloqueado,
          motivoBloqueio,
          totalEscalasMes,
          taxaPct,
          taxaTooltip
        };
      })
      .filter(ob => {
        if (!query) return true;
        return (
          ob.nome.toLowerCase().includes(query) ||
          (ob.apelido && ob.apelido.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        // 1. Já escalados no evento vão para o final absoluto
        if (a.isJaEscalado !== b.isJaEscalado) {
          return a.isJaEscalado ? 1 : -1;
        }

        // 2. Bloqueados vão para depois dos disponíveis
        if (a.isBloqueado !== b.isBloqueado) {
          return a.isBloqueado ? 1 : -1;
        }

        // 3. Líderes vão para o final da lista (após os demais obreiros disponíveis)
        const aLider = !!a.lider;
        const bLider = !!b.lider;
        if (aLider !== bLider) {
          return aLider ? 1 : -1;
        }

        // 4. Obreiros com MENOS escalas no mês aparecem primeiro
        if (a.totalEscalasMes !== b.totalEscalasMes) {
          return a.totalEscalasMes - b.totalEscalasMes;
        }

        // 5. Desempate por ordem alfabética de nome
        return a.nome.localeCompare(b.nome);
      });
  });

  openSubstituirModal(esc: Escala) {
    this.selectedEscalaParaSubstituir.set(esc);
    this.substitutoSearchQuery.set('');
    this.substitutoSelecionadoId.set(null);
    this.isSubstituirModalOpen = true;
  }

  closeSubstituirModal() {
    this.isSubstituirModalOpen = false;
    this.selectedEscalaParaSubstituir.set(null);
    this.substitutoSelecionadoId.set(null);
    this.substitutoSearchQuery.set('');
  }

  selecionarSubstituto(idObreiro?: number, isJaEscalado?: boolean) {
    if (isJaEscalado || !idObreiro) return;
    if (this.substitutoSelecionadoId() === idObreiro) {
      this.substitutoSelecionadoId.set(null);
    } else {
      this.substitutoSelecionadoId.set(idObreiro);
    }
  }

  async confirmarSubstituicao() {
    const esc = this.selectedEscalaParaSubstituir();
    const novoId = this.substitutoSelecionadoId();
    if (!esc || !esc.id_escala || !novoId) return;

    const res = await this.escalaService.substituirObreiro(esc.id_escala, novoId);
    if (res) {
      this.closeSubstituirModal();
    }
  }

  // Estado de Colapso para Eventos e Obreiros
  expandedEventos = signal<Set<number>>(new Set<number>());
  expandedObreiros = signal<Set<number>>(new Set<number>());

  isEventoExpanded(idEvento?: number): boolean {
    if (!idEvento) return false;
    return this.expandedEventos().has(idEvento);
  }

  toggleEventoExpand(idEvento?: number) {
    if (!idEvento) return;
    this.expandedEventos.update(prev => {
      const next = new Set(prev);
      if (next.has(idEvento)) {
        next.delete(idEvento);
      } else {
        next.add(idEvento);
      }
      return next;
    });
  }

  expandAllEventos() {
    const allIds = this.filteredEventos()
      .map(e => e.id_evento)
      .filter((id): id is number => typeof id === 'number');
    this.expandedEventos.set(new Set(allIds));
  }

  collapseAllEventos() {
    this.expandedEventos.set(new Set());
  }

  isObreiroExpanded(idObreiro?: number): boolean {
    if (!idObreiro) return false;
    return this.expandedObreiros().has(idObreiro);
  }

  toggleObreiroExpand(idObreiro?: number) {
    if (!idObreiro) return;
    this.expandedObreiros.update(prev => {
      const next = new Set(prev);
      if (next.has(idObreiro)) {
        next.delete(idObreiro);
      } else {
        next.add(idObreiro);
      }
      return next;
    });
  }

  expandAllObreiros() {
    const allIds = this.obreiroService.obreiros()
      .map(o => o.id_obreiro)
      .filter((id): id is number => typeof id === 'number');
    this.expandedObreiros.set(new Set(allIds));
  }

  collapseAllObreiros() {
    this.expandedObreiros.set(new Set());
  }

  async onMesChange(mesId: number) {
    const id = Number(mesId);
    this.selectedMesId.set(id);
    if (id > 0) {
      await this.escalaService.fetchByMes(id);
    } else {
      await this.escalaService.fetchAll();
    }
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) {
      this.expandAllEventos();
    }
    this.scrollToCurrentOrNextEvento();
  }

  async ngOnInit() {
    let initialMesId = 0;
    this.route.queryParams.subscribe(params => {
      if (params['mes']) {
        const id = Number(params['mes']);
        if (!isNaN(id)) {
          initialMesId = id;
          this.selectedMesId.set(id);
        }
      }
    });

    const [meses] = await Promise.all([
      this.mesService.fetchAll(),
      this.eventoService.fetchAll(),
      this.obreiroService.fetchAll(),
      this.bloqueioService.fetchAll(),
      this.escalaService.fetchTaxasPresencaPorTipoEvento()
    ]);

    if (this.selectedMesId() === 0) {
      const cur = findCurrentMes(meses);
      if (cur && cur.id_mes) {
        this.selectedMesId.set(cur.id_mes);
      }
    }

    const mesIdToLoad = this.selectedMesId();
    if (mesIdToLoad > 0) {
      await this.escalaService.fetchByMes(mesIdToLoad);
    } else {
      await this.escalaService.fetchAll();
    }

    // No desktop (>= 768px), inicia expandido; no mobile (< 768px), inicia colapsado por padrão
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile) {
      this.expandAllEventos();
      this.expandAllObreiros();
    } else {
      this.collapseAllEventos();
      this.collapseAllObreiros();
    }

    // Scroll para o culto de hoje ou o próximo culto cadastrado caso seja o mês atual
    this.scrollToCurrentOrNextEvento();
  }

  scrollToCurrentOrNextEvento() {
    const selectedMes = this.mesService.meses().find(m => m.id_mes === this.selectedMesId());
    if (!selectedMes) return;

    const now = new Date();
    const isCurrentMonth = 
      selectedMes.ano_referencia === now.getFullYear() && 
      selectedMes.mes_referencia === (now.getMonth() + 1);

    if (!isCurrentMonth) return;

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const eventos = this.filteredEventos();
    let targetEvento = eventos.find(e => e.data === todayStr);
    if (!targetEvento) {
      targetEvento = eventos.find(e => e.data > todayStr);
    }

    if (targetEvento && targetEvento.id_evento) {
      setTimeout(() => {
        const el = document.getElementById(`evento-card-${targetEvento!.id_evento}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
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

  exportarPdfPorEventos() {
    this.isPdfMenuOpen = false;
    const mesId = this.selectedMesId();
    const mes = this.mesService.meses().find(m => Number(m.id_mes) === Number(mesId));
    if (!mes) {
      this.toast.warning('Selecione um mês', 'Por favor, selecione um mês de referência para exportar o PDF.');
      return;
    }

    this.pdfService.gerarPdfPorEventos(
      mes,
      this.eventoService.eventos(),
      this.escalaService.escalas()
    );
  }

  exportarPdfPorObreiros() {
    this.isPdfMenuOpen = false;
    const mesId = this.selectedMesId();
    const mes = this.mesService.meses().find(m => Number(m.id_mes) === Number(mesId));
    if (!mes) {
      this.toast.warning('Selecione um mês', 'Por favor, selecione um mês de referência para exportar o PDF.');
      return;
    }

    this.pdfService.gerarPdfPorObreiros(
      mes,
      this.eventoService.eventos(),
      this.escalaService.escalas(),
      this.obreiroService.obreiros()
    );
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

  async handleSave(dtos: CreateEscalaDto[] | CreateEscalaDto) {
    const list = Array.isArray(dtos) ? dtos : [dtos];
    if (list.length === 1) {
      const res = await this.escalaService.addObreiroToEvento(list[0]);
      if (res) this.closeModal();
    } else if (list.length > 1) {
      const res = await this.escalaService.addMultipleObreirosToEvento(list);
      if (res.length > 0) this.closeModal();
    }
  }

  async handleDelete() {
    if (this.selectedEscala && this.selectedEscala.id_escala) {
      const success = await this.escalaService.removeObreiroFromEvento(this.selectedEscala.id_escala);
      if (success) this.closeConfirm();
    }
  }
}