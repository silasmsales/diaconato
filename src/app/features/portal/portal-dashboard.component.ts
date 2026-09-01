import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ObreiroAuthService } from '../../core/services/obreiro-auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { ToastService } from '../../core/services/toast.service';
import { Escala } from '../../core/models/escala.model';
import { Bloqueio } from '../../core/models/bloqueio.model';
import { Evento } from '../../core/models/evento.model';
import { Local } from '../../core/models/local.model';
import { Obreiro } from '../../core/models/obreiro.model';

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

export interface EquipeCultoObreiro {
  id_escala: number;
  id_obreiro: number;
  horario_turno?: number;
  checkin?: boolean | null;
  obreiro: {
    id_obreiro: number;
    nome: string;
    apelido?: string | null;
    telefone?: string | null;
    foto?: string | null;
    diacono: boolean;
    lider: boolean;
    pulpito: boolean;
  };
  local?: {
    id_local: number;
    nome: string;
    id_area?: number;
    areas?: {
      id_area: number;
      nome: string;
      icone?: string;
    };
  };
}

export interface ObreiroCompactoItem {
  id_escala: number;
  id_obreiro: number;
  nome: string;
  apelido?: string | null;
  telefone?: string | null;
  foto?: string | null;
  posto: string;
}

export interface AreaComObreiros {
  idArea: number;
  nomeArea: string;
  iconeArea: string;
  horarioFormatado?: string | null;
  obreiros: ObreiroCompactoItem[];
}

export interface GrupoTurnoEquipe {
  horarioTurno: number;
  labelTurno: string;
  areas: AreaComObreiros[];
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
  private toast = inject(ToastService);

  loading = signal<boolean>(true);
  minhasEscalas = signal<EscalaPortalItem[]>([]);
  meusBloqueios = signal<Bloqueio[]>([]);
  areaHorarios = signal<EventoAreaHorarioItem[]>([]);
  obreirosLista = signal<{ id_obreiro: number; nome: string; apelido?: string | null; telefone?: string | null; email?: string | null }[]>([]);
  equipeProximoCulto = signal<EquipeCultoObreiro[]>([]);

  // Próxima Escala Futura
  proximaEscala = computed<EscalaPortalItem | null>(() => {
    const hojeStr = new Date().toISOString().split('T')[0];
    const futuras = this.minhasEscalas().filter(e => e.data >= hojeStr);
    return futuras.length > 0 ? futuras[0] : null;
  });

  // Outros obreiros escalados para o próximo culto (exceto o próprio usuário)
  outrosObreirosEscalados = computed(() => {
    const meuId = this.obreiroAuth.currentObreiro()?.id_obreiro;
    return this.equipeProximoCulto().filter(item => item.id_obreiro !== meuId);
  });

  // Equipe agrupada compactamente por Turno/Horário e Área de Atuação
  equipeAgrupada = computed<GrupoTurnoEquipe[]>(() => {
    const outros = this.outrosObreirosEscalados();
    const evId = this.proximaEscala()?.evento?.id_evento;
    if (outros.length === 0) return [];

    const turnosMap = new Map<number, Map<number, AreaComObreiros>>();

    for (const item of outros) {
      const turno = Number(item.horario_turno || 1);
      const idArea = Number(item.local?.id_area || item.local?.areas?.id_area || 0);
      const nomeArea = item.local?.areas?.nome || (idArea === 0 ? 'Geral' : 'Setor');
      const iconeArea = item.local?.areas?.icone || (idArea === 0 ? '📍' : '🏛️');

      if (!turnosMap.has(turno)) {
        turnosMap.set(turno, new Map());
      }
      const areasMap = turnosMap.get(turno)!;

      if (!areasMap.has(idArea)) {
        const horario = idArea > 0 && evId ? this.getHorarioAtuacao(evId, idArea, turno) : null;
        areasMap.set(idArea, {
          idArea,
          nomeArea,
          iconeArea,
          horarioFormatado: horario,
          obreiros: []
        });
      }

      areasMap.get(idArea)!.obreiros.push({
        id_escala: item.id_escala,
        id_obreiro: item.id_obreiro,
        nome: item.obreiro?.nome || '',
        apelido: item.obreiro?.apelido,
        telefone: item.obreiro?.telefone,
        foto: item.obreiro?.foto,
        posto: item.local?.nome || 'Posto a definir'
      });
    }

    const resultado: GrupoTurnoEquipe[] = [];
    const turnosOrdenados = Array.from(turnosMap.keys()).sort((a, b) => {
      if (a === 0) return 1;
      if (b === 0) return -1;
      return a - b;
    });

    for (const turno of turnosOrdenados) {
      const areasMap = turnosMap.get(turno)!;
      const areasList = Array.from(areasMap.values()).sort((a, b) => a.nomeArea.localeCompare(b.nomeArea));

      let labelTurno = `${turno}º Horário`;
      if (turno === 0) labelTurno = 'Horário Geral';

      resultado.push({
        horarioTurno: turno,
        labelTurno,
        areas: areasList
      });
    }

    return resultado;
  });

  totalEscalasAno = computed(() => this.minhasEscalas().length);
  totalBloqueiosAtivos = computed(() => {
    const hojeStr = new Date().toISOString().split('T')[0];
    const datas = this.meusBloqueios().filter(b => b.data >= hojeStr).map(b => b.data);
    return new Set(datas).size;
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

      // 4. Carrega obreiros para identificação e contato dos líderes
      const { data: obData } = await this.supabase
        .from('obreiros')
        .select('id_obreiro, nome, apelido, telefone, email');

      if (obData) {
        this.obreirosLista.set(obData as any[]);
      }

      // 5. Carrega equipe escalada para o próximo culto
      const hojeStr = new Date().toISOString().split('T')[0];
      const prox = this.minhasEscalas().find(e => e.data >= hojeStr);
      if (prox?.evento?.id_evento) {
        const { data: equipeData, error: equipeError } = await this.supabase
          .from('escala')
          .select(`
            id_escala,
            id_obreiro,
            horario_turno,
            checkin,
            obreiros (
              id_obreiro,
              nome,
              apelido,
              telefone,
              foto,
              diacono,
              lider,
              pulpito
            ),
            locais (
              id_local,
              nome,
              id_area,
              areas (
                id_area,
                nome,
                icone
              )
            )
          `)
          .eq('id_evento', prox.evento.id_evento);

        if (!equipeError && equipeData) {
          const rawEquipe = (equipeData || []) as any[];
          const parsedEquipe: EquipeCultoObreiro[] = rawEquipe
            .filter(item => !!item.obreiros)
            .map(item => {
              const ob = Array.isArray(item.obreiros) ? item.obreiros[0] : item.obreiros;
              const loc = Array.isArray(item.locais) ? item.locais[0] : item.locais;
              if (loc && Array.isArray(loc.areas)) {
                loc.areas = loc.areas[0];
              }
              return {
                id_escala: item.id_escala,
                id_obreiro: item.id_obreiro,
                horario_turno: item.horario_turno,
                checkin: item.checkin,
                obreiro: ob,
                local: loc
              };
            })
            .sort((a, b) => {
              // 1. Líderes primeiro
              if (a.obreiro?.lider !== b.obreiro?.lider) {
                return a.obreiro?.lider ? -1 : 1;
              }
              // 2. Ordenar por Área/Local
              const areaA = a.local?.areas?.nome || 'Z';
              const areaB = b.local?.areas?.nome || 'Z';
              const cmpArea = areaA.localeCompare(areaB);
              if (cmpArea !== 0) return cmpArea;
              // 3. Ordenar por Apelido / Nome
              const nomeA = a.obreiro?.apelido || a.obreiro?.nome || '';
              const nomeB = b.obreiro?.apelido || b.obreiro?.nome || '';
              return nomeA.localeCompare(nomeB);
            });

          this.equipeProximoCulto.set(parsedEquipe);
        }
      } else {
        this.equipeProximoCulto.set([]);
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

  getLideresObjetos(evento?: Evento): { id_obreiro: number; nome: string; apelido?: string | null; telefone?: string | null; email?: string | null }[] {
    if (!evento?.lideres_responsaveis_ids || evento.lideres_responsaveis_ids.length === 0) {
      return [];
    }
    const ids = evento.lideres_responsaveis_ids;
    return this.obreirosLista().filter(o => o.id_obreiro && ids.includes(o.id_obreiro));
  }

  getLideresResponsaveis(evento?: Evento): string {
    const lideres = this.getLideresObjetos(evento);
    return lideres.length > 0 ? lideres.map(o => o.apelido || o.nome).join(', ') : 'A definir pela liderança';
  }

  getCleanWhatsAppNumber(phone?: string | null): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10 || digits.length === 11) {
      return `55${digits}`;
    }
    if (digits.startsWith('55')) {
      return digits;
    }
    return `55${digits}`;
  }

  getFormattedPhone(phone?: string | null): string {
    if (!phone) return '';
    const d = phone.replace(/\D/g, '');
    if (d.length === 11) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 7)}-${d.substring(7)}`;
    }
    if (d.length === 10) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 6)}-${d.substring(6)}`;
    }
    if (d.length === 13 && d.startsWith('55')) {
      return `(${d.substring(2, 4)}) ${d.substring(4, 9)}-${d.substring(9)}`;
    }
    if (d.length === 12 && d.startsWith('55')) {
      return `(${d.substring(2, 4)}) ${d.substring(4, 8)}-${d.substring(8)}`;
    }
    return phone;
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

  getInitials(name?: string): string {
    if (!name) return 'OB';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  // --- Integração Direta com Calendário Padrão do Aparelho (.ics / Celular) ---
  adicionarAoCalendario(escala?: EscalaPortalItem | null): void {
    if (!escala || !escala.data) return;
    const ev = escala.evento;
    const title = `Escala Diaconato - ${ev?.descricao || 'Culto de Adoração'}`;
    const location = 'Assembleia de Deus de Taguatinga • Templo Sede';

    const horarioStr = this.getHorarioAtuacao(ev?.id_evento, escala.local?.id_area, escala.horario_turno);
    let horaInicio = '18:30';
    let horaFim = '21:00';

    if (horarioStr && horarioStr.includes('às')) {
      const parts = horarioStr.split('às').map(s => s.trim());
      if (parts.length === 2) {
        horaInicio = parts[0];
        horaFim = parts[1];
      }
    } else {
      if (ev?.turno === 1) {
        horaInicio = '08:30';
        horaFim = '11:45';
      } else if (ev?.turno === 2) {
        horaInicio = '14:30';
        horaFim = '17:30';
      }
    }

    const dataClean = escala.data.replace(/-/g, '');
    const hIniClean = horaInicio.replace(/:/g, '').padEnd(4, '0') + '00';
    const hFimClean = horaFim.replace(/:/g, '').padEnd(4, '0') + '00';

    const posto = escala.local?.nome || 'A definir pela coordenação';
    const setor = escala.local?.areas?.nome ? ` (Setor: ${escala.local.areas.nome})` : '';
    const turnoTxt = escala.horario_turno ? `${escala.horario_turno}º Horário` : 'Horário Geral';
    const trajeTxt = ev?.traje_tipo === 'Terno' 
      ? `Terno Completo (${ev.terno_cor_obrigatoria ? 'Terno ' + ev.terno_cor : 'Cor Livre'}, ${ev.gravata_cor_obrigatoria ? 'Gravata ' + ev.gravata_cor : 'Gravata Livre'})` 
      : (ev?.traje_tipo || 'Camisa Oficial');
    const lideresTxt = this.getLideresResponsaveis(ev);
    const crachaTxt = ev?.cracha_obrigatorio ? 'Obrigatório' : 'Dispensado';

    const horarioAtuacaoTxt = horarioStr 
      ? `${horarioStr} (${turnoTxt})` 
      : `${horaInicio} às ${horaFim} (Posto/Horário específico a definir pela coordenação - ${this.getTurnoLabel(ev?.turno)})`;

    const details = [
      `⛪ Evento: ${ev?.descricao || 'Culto de Adoração'}`,
      `📍 Posto Designado: ${posto}${setor}`,
      `⏰ Horário de Atuação: ${horarioAtuacaoTxt}`,
      `👔 Traje Oficial: ${trajeTxt}`,
      `⭐ Liderança do Culto: ${lideresTxt}`,
      `🪪 Crachá: ${crachaTxt}`,
      `\nAssembleia de Deus de Taguatinga • Templo Sede\nDiaconato AD Taguatinga`
    ].join('\n');

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);

    if (isIOS) {
      // No iPhone/iPad (iOS), o Data URI de text/calendar abre diretamente a tela nativa "Adicionar Evento" da Apple
      const startIso = `${dataClean}T${hIniClean}`;
      const endIso = `${dataClean}T${hFimClean}`;
      const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const descriptionIcs = `Escala de Diaconato\\nPosto: ${posto}${setor}\\nHorario: ${horarioStr || (horaInicio + ' as ' + horaFim)}\\nTraje: ${trajeTxt}\\nLideranca: ${lideresTxt}\\nLocal: ${location}`;

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Diaconato Web//PT',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${Date.now()}-${escala.id_escala}@diaconato.app`,
        `DTSTAMP:${nowIso}`,
        `DTSTART:${startIso}`,
        `DTEND:${endIso}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${descriptionIcs}`,
        `LOCATION:${location}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Lembrete da Escala do Diaconato em 2 horas',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
      window.location.href = dataUri;
    } else {
      // No Android e Computadores, abrir o link do Google Agenda aciona diretamente o app nativo de calendário do celular
      const dates = `${dataClean}T${hIniClean}/${dataClean}T${hFimClean}`;
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
      window.open(googleUrl, '_blank');
    }

    this.toast.success('Abrindo calendário do aparelho...');
  }
}
