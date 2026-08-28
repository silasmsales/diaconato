import { Component, OnInit, ChangeDetectorRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventoOperacaoService } from '../../core/services/evento-operacao.service';
import { AreaService } from '../../core/services/area.service';
import { LocalService } from '../../core/services/local.service';
import { ObreiroService } from '../../core/services/obreiro.service';
import { AuthService } from '../../core/services/auth.service';
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
  public operacaoService = inject(EventoOperacaoService);
  public areaService = inject(AreaService);
  public localService = inject(LocalService);
  public obreiroService = inject(ObreiroService);
  public authService = inject(AuthService);

  idEvento = signal<number>(0);

  // Constantes de Traje
  trajeOpcoes = TRAJE_OPCOES;
  coresTerno = CORES_TERNO;
  coresGravata = CORES_GRAVATA;
  coresCamisa = CORES_CAMISA;
  getAreaBadgeStyle = getAreaBadgeStyle;

  // Formulário de Traje & Liderança em Signal Reativo
  trajeConfig = signal<TrajeAndLideresConfigDto>({
    traje_tipo: 'Camisa Preta',
    terno_cor_obrigatoria: false,
    terno_cor: 'Preto',
    gravata_cor_obrigatoria: false,
    gravata_cor: 'Vermelho / Bordô',
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
    const ev = this.operacaoService.evento();
    if (ev) {
      this.trajeConfig.set({
        traje_tipo: (ev.traje_tipo as TrajeTipo) || 'Camisa Preta',
        terno_cor_obrigatoria: ev.terno_cor_obrigatoria ?? false,
        terno_cor: ev.terno_cor || 'Preto',
        gravata_cor_obrigatoria: ev.gravata_cor_obrigatoria ?? false,
        gravata_cor: ev.gravata_cor || 'Vermelho / Bordô',
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

  voltar() {
    this.router.navigate(['/eventos']);
  }
}
