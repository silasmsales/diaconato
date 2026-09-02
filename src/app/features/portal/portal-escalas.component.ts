import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ObreiroAuthService } from '../../core/services/obreiro-auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { ToastService } from '../../core/services/toast.service';
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
  private toast = inject(ToastService);

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

      // Obreiros para identificação e contato dos líderes
      const { data: obData } = await this.supabase
        .from('obreiros')
        .select('id_obreiro, nome, apelido, telefone, email');

      if (obData) {
        this.obreirosLista.set(obData as any[]);
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

  getLideresObjetos(evento?: Evento): any[] {
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

  getTurnoLabel(turno?: number): string {
    if (turno === 1) return '☀️ Manhã';
    if (turno === 2) return '🌤️ Tarde';
    return '🌙 Noite';
  }

  // --- Agendamento de Cultos no Calendário do Aparelho (Individual ou em Lote) ---
  exportarTodasParaCalendario(lista?: EscalaDetalhadaPortal[]): void {
    const itens = (lista || this.escalas().filter(e => e.isFuturo));
    if (!itens || itens.length === 0) {
      this.toast.error('Nenhum culto futuro encontrado para agendar.');
      return;
    }

    const vevents: string[] = [];
    const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const location = 'Assembleia de Deus de Taguatinga • Templo Sede';

    for (const escala of itens) {
      if (!escala.data) continue;
      const ev = escala.evento;
      const title = `Escala Diaconato - ${ev?.descricao || 'Culto de Adoração'}`;

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

      const startIso = `${dataClean}T${hIniClean}`;
      const endIso = `${dataClean}T${hFimClean}`;

      const posto = escala.local?.nome || 'A definir pela coordenação';
      const setor = escala.local?.areas?.nome ? ` (${escala.local.areas.nome})` : '';
      const turnoTxt = escala.horario_turno ? `${escala.horario_turno}º Horário` : 'Horário Geral';
      const trajeTxt = ev?.traje_tipo === 'Terno' 
        ? `Terno Completo (${ev.terno_cor_obrigatoria ? 'Terno ' + ev.terno_cor : 'Cor Livre'}, ${ev.gravata_cor_obrigatoria ? 'Gravata ' + ev.gravata_cor : 'Gravata Livre'})` 
        : (ev?.traje_tipo || 'Uniforme Padrão');
      const lideresTxt = this.getLideresResponsaveis(ev);
      const crachaTxt = ev?.cracha_obrigatorio ? 'Obrigatório' : 'Dispensado';

      const horarioAtuacaoTxt = horarioStr 
        ? `${horarioStr} (${turnoTxt})` 
        : `${horaInicio} às ${horaFim} (Posto/Horário específico a definir - ${this.getTurnoLabel(ev?.turno)})`;

      const descriptionIcs = `Escala de Diaconato\\nPosto: ${posto}${setor}\\nHorario: ${horarioAtuacaoTxt}\\nTraje: ${trajeTxt}\\nLideranca: ${lideresTxt}\\nCracha: ${crachaTxt}\\nLocal: ${location}`;

      vevents.push(
        'BEGIN:VEVENT',
        `UID:${Date.now()}-${escala.id_escala}-${dataClean}@diaconato.app`,
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
        'END:VEVENT'
      );
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Diaconato Web//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...vevents,
      'END:VCALENDAR'
    ].join('\r\n');

    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);

    if (isIOS) {
      const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
      window.location.href = dataUri;
    } else {
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `minhas-escalas-diaconato.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }

    this.toast.success(`${itens.length} ${itens.length === 1 ? 'culto agendado' : 'cultos agendados'} no calendário do aparelho!`);
  }

  // --- Agendamento Individual no Calendário Padrão do Aparelho (Mesmo padrão de Seu Próximo Culto) ---
  adicionarEscalaAoCalendario(escala?: EscalaDetalhadaPortal | null): void {
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
      const descriptionIcs = `Escala de Diaconato\\nPosto: ${posto}${setor}\\nHorario: ${horarioAtuacaoTxt}\\nTraje: ${trajeTxt}\\nLideranca: ${lideresTxt}\\nCracha: ${crachaTxt}\\nLocal: ${location}`;

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

  getInitials(name?: string): string {
    if (!name) return 'OB';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
