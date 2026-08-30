import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ObreiroAuthService } from '../../core/services/obreiro-auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Evento } from '../../core/models/evento.model';
import { Local } from '../../core/models/local.model';

export interface EscalaDetalhadaPortal {
  id_escala: number;
  data: string;
  checkin?: boolean | null;
  horario_turno?: number;
  evento: Evento;
  local?: Local;
  isFuturo: boolean;
}

@Component({
  selector: 'app-portal-escalas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-escalas.component.html'
})
export class PortalEscalasComponent implements OnInit {
  public obreiroAuth = inject(ObreiroAuthService);
  private supabase = inject(SupabaseService).client;

  loading = signal<boolean>(true);
  escalas = signal<EscalaDetalhadaPortal[]>([]);
  areaHorarios = signal<{ id_evento: number; id_area: number; horario_turno: number; hora_inicio: string; hora_fim: string }[]>([]);
  obreirosLista = signal<{ id_obreiro: number; nome: string }[]>([]);
  activeTab = signal<'FUTURAS' | 'HISTORICO' | 'TODAS'>('FUTURAS');
  filtroMesAno = signal<string>('TODOS');

  // Meses únicos disponíveis nas escalas
  mesesDisponiveis = computed(() => {
    const set = new Set<string>();
    this.escalas().forEach(e => {
      if (e.data) {
        const ym = e.data.substring(0, 7); // 'YYYY-MM'
        set.add(ym);
      }
    });
    return Array.from(set).sort().reverse();
  });

  // Lista Filtrada por Tab e Mês
  escalasFiltradas = computed(() => {
    const list = this.escalas();
    const tab = this.activeTab();
    const mes = this.filtroMesAno();

    return list.filter(e => {
      if (tab === 'FUTURAS' && !e.isFuturo) return false;
      if (tab === 'HISTORICO' && e.isFuturo) return false;
      if (mes !== 'TODOS' && !e.data.startsWith(mes)) return false;
      return true;
    });
  });

  totalFuturas = computed(() => this.escalas().filter(e => e.isFuturo).length);
  totalHistorico = computed(() => this.escalas().filter(e => !e.isFuturo).length);

  ngOnInit(): void {
    this.carregarEscalas();
  }

  async carregarEscalas(): Promise<void> {
    const obreiro = this.obreiroAuth.currentObreiro();
    if (!obreiro?.id_obreiro) return;

    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('escala')
        .select(`
          id_escala,
          checkin,
          horario_turno,
          eventos (*, mes (*)),
          locais (*, areas (*))
        `)
        .eq('id_obreiro', obreiro.id_obreiro);

      if (!error && data) {
        const hojeStr = new Date().toISOString().split('T')[0];
        const rawList = (data || []) as any[];
        const mapped: EscalaDetalhadaPortal[] = rawList
          .filter(e => !!e.eventos)
          .map(e => {
            const ev = Array.isArray(e.eventos) ? e.eventos[0] : e.eventos;
            const loc = Array.isArray(e.locais) ? e.locais[0] : e.locais;
            if (loc && Array.isArray(loc.areas)) {
              loc.areas = loc.areas[0];
            }
            const evData = ev?.data || '';
            return {
              id_escala: e.id_escala,
              data: evData,
              checkin: e.checkin,
              horario_turno: e.horario_turno,
              evento: ev as Evento,
              local: loc as Local | undefined,
              isFuturo: evData >= hojeStr
            };
          })
          .sort((a, b) => a.data.localeCompare(b.data));

        this.escalas.set(mapped);
      }

      // Horários por setor
      const { data: horData } = await this.supabase
        .from('evento_area_horarios')
        .select('id_evento, id_area, horario_turno, hora_inicio, hora_fim');

      if (horData) {
        this.areaHorarios.set(horData);
      }

      // Obreiros para líderes
      const { data: obData } = await this.supabase
        .from('obreiros')
        .select('id_obreiro, nome');

      if (obData) {
        this.obreirosLista.set(obData);
      }
    } catch (e) {
      console.error('Erro ao carregar escalas do portal:', e);
    } finally {
      this.loading.set(false);
    }
  }

  getHorarioAtuacao(idEvento?: number | string, idArea?: number | string, horarioTurno?: number | string): string | null {
    if (!idEvento || !idArea) return null;
    const nEvento = Number(idEvento);
    const nArea = Number(idArea);
    const nTurno = Number(horarioTurno || 1);

    const h = this.areaHorarios().find(
      item => Number(item.id_evento) === nEvento && Number(item.id_area) === nArea && Number(item.horario_turno) === nTurno
    );
    if (h && h.hora_inicio && h.hora_fim) {
      return `${h.hora_inicio.substring(0, 5)} às ${h.hora_fim.substring(0, 5)}`;
    }
    return null;
  }

  getLideresResponsaveis(evento?: Evento): string {
    if (!evento?.lideres_responsaveis_ids || evento.lideres_responsaveis_ids.length === 0) {
      return 'A definir pela liderança';
    }
    const ids = evento.lideres_responsaveis_ids;
    const nomes = this.obreirosLista()
      .filter(o => ids.includes(o.id_obreiro))
      .map(o => o.nome);

    return nomes.length > 0 ? nomes.join(', ') : 'A definir pela liderança';
  }

  formatDataExtensa(dataStr?: string): string {
    if (!dataStr) return '';
    try {
      const parts = dataStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return `${dias[d.getDay()]}, ${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (_) {}
    return dataStr;
  }

  formatMesAnoLabel(ym: string): string {
    const parts = ym.split('-');
    if (parts.length === 2) {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return `${meses[Number(parts[1]) - 1]} / ${parts[0]}`;
    }
    return ym;
  }

  getTurnoBadge(turno?: number): { label: string; class: string } {
    if (turno === 1) {
      return { label: '☀️ Manhã', class: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    }
    if (turno === 2) {
      return { label: '🌤️ Tarde', class: 'bg-orange-500/10 text-orange-300 border-orange-500/30' };
    }
    return { label: '🌙 Noite', class: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' };
  }
}
