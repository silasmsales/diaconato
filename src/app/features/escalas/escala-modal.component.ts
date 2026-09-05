import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../core/models/evento.model';
import { Obreiro } from '../../core/models/obreiro.model';
import { Mes, formatMesReferencia } from '../../core/models/mes.model';
import { Bloqueio } from '../../core/models/bloqueio.model';
import { Escala, CreateEscalaDto } from '../../core/models/escala.model';
import { EscalaService } from '../../core/services/escala.service';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';

@Component({
  selector: 'app-escala-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escala-modal.component.html'
})
export class EscalaModalComponent implements OnChanges {
  escalaService = inject(EscalaService);

  @Input() isOpen = false;
  @Input() meses: Mes[] = [];
  @Input() eventos: Evento[] = [];
  @Input() obreiros: Obreiro[] = [];
  @Input() bloqueios: Bloqueio[] = [];
  @Input() escalas: Escala[] = [];
  @Input() defaultMesId: number | null = null;
  @Input() defaultEventoId: number | null = null;
  @Input() loading = false;

  @Output() save = new EventEmitter<CreateEscalaDto[]>();
  @Output() close = new EventEmitter<void>();

  formatMesReferencia = formatMesReferencia;
  TURNO_LABELS = TURNO_LABELS;
  TURNO_COLORS = TURNO_COLORS;

  escalasData = signal<Escala[]>([]);
  obreirosData = signal<Obreiro[]>([]);
  bloqueiosData = signal<Bloqueio[]>([]);
  eventosData = signal<Evento[]>([]);
  mesesData = signal<Mes[]>([]);

  selectedMesId = signal<number | null>(null);
  selectedEventoId = signal<number | null>(null);
  selectedObreiroIds = signal<Set<number>>(new Set());
  selectedCount = computed(() => this.selectedObreiroIds().size);
  searchQuery = signal<string>('');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['escalas']) {
      this.escalasData.set(this.escalas || []);
    }
    if (changes['obreiros']) {
      this.obreirosData.set(this.obreiros || []);
    }
    if (changes['bloqueios']) {
      this.bloqueiosData.set(this.bloqueios || []);
    }
    if (changes['eventos']) {
      this.eventosData.set(this.eventos || []);
    }
    if (changes['meses']) {
      this.mesesData.set(this.meses || []);
    }

    if (changes['isOpen'] && this.isOpen) {
      this.escalasData.set(this.escalas || []);
      this.obreirosData.set(this.obreiros || []);
      this.bloqueiosData.set(this.bloqueios || []);
      this.eventosData.set(this.eventos || []);
      this.mesesData.set(this.meses || []);

      const initialMesId = this.defaultMesId || this.meses[0]?.id_mes || null;
      this.selectedMesId.set(initialMesId);
      
      const initialEventoId = this.defaultEventoId || 
        this.eventos.find(e => !initialMesId || e.id_mes === initialMesId)?.id_evento || 
        this.eventos[0]?.id_evento || 
        null;
      
      this.selectedEventoId.set(initialEventoId);
      this.selectedObreiroIds.set(new Set());
      this.searchQuery.set('');
    } else if (changes['defaultEventoId'] || changes['defaultMesId']) {
      if (this.defaultMesId) this.selectedMesId.set(this.defaultMesId);
      if (this.defaultEventoId) this.selectedEventoId.set(this.defaultEventoId);
      this.selectedObreiroIds.set(new Set());
    }
  }

  filteredEventos = computed(() => {
    const mesId = this.selectedMesId();
    const all = this.eventosData();
    if (!mesId) return all;
    return all
      .filter(e => e.id_mes === mesId)
      .sort((a, b) => {
        const d = (a.data || '').localeCompare(b.data || '');
        if (d !== 0) return d;
        return (a.turno || 0) - (b.turno || 0);
      });
  });

  currentEvento = computed(() => {
    const evId = this.selectedEventoId();
    if (!evId) return null;
    return this.eventosData().find(e => e.id_evento === evId) || null;
  });

  escaladosNesteEvento = computed(() => {
    const evId = this.selectedEventoId();
    if (!evId) return new Set<number>();
    return new Set(
      this.escalasData()
        .filter(e => e.id_evento === evId)
        .map(e => e.id_obreiro)
        .filter((id): id is number => typeof id === 'number')
    );
  });

  escalasPorObreiroNoMes = computed(() => {
    const mesId = this.selectedMesId();
    const countMap = new Map<number, number>();
    if (!mesId) return countMap;

    for (const esc of this.escalasData()) {
      if (esc.id_mes === mesId && typeof esc.id_obreiro === 'number') {
        countMap.set(esc.id_obreiro, (countMap.get(esc.id_obreiro) || 0) + 1);
      }
    }
    return countMap;
  });

  candidatosObreiros = computed(() => {
    const evento = this.currentEvento();
    const query = this.searchQuery().toLowerCase().trim();
    const dataEvento = evento?.data;
    const turnoEvento = evento?.turno;
    const jaEscalados = this.escaladosNesteEvento();
    const allBloqueios = this.bloqueiosData();
    const escalasMesCount = this.escalasPorObreiroNoMes();
    const taxasMap = this.escalaService.taxasPresencaTipoMap();
    const descEvento = (evento?.descricao || '').trim().toLowerCase();

    return this.obreirosData()
      .filter((ob): ob is Obreiro & { id_obreiro: number } => typeof ob.id_obreiro === 'number' && !!ob.ativo)
      .map(ob => {
        const isJaEscalado = jaEscalados.has(ob.id_obreiro);
        const totalEscalasMes = escalasMesCount.get(ob.id_obreiro) || 0;
        let isBloqueado = false;
        let motivoBloqueio = '';

        if (dataEvento) {
          const block = allBloqueios.find(b =>
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

  getInitials(name?: string): string {
    if (!name) return 'OB';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getTurnoLabel(turno?: number): string {
    if (!turno) return 'Culto';
    return TURNO_LABELS[turno] || 'Culto';
  }

  onMesSelect(idMes: any) {
    const mesId = Number(idMes);
    this.selectedMesId.set(mesId);
    const evs = this.eventos.filter(e => e.id_mes === mesId);
    if (evs.length > 0) {
      this.selectedEventoId.set(evs[0].id_evento || null);
    } else {
      this.selectedEventoId.set(null);
    }
    this.selectedObreiroIds.set(new Set());
  }

  onEventoSelect(idEvento: any) {
    this.selectedEventoId.set(Number(idEvento));
    this.selectedObreiroIds.set(new Set());
  }

  isObreiroSelected(idObreiro: number): boolean {
    return this.selectedObreiroIds().has(idObreiro);
  }

  toggleObreiro(idObreiro: number, isJaEscalado: boolean) {
    if (isJaEscalado) return;
    this.selectedObreiroIds.update(prev => {
      const next = new Set(prev);
      if (next.has(idObreiro)) {
        next.delete(idObreiro);
      } else {
        next.add(idObreiro);
      }
      return next;
    });
  }

  selecionarTodosDisponiveis() {
    const disponiveis = this.candidatosObreiros()
      .filter(c => !c.isJaEscalado)
      .map(c => c.id_obreiro);
    this.selectedObreiroIds.set(new Set(disponiveis));
  }

  limparSelecao() {
    this.selectedObreiroIds.set(new Set());
  }

  onSubmit() {
    const mesId = this.selectedMesId();
    const evId = this.selectedEventoId();
    const ids = Array.from(this.selectedObreiroIds());

    if (mesId && evId && ids.length > 0) {
      const dtos: CreateEscalaDto[] = ids.map(id_obreiro => ({
        id_mes: mesId,
        id_evento: evId,
        id_obreiro
      }));
      this.save.emit(dtos);
    }
  }

  onCancel() {
    this.close.emit();
  }
}