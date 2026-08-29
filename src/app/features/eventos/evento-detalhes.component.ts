import { Component, OnInit, ChangeDetectorRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventoOperacaoService } from '../../core/services/evento-operacao.service';
import { AreaService } from '../../core/services/area.service';
import { LocalService } from '../../core/services/local.service';
import { ObreiroService } from '../../core/services/obreiro.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { 
  TRAJE_OPCOES, 
  CORES_TERNO, 
  CORES_GRAVATA, 
  CORES_CAMISA, 
  TrajeTipo, 
  TrajeAndLideresConfigDto, 
  SaveAreaHorarioDto, 
  EventoAreaHorario 
} from '../../core/models/evento-operacao.model';
import { Area, getAreaBadgeStyle } from '../../core/models/area.model';
import { Escala } from '../../core/models/escala.model';
import { Local } from '../../core/models/local.model';

export interface TurnoOption {
  id: number;
  label: string;
  maxVagas: number;
}

export interface SetorAlocacaoGroup {
  area: Area;
  escalas: Escala[];
}

export interface TurnoCardGroup {
  id: number;
  label: string;
  maxVagas: number;
  setores: SetorAlocacaoGroup[];
  alocadosCount: number;
}

@Component({
  selector: 'app-evento-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './evento-detalhes.component.html'
})
export class EventoDetalhesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);
  public operacaoService = inject(EventoOperacaoService);
  public areaService = inject(AreaService);
  public localService = inject(LocalService);
  public obreiroService = inject(ObreiroService);
  public authService = inject(AuthService);

  idEvento = signal<number>(0);
  isShareModalOpen = signal<boolean>(false);

  // Constantes de Traje
  trajeOpcoes = TRAJE_OPCOES;
  coresTerno = CORES_TERNO;
  coresGravata = CORES_GRAVATA;
  coresCamisa = CORES_CAMISA;
  getAreaBadgeStyle = getAreaBadgeStyle;

  formatDataEvento(dataStr?: string): string {
    if (!dataStr) return '';
    try {
      const parts = dataStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const diaSemana = diasSemana[d.getDay()];
        return `${diaSemana}, ${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (_) {}
    return dataStr;
  }

  formatHoraAmPm(timeStr?: string): string {
    if (!timeStr) return '';
    const parts = timeStr.trim().split(':');
    if (parts.length < 2) return timeStr;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].padStart(2, '0');
    if (isNaN(hours)) return timeStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes}${ampm}`;
  }

  // Formulário de Traje & Liderança em Signal Reativo
  trajeConfig = signal<TrajeAndLideresConfigDto>({
    traje_tipo: 'Camisa Preta',
    terno_cor_obrigatoria: false,
    terno_cor: 'Preto',
    gravata_cor_obrigatoria: false,
    gravata_cor: 'Vermelho',
    camisa_cor_obrigatoria: false,
    camisa_cor: 'Branca',
    cracha_obrigatorio: true,
    lideres_responsaveis_ids: []
  });

  // Formulário Novo Horário por Setor
  novoHorario: SaveAreaHorarioDto = {
    id_area: 1,
    horario_turno: 1,
    hora_inicio: '18:00',
    hora_fim: '21:00'
  };

  // Filtros de Postos
  filtroTurnoPosto = signal<string | number>('TODOS');
  filtroAreaPosto = signal<string | number>('TODAS');
  filtroStatusPosto = signal<string>('TODOS');

  filtroTurno = computed(() => this.filtroTurnoPosto());
  filtroArea = computed(() => this.filtroAreaPosto());
  filtroStatus = computed(() => this.filtroStatusPosto());

  // Lista de Diáconos Líderes (estritamente obreiros com flag lider = true)
  diaconosLideres = computed(() => {
    return this.obreiroService.obreiros()
      .filter(o => o.ativo && o.lider)
      .sort((a, b) => a.nome.localeCompare(b.nome));
  });

  // Estatísticas de Alocação
  totalEscalados = computed(() => this.operacaoService.escalas().length);
  totalAlocados = computed(() => this.operacaoService.escalas().filter(e => !!e.id_local).length);
  totalPendentes = computed(() => this.totalEscalados() - this.totalAlocados());
  percentualCobertura = computed(() => {
    const tot = this.totalEscalados();
    if (tot === 0) return 0;
    return Math.round((this.totalAlocados() / tot) * 100);
  });

  // Horários disponíveis configurados no evento (1º, 2º, 3º)
  turnosDisponiveis = computed<TurnoOption[]>(() => {
    const ev = this.operacaoService.evento();
    if (!ev) return [{ id: 1, label: '1º Horário', maxVagas: 10 }];
    const turnos: TurnoOption[] = [];
    if ((ev.n_primeiro_horario ?? 0) > 0) turnos.push({ id: 1, label: '1º Horário', maxVagas: ev.n_primeiro_horario });
    if ((ev.n_segundo_horario ?? 0) > 0) turnos.push({ id: 2, label: '2º Horário', maxVagas: ev.n_segundo_horario });
    if ((ev.n_terceiro_horario ?? 0) > 0) turnos.push({ id: 3, label: '3º Horário', maxVagas: ev.n_terceiro_horario });
    return turnos.length > 0 ? turnos : [{ id: 1, label: '1º Horário', maxVagas: 10 }];
  });

  // Grupos de Escala organizados por Horário / Turno e agrupados por Setor
  gruposPorTurno = computed<TurnoCardGroup[]>(() => {
    const turnos = this.turnosDisponiveis();
    const allEscalas = this.operacaoService.escalas();
    const allAreas = this.areaService.areas();
    const filtroTurno = this.filtroTurnoPosto();
    const areaId = this.filtroAreaPosto();
    const status = this.filtroStatusPosto();

    const turnosFiltrados = filtroTurno === 'TODOS' 
      ? turnos 
      : turnos.filter(t => t.id === Number(filtroTurno));

    return turnosFiltrados.map(t => {
      // Filtrar obreiros com posto alocado no turno
      let items = allEscalas.filter(e => !!e.id_local && Number(e.horario_turno ?? 1) === t.id);

      if (areaId !== 'TODAS') {
        const numArea = Number(areaId);
        items = items.filter(e => Number(e.locais?.id_area) === numArea);
      }

      if (status === 'PENDENTES') {
        items = [];
      }

      // Agrupar obreiros por Setor / Área
      const setoresMap: SetorAlocacaoGroup[] = [];

      for (const area of allAreas) {
        const escalasArea = items.filter(e => Number(e.locais?.id_area) === area.id_area);
        if (escalasArea.length > 0) {
          setoresMap.push({
            area,
            escalas: escalasArea
          });
        }
      }

      // Caso haja algum com área não mapeada nas áreas cadastradas
      const mappedAreaIds = new Set(allAreas.map(a => a.id_area));
      const outros = items.filter(e => !mappedAreaIds.has(Number(e.locais?.id_area)));
      if (outros.length > 0) {
        setoresMap.push({
          area: { id_area: 0, nome: 'Outros Setores', icone: '📍', ativo: true },
          escalas: outros
        });
      }

      return {
        id: t.id,
        label: t.label,
        maxVagas: t.maxVagas,
        setores: setoresMap,
        alocadosCount: items.length
      };
    });
  });

  // Obreiros ainda sem nenhum posto definido (Pendentes)
  obreirosSemPosto = computed(() => {
    const allEscalas = this.operacaoService.escalas();
    const status = this.filtroStatusPosto();
    if (status === 'ALOCADOS') return [];
    return allEscalas.filter(e => !e.id_local);
  });

  onFiltroTurnoChanged(val: any) {
    this.filtroTurnoPosto.set(val === 'TODOS' ? 'TODOS' : Number(val));
    this.cdr.markForCheck();
  }

  onFiltroAreaChanged(val: any) {
    this.filtroAreaPosto.set(val === 'TODAS' ? 'TODAS' : Number(val));
    this.cdr.markForCheck();
  }

  onFiltroStatusChanged(val: any) {
    this.filtroStatusPosto.set(val);
    this.cdr.markForCheck();
  }

  ngOnInit() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.idEvento.set(id);
        this.carregarDados(id);
      }
    });

    this.areaService.fetchAreas();
    this.localService.fetchLocais();
    this.obreiroService.fetchAll();
  }

  async carregarDados(id: number) {
    await this.operacaoService.loadEventoOperacao(id);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const ev = this.operacaoService.evento();
    if (ev) {
      this.trajeConfig.set({
        traje_tipo: (ev.traje_tipo as TrajeTipo) || 'Camisa Preta',
        terno_cor_obrigatoria: ev.terno_cor_obrigatoria ?? false,
        terno_cor: ev.terno_cor || 'Preto',
        gravata_cor_obrigatoria: ev.gravata_cor_obrigatoria ?? false,
        gravata_cor: ev.gravata_cor || 'Vermelho',
        camisa_cor_obrigatoria: ev.camisa_cor_obrigatoria ?? false,
        camisa_cor: ev.camisa_cor || 'Branca',
        cracha_obrigatorio: ev.cracha_obrigatorio ?? true,
        lideres_responsaveis_ids: ev.lideres_responsaveis_ids || []
      });
    }
    this.cdr.markForCheck();
  }

  // --- Ações de Traje & Liderança ---
  async setTrajeTipo(tipo: TrajeTipo) {
    this.trajeConfig.update(prev => ({ ...prev, traje_tipo: tipo }));
    await this.salvarTrajeELideres();
  }

  async updateTrajeField(field: keyof TrajeAndLideresConfigDto, value: any) {
    this.trajeConfig.update(prev => ({ ...prev, [field]: value }));
    await this.salvarTrajeELideres();
  }

  async toggleLider(idObreiro?: number) {
    if (!idObreiro) return;
    const current = this.trajeConfig().lideres_responsaveis_ids || [];
    const updated = current.includes(idObreiro)
      ? current.filter(id => id !== idObreiro)
      : [...current, idObreiro];

    this.trajeConfig.update(prev => ({ ...prev, lideres_responsaveis_ids: updated }));
    await this.salvarTrajeELideres();
  }

  isLiderSelecionado(idObreiro?: number): boolean {
    if (!idObreiro) return false;
    return (this.trajeConfig().lideres_responsaveis_ids || []).includes(idObreiro);
  }

  async salvarTrajeELideres() {
    await this.operacaoService.saveTrajeAndLideres(this.idEvento(), this.trajeConfig());
    this.cdr.markForCheck();
  }

  // --- Modal Seletor de Cores de Terno / Gravata / Camisa ---
  activeColorPickerField = signal<'terno_cor' | 'gravata_cor' | 'camisa_cor' | null>(null);

  openColorPicker(field: 'terno_cor' | 'gravata_cor' | 'camisa_cor') {
    if (!this.authService.canManageOperacao()) return;
    this.activeColorPickerField.set(field);
  }

  closeColorPicker() {
    this.activeColorPickerField.set(null);
  }

  getColorPickerTitle(): string {
    const field = this.activeColorPickerField();
    if (field === 'terno_cor') return 'Cor Obrigatória do Terno';
    if (field === 'gravata_cor') return 'Cor Obrigatória da Gravata';
    if (field === 'camisa_cor') return 'Cor Obrigatória da Camisa';
    return 'Escolher Cor';
  }

  getColorPickerOptions(): string[] {
    const field = this.activeColorPickerField();
    if (field === 'terno_cor') return this.coresTerno;
    if (field === 'gravata_cor') return this.coresGravata;
    if (field === 'camisa_cor') return this.coresCamisa;
    return [];
  }

  getColorPickerCurrentValue(): string {
    const field = this.activeColorPickerField();
    if (!field) return '';
    return (this.trajeConfig()[field] as string) || '';
  }

  getColorHex(cor: string): string {
    const lower = (cor || '').toLowerCase();
    if (lower.includes('preto') || lower.includes('preta')) return '#18181b';
    if (lower.includes('marinho')) return '#172554';
    if (lower.includes('royal') || lower.includes('caneta') || lower.includes('bic')) return '#1d4ed8';
    if (lower.includes('petróleo')) return '#0e7490';
    if (lower.includes('azul claro')) return '#93c5fd';
    if (lower.includes('azul')) return '#2563eb';
    if (lower.includes('bordô') || lower.includes('vinho') || lower.includes('marsala')) return '#881337';
    if (lower.includes('vermelho')) return '#dc2626';
    if (lower.includes('chumbo') || lower.includes('grafite')) return '#334155';
    if (lower.includes('cinza claro')) return '#cbd5e1';
    if (lower.includes('cinza')) return '#64748b';
    if (lower.includes('branco') || lower.includes('branca')) return '#f8fafc';
    if (lower.includes('prata')) return '#e2e8f0';
    if (lower.includes('dourado') || lower.includes('mostarda')) return '#d97706';
    if (lower.includes('amarelo')) return '#eab308';
    if (lower.includes('marrom') || lower.includes('café')) return '#78350f';
    if (lower.includes('rosê') || lower.includes('rosa')) return '#f472b6';
    if (lower.includes('lilás')) return '#c084fc';
    if (lower.includes('oliva') || lower.includes('verde')) return '#4d7c0f';
    if (lower.includes('laranja')) return '#ea580c';
    return '#475569';
  }

  getColorBorderStyle(cor: string, isSelected: boolean = false): string {
    if (isSelected) {
      return 'border-2 border-indigo-400 bg-indigo-950/70 text-white ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/50';
    }
    return 'border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white';
  }

  async selectColorOption(color: string) {
    const field = this.activeColorPickerField();
    if (field) {
      this.trajeConfig.update(prev => ({ ...prev, [field]: color }));
      await this.salvarTrajeELideres();
      this.closeColorPicker();
      this.cdr.markForCheck();
    }
  }

  // --- Ações de Horários por Área ---
  async adicionarHorarioArea() {
    if (!this.novoHorario.id_area || !this.novoHorario.hora_inicio || !this.novoHorario.hora_fim) return;
    await this.operacaoService.saveAreaHorario(this.idEvento(), this.novoHorario);
    this.cdr.markForCheck();
  }

  async removerHorarioArea(horario: EventoAreaHorario) {
    if (horario.id_area_horario) {
      await this.operacaoService.deleteAreaHorario(horario.id_area_horario);
      this.cdr.markForCheck();
    }
  }

  // --- Seletor Modal / Bottom Sheet de Designação de Posto ---
  selectedEscalaForPicker = signal<Escala | null>(null);
  selectedTurnoForPicker = signal<number>(1);

  openPostoPicker(escala: Escala) {
    if (!this.authService.canManageOperacao()) return;
    this.selectedEscalaForPicker.set(escala);
    this.selectedTurnoForPicker.set(escala.horario_turno || 1);
  }

  closePostoPicker() {
    this.selectedEscalaForPicker.set(null);
  }

  setPickerTurno(turnoId: number) {
    this.selectedTurnoForPicker.set(turnoId);
  }

  async selectPosto(local: Local) {
    const escala = this.selectedEscalaForPicker();
    const turno = this.selectedTurnoForPicker();
    if (escala?.id_escala && local?.id_local && turno) {
      await this.operacaoService.designarPosto(escala.id_escala, local.id_local, turno);
      this.closePostoPicker();
      this.cdr.markForCheck();
    }
  }

  async removerPostoModal() {
    const escala = this.selectedEscalaForPicker();
    if (escala?.id_escala) {
      await this.operacaoService.desvincularPosto(escala.id_escala);
      this.closePostoPicker();
      this.cdr.markForCheck();
    }
  }

  async desvincularPosto(escala: Escala) {
    if (escala.id_escala) {
      await this.operacaoService.desvincularPosto(escala.id_escala);
      this.cdr.markForCheck();
    }
  }

  getLocaisPorArea(idArea?: number): Local[] {
    const list = this.localService.locais().filter(l => l.ativo);
    if (!idArea) return list;
    return list.filter(l => l.id_area === idArea);
  }

  getObreiroNome(idObreiro: number): string {
    const ob = this.obreiroService.obreiros().find(o => o.id_obreiro === idObreiro);
    return ob ? ob.nome : `Obreiro #${idObreiro}`;
  }

  // --- Compartilhamento WhatsApp ---
  openShareModal() {
    this.isShareModalOpen.set(true);
  }

  closeShareModal() {
    this.isShareModalOpen.set(false);
  }

  gerarTextoWhatsApp(): string {
    const ev = this.operacaoService.evento();
    if (!ev) return '';

    const lines: string[] = [];

    // Header
    lines.push(`📋 *DIACONATO - INFORMAÇÕES DO CULTO*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🏛️ *Culto:* ${ev.descricao || 'Culto / Evento'}`);
    if (ev.data) {
      lines.push(`📅 *Data:* ${this.formatDataEvento(ev.data)}`);
    }
    const turnoLabel = ev.turno === 1 ? '☀️ Manhã' : ev.turno === 2 ? '🌤️ Tarde' : '🌙 Noite';
    lines.push(`⏰ *Turno:* ${turnoLabel}`);
    lines.push('');

    // Liderança Responsável
    const lideresIds = this.trajeConfig().lideres_responsaveis_ids || [];
    const lideres = this.diaconosLideres().filter(l => typeof l.id_obreiro === 'number' && lideresIds.includes(l.id_obreiro));
    lines.push(`⭐ *Liderança Responsável:*`);
    if (lideres.length > 0) {
      lideres.forEach(l => lines.push(`  • ${l.nome}`));
    } else {
      lines.push(`  • Não definidos`);
    }
    lines.push('');

    // Traje Oficial
    lines.push(`👔 *Traje Oficial:*`);
    const cfg = this.trajeConfig();
    lines.push(`  • *Uniforme:* ${cfg.traje_tipo}`);
    if (cfg.traje_tipo === 'Terno') {
      lines.push(`  • *Terno:* ${cfg.terno_cor_obrigatoria ? cfg.terno_cor : 'Cor Livre'}`);
      lines.push(`  • *Gravata:* ${cfg.gravata_cor_obrigatoria ? cfg.gravata_cor : 'Cor Livre'}`);
      lines.push(`  • *Camisa:* ${cfg.camisa_cor_obrigatoria ? cfg.camisa_cor : 'Cor Livre'}`);
    }
    lines.push(`  • *Crachá:* ${cfg.cracha_obrigatorio ? 'Obrigatório' : 'Dispensado'}`);
    lines.push('');

    // Postos Agrupados por Área e dentro da Área por Horário
    lines.push(`📍 *ESCALA DE POSTOS POR ÁREA:*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);

    const allEscalas = this.operacaoService.escalas();
    const allAreas = this.areaService.areas();
    const allTurnos = this.turnosDisponiveis();
    const horarios = this.operacaoService.areaHorarios();

    let temAlocados = false;

    for (const area of allAreas) {
      const escArea = allEscalas.filter(e => !!e.id_local && Number(e.locais?.id_area) === area.id_area);
      if (escArea.length === 0) continue;
      temAlocados = true;

      lines.push(`\n${area.icone || '📍'} *${area.nome.toUpperCase()}* (${escArea.length} alocados)`);

      // Dentro da Área, agrupar por Horário / Turno
      for (const turno of allTurnos) {
        const escTurno = escArea.filter(e => Number(e.horario_turno ?? 1) === turno.id);
        if (escTurno.length === 0) continue;

        const hArea = horarios.find((h: EventoAreaHorario) => h.id_area === area.id_area && h.horario_turno === turno.id);
        const horaTxt = hArea ? ` (${this.formatHoraAmPm(hArea.hora_inicio)} às ${this.formatHoraAmPm(hArea.hora_fim)})` : '';
        
        lines.push(`\n 🕒 *${turno.label}${horaTxt}*:`);

        // Agrupar por Posto / Local dentro deste horário
        const postosMap = new Map<string, string[]>();
        for (const esc of escTurno) {
          const postoNome = esc.locais?.nome || 'Posto Geral';
          const obNome = esc.obreiros?.nome || this.getObreiroNome(esc.id_obreiro);
          const list = postosMap.get(postoNome) || [];
          list.push(obNome);
          postosMap.set(postoNome, list);
        }

        for (const [posto, obreiros] of postosMap.entries()) {
          lines.push(`  ▫️ ${posto}: ${obreiros.join(', ')}`);
        }
      }
    }

    if (!temAlocados) {
      lines.push(`\n_Nenhum obreiro alocado em postos até o momento._`);
    }

    // Obreiros Sem Posto (se houver)
    const semPosto = this.obreirosSemPosto();
    if (semPosto.length > 0) {
      lines.push(`\n⏳ *Obreiros sem posto definido (${semPosto.length}):*`);
      const nomes = semPosto.map(e => e.obreiros?.nome || this.getObreiroNome(e.id_obreiro));
      lines.push(` • ${nomes.join(', ')}`);
    }

    lines.push(`\n👥 *Total Geral Escalados:* ${this.totalEscalados()} obreiro(s)`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`Que Deus abençoe!🙏`);

    return lines.join('\n');
  }

  async copiarTextoWhatsApp() {
    const texto = this.gerarTextoWhatsApp();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(texto);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.toast.success('Copiado!', 'Mensagem copiada para a área de transferência.');
    } catch (err) {
      this.toast.error('Erro ao copiar', 'Não foi possível copiar automaticamente.');
    }
  }

  compartilharDiretoWhatsApp() {
    const texto = this.gerarTextoWhatsApp();
    const encoded = encodeURIComponent(texto);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  }

  voltar() {
    this.router.navigate(['/eventos']);
  }
}
