import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ObreiroAuthService } from '../../core/services/obreiro-auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Escala } from '../../core/models/escala.model';
import { Bloqueio } from '../../core/models/bloqueio.model';
import { Evento } from '../../core/models/evento.model';
import { Local } from '../../core/models/local.model';

export interface EscalaPortalItem {
  id_escala: number;
  data: string;
  evento: Evento;
  local?: Local;
  horario_turno?: number;
  checkin?: boolean | null;
  isFuturo: boolean;
}

export interface EventoAreaHorarioItem {
  id_evento: number;
  id_area: number;
  horario_turno: number;
  hora_inicio: string;
  hora_fim: string;
}

@Component({
  selector: 'app-portal-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portal-dashboard.component.html'
})
export class PortalDashboardComponent implements OnInit {
  public obreiroAuth = inject(ObreiroAuthService);
  private supabase = inject(SupabaseService).client;

  loading = signal<boolean>(true);
  minhasEscalas = signal<EscalaPortalItem[]>([]);
  meusBloqueios = signal<Bloqueio[]>([]);
  areaHorarios = signal<EventoAreaHorarioItem[]>([]);
  obreirosLista = signal<{ id_obreiro: number; nome: string }[]>([]);

  // Próxima Escala Futura
  proximaEscala = computed<EscalaPortalItem | null>(() => {
    const hojeStr = new Date().toISOString().split('T')[0];
    const futuras = this.minhasEscalas().filter(e => e.data >= hojeStr);
    return futuras.length > 0 ? futuras[0] : null;
  });

  totalEscalasAno = computed(() => this.minhasEscalas().length);
  totalBloqueiosAtivos = computed(() => {
    const hojeStr = new Date().toISOString().split('T')[0];
    return this.meusBloqueios().filter(b => b.data >= hojeStr).length;
  });

  ngOnInit(): void {
    this.carregarDados();
  }

  async carregarDados(): Promise<void> {
    const obreiro = this.obreiroAuth.currentObreiro();
    if (!obreiro?.id_obreiro) return;

    this.loading.set(true);
    try {
      // 1. Carrega escalas do obreiro com evento e local
      const { data: escData, error: escError } = await this.supabase
        .from('escala')
        .select(`
          *,
          eventos (*, mes (*)),
          locais (*, areas (*))
        `)
        .eq('id_obreiro', obreiro.id_obreiro);

      if (!escError && escData) {
        const hojeStr = new Date().toISOString().split('T')[0];
        const rawList = (escData || []) as any[];
        const mapped: EscalaPortalItem[] = rawList
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
              evento: ev as Evento,
              local: loc as Local | undefined,
              horario_turno: e.horario_turno,
              checkin: e.checkin,
              isFuturo: evData >= hojeStr
            };
          })
          .sort((a, b) => a.data.localeCompare(b.data));

        this.minhasEscalas.set(mapped);
      }

      // 2. Carrega bloqueios do obreiro
      const { data: bloqData, error: bloqError } = await this.supabase
        .from('bloqueios')
        .select('*')
        .eq('id_obreiro', obreiro.id_obreiro)
        .order('data', { ascending: true });

      if (!bloqError && bloqData) {
        this.meusBloqueios.set(bloqData as Bloqueio[]);
      }

      // 3. Carrega horários das áreas
      const { data: horData } = await this.supabase
        .from('evento_area_horarios')
        .select('id_evento, id_area, horario_turno, hora_inicio, hora_fim');

      if (horData) {
        this.areaHorarios.set(horData as EventoAreaHorarioItem[]);
      }

      // 4. Carrega obreiros para identificação dos líderes
      const { data: obData } = await this.supabase
        .from('obreiros')
        .select('id_obreiro, nome');

      if (obData) {
        this.obreirosLista.set(obData);
      }
    } catch (e) {
      console.error('Erro ao carregar dados do dashboard do portal:', e);
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
        return `${dias[d.getDay()]}, ${parts[2]} de ${meses[Number(parts[1]) - 1]}`;
      }
    } catch (_) {}
    return dataStr;
  }

  getTurnoLabel(turno?: number): string {
    if (turno === 1) return '☀️ Manhã';
    if (turno === 2) return '🌤️ Tarde';
    return '🌙 Noite';
  }
}
