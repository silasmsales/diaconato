import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RelatorioService } from '../../core/services/relatorio.service';
import { MesService } from '../../core/services/mes.service';
import { formatMesReferencia, findCurrentMes } from '../../core/models/mes.model';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';

export type RelatorioTab = 'assiduidade' | 'cobertura' | 'distribuicao' | 'postos' | 'resumo' | 'conflitos';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './relatorios.component.html'
})
export class RelatoriosComponent implements OnInit {
  relatorioService = inject(RelatorioService);
  mesService = inject(MesService);

  formatMesReferencia = formatMesReferencia;
  activeTab = signal<RelatorioTab>('assiduidade');
  searchQuery = signal<string>('');
  selectedMesId = signal<number>(0);
  selectedAno = signal<number>(new Date().getFullYear());
  assiduidadeModo = signal<'mensal' | 'anual' | 'geral'>('mensal');
  selectedDescricaoFilter = signal<string>('');

  // Filtros da aba Postos
  selectedAreaFilter = signal<number>(0);
  selectedLocalFilter = signal<number>(0);
  postosViewMode = signal<'obreiros' | 'locais' | 'tabela'>('obreiros');
  postosPeriodoModo = signal<'mensal' | 'anual' | 'geral'>('anual');
  apenasComPostoDefinido = signal<boolean>(false);

  anosDisponiveis = computed(() => {
    const currentYear = new Date().getFullYear();
    const set = new Set<number>([currentYear - 1, currentYear, currentYear + 1]);
    for (const m of this.mesService.meses()) {
      if (m.ano_referencia) set.add(Number(m.ano_referencia));
    }
    return Array.from(set).sort((a, b) => b - a);
  });

  descricoesDisponiveis = computed(() => {
    const set = new Set<string>();
    for (const item of this.relatorioService.distribuicaoEventos()) {
      if (item.descricao_evento) set.add(item.descricao_evento);
    }
    return Array.from(set).sort();
  });

  areasDisponiveis = computed(() => {
    const map = new Map<number, { id: number; nome: string; icone?: string }>();
    for (const item of this.relatorioService.escalasPorPosto()) {
      if (item.id_area && !map.has(item.id_area)) {
        map.set(item.id_area, { id: item.id_area, nome: item.nome_area, icone: item.icone_area });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  });

  locaisDisponiveis = computed(() => {
    const areaId = this.selectedAreaFilter();
    const map = new Map<number, { id: number; nome: string; areaId: number }>();
    for (const item of this.relatorioService.escalasPorPosto()) {
      if (item.id_local && (!areaId || item.id_area === areaId) && !map.has(item.id_local)) {
        map.set(item.id_local, { id: item.id_local, nome: item.nome_local, areaId: item.id_area });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  });

  // 1. Assiduidade Filtrada
  filteredAssiduidadeMensal = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.relatorioService.assiduidadeMensal();
    if (query) {
      list = list.filter(item => item.nome_obreiro && item.nome_obreiro.toLowerCase().includes(query));
    }
    return list;
  });

  filteredAssiduidadeAnual = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.relatorioService.assiduidadeAnual();
    if (query) {
      list = list.filter(item => item.nome_obreiro && item.nome_obreiro.toLowerCase().includes(query));
    }
    return list;
  });

  filteredAssiduidadeGeral = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.relatorioService.assiduidadeGeral();
    if (query) {
      list = list.filter(item => 
        (item.nome_obreiro && item.nome_obreiro.toLowerCase().includes(query)) ||
        (item.apelido_obreiro && item.apelido_obreiro.toLowerCase().includes(query))
      );
    }
    return list;
  });

  // 2. Cobertura Filtrada
  filteredCobertura = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.relatorioService.coberturaEventos();
    if (query) {
      list = list.filter(item => item.descricao_evento && item.descricao_evento.toLowerCase().includes(query));
    }
    return list;
  });

  // 3. Distribuição Filtrada
  filteredDistribuicao = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const desc = this.selectedDescricaoFilter();
    let list = this.relatorioService.distribuicaoEventos();
    if (desc) {
      list = list.filter(item => item.descricao_evento === desc);
    }
    if (query) {
      list = list.filter(item => 
        (item.nome_obreiro && item.nome_obreiro.toLowerCase().includes(query)) ||
        (item.descricao_evento && item.descricao_evento.toLowerCase().includes(query))
      );
    }
    return list;
  });

  // 4. Escalas por Posto Filtrada
  filteredEscalasPorPosto = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const areaId = this.selectedAreaFilter();
    const localId = this.selectedLocalFilter();
    const apenasDefinidos = this.apenasComPostoDefinido();
    let list = this.relatorioService.escalasPorPosto();

    if (apenasDefinidos) {
      list = list.filter(item => item.id_local > 0);
    }
    if (areaId > 0) {
      list = list.filter(item => item.id_area === areaId);
    }
    if (localId > 0) {
      list = list.filter(item => item.id_local === localId);
    }
    if (query) {
      list = list.filter(item =>
        (item.nome_obreiro && item.nome_obreiro.toLowerCase().includes(query)) ||
        (item.apelido_obreiro && item.apelido_obreiro.toLowerCase().includes(query)) ||
        (item.nome_local && item.nome_local.toLowerCase().includes(query)) ||
        (item.nome_area && item.nome_area.toLowerCase().includes(query))
      );
    }
    return list;
  });

  // Agrupamento por Obreiro (Perfil de Postos do Membro)
  obreirosPostosGrouped = computed(() => {
    const filtered = this.filteredEscalasPorPosto();
    const map = new Map<number, {
      id_obreiro: number;
      nome_obreiro: string;
      apelido_obreiro?: string;
      is_diacono: boolean;
      is_pulpito: boolean;
      total_geral: number;
      total_presencas: number;
      total_faltas: number;
      postos: {
        id_local: number;
        nome_local: string;
        id_area: number;
        nome_area: string;
        icone_area?: string;
        total: number;
        presencas: number;
        faltas: number;
        data_ultima?: string;
      }[];
    }>();

    for (const item of filtered) {
      if (!map.has(item.id_obreiro)) {
        map.set(item.id_obreiro, {
          id_obreiro: item.id_obreiro,
          nome_obreiro: item.nome_obreiro,
          apelido_obreiro: item.apelido_obreiro,
          is_diacono: item.is_diacono,
          is_pulpito: item.is_pulpito,
          total_geral: 0,
          total_presencas: 0,
          total_faltas: 0,
          postos: []
        });
      }

      const ob = map.get(item.id_obreiro)!;
      ob.total_geral += item.total_escalas_posto;
      ob.total_presencas += item.total_presencas || 0;
      ob.total_faltas += item.total_faltas || 0;

      const existingPosto = ob.postos.find(p => p.id_local === item.id_local);
      if (existingPosto) {
        existingPosto.total += item.total_escalas_posto;
        existingPosto.presencas += item.total_presencas || 0;
        existingPosto.faltas += item.total_faltas || 0;
        if (item.data_ultima_escala && (!existingPosto.data_ultima || item.data_ultima_escala > existingPosto.data_ultima)) {
          existingPosto.data_ultima = item.data_ultima_escala;
        }
      } else {
        ob.postos.push({
          id_local: item.id_local,
          nome_local: item.nome_local,
          id_area: item.id_area,
          nome_area: item.nome_area,
          icone_area: item.icone_area,
          total: item.total_escalas_posto,
          presencas: item.total_presencas || 0,
          faltas: item.total_faltas || 0,
          data_ultima: item.data_ultima_escala
        });
      }
    }

    const result = Array.from(map.values()).map(ob => {
      ob.postos.sort((a, b) => b.total - a.total);
      return ob;
    });

    return result.sort((a, b) => b.total_geral - a.total_geral);
  });

  // Agrupamento por Posto / Local (Equipe e Alocações do Posto)
  locaisObreirosGrouped = computed(() => {
    const filtered = this.filteredEscalasPorPosto();
    const map = new Map<number, {
      id_local: number;
      nome_local: string;
      id_area: number;
      nome_area: string;
      icone_area?: string;
      total_geral: number;
      total_presencas: number;
      total_faltas: number;
      obreiros: {
        id_obreiro: number;
        nome_obreiro: string;
        apelido_obreiro?: string;
        is_diacono: boolean;
        is_pulpito: boolean;
        total: number;
        presencas: number;
        faltas: number;
        data_ultima?: string;
      }[];
    }>();

    for (const item of filtered) {
      if (!map.has(item.id_local)) {
        map.set(item.id_local, {
          id_local: item.id_local,
          nome_local: item.nome_local,
          id_area: item.id_area,
          nome_area: item.nome_area,
          icone_area: item.icone_area,
          total_geral: 0,
          total_presencas: 0,
          total_faltas: 0,
          obreiros: []
        });
      }

      const loc = map.get(item.id_local)!;
      loc.total_geral += item.total_escalas_posto;
      loc.total_presencas += item.total_presencas || 0;
      loc.total_faltas += item.total_faltas || 0;

      const existingOb = loc.obreiros.find(o => o.id_obreiro === item.id_obreiro);
      if (existingOb) {
        existingOb.total += item.total_escalas_posto;
        existingOb.presencas += item.total_presencas || 0;
        existingOb.faltas += item.total_faltas || 0;
        if (item.data_ultima_escala && (!existingOb.data_ultima || item.data_ultima_escala > existingOb.data_ultima)) {
          existingOb.data_ultima = item.data_ultima_escala;
        }
      } else {
        loc.obreiros.push({
          id_obreiro: item.id_obreiro,
          nome_obreiro: item.nome_obreiro,
          apelido_obreiro: item.apelido_obreiro,
          is_diacono: item.is_diacono,
          is_pulpito: item.is_pulpito,
          total: item.total_escalas_posto,
          presencas: item.total_presencas || 0,
          faltas: item.total_faltas || 0,
          data_ultima: item.data_ultima_escala
        });
      }
    }

    const result = Array.from(map.values()).map(loc => {
      loc.obreiros.sort((a, b) => b.total - a.total);
      return loc;
    });

    return result.sort((a, b) => b.total_geral - a.total_geral);
  });

  // KPIs de Postos
  kpiPostos = computed(() => {
    const filtered = this.filteredEscalasPorPosto();
    const totalEscalas = filtered.reduce((acc, item) => acc + item.total_escalas_posto, 0);
    const postosDistintos = new Set(filtered.map(item => item.id_local)).size;
    const obreirosDistintos = new Set(filtered.map(item => item.id_obreiro)).size;

    const locGroup = this.locaisObreirosGrouped();
    const topPosto = locGroup.length > 0 ? locGroup[0] : null;

    const obGroup = this.obreirosPostosGrouped();
    const topObreiro = obGroup.length > 0 ? obGroup[0] : null;

    return {
      totalEscalas,
      postosDistintos,
      obreirosDistintos,
      topPostoNome: topPosto ? topPosto.nome_local : 'Nenhum',
      topPostoTotal: topPosto ? topPosto.total_geral : 0,
      topObreiroNome: topObreiro ? topObreiro.nome_obreiro : 'Nenhum',
      topObreiroTotal: topObreiro ? topObreiro.total_geral : 0,
      topObreiroPostosCount: topObreiro ? topObreiro.postos.length : 0
    };
  });

  async ngOnInit() {
    const meses = await this.mesService.fetchAll();
    const cur = findCurrentMes(meses);
    if (cur && cur.id_mes) {
      this.selectedMesId.set(cur.id_mes);
      this.selectedAno.set(cur.ano_referencia);
    }
    this.carregarDadosTab(this.activeTab());
  }

  setTab(tab: RelatorioTab) {
    this.activeTab.set(tab);
    this.searchQuery.set('');
    this.carregarDadosTab(tab);
  }

  setAssiduidadeModo(modo: 'mensal' | 'anual' | 'geral') {
    this.assiduidadeModo.set(modo);
    this.carregarDadosTab('assiduidade');
  }

  setPostosPeriodoModo(modo: 'mensal' | 'anual' | 'geral') {
    this.postosPeriodoModo.set(modo);
    this.carregarDadosTab('postos');
  }

  setPostosViewMode(mode: 'obreiros' | 'locais' | 'tabela') {
    this.postosViewMode.set(mode);
  }

  async carregarDadosTab(tab: RelatorioTab) {
    const mesId = this.selectedMesId() > 0 ? this.selectedMesId() : undefined;
    const ano = this.selectedAno();

    if (tab === 'assiduidade') {
      await Promise.all([
        this.relatorioService.fetchAssiduidadeMensal(mesId),
        this.relatorioService.fetchAssiduidadeAnual(ano),
        this.relatorioService.fetchAssiduidadeGeral()
      ]);
    } else if (tab === 'cobertura') {
      await this.relatorioService.fetchCoberturaEventos(mesId);
    } else if (tab === 'distribuicao') {
      await Promise.all([
        this.relatorioService.fetchDistribuicaoEventos(ano),
        this.relatorioService.fetchResumoPorDescricao(ano)
      ]);
    } else if (tab === 'postos') {
      const modo = this.postosPeriodoModo();
      if (modo === 'mensal') {
        await this.relatorioService.fetchEscalasPorPosto(undefined, mesId);
      } else if (modo === 'anual') {
        await this.relatorioService.fetchEscalasPorPosto(ano, undefined);
      } else {
        await this.relatorioService.fetchEscalasPorPosto(undefined, undefined);
      }
    } else if (tab === 'resumo') {
      await this.relatorioService.fetchResumoMensal();
    } else if (tab === 'conflitos') {
      await this.relatorioService.fetchConflitosBloqueio();
    }
  }

  onMesChange(mesId: number) {
    this.selectedMesId.set(Number(mesId));
    this.carregarDadosTab(this.activeTab());
  }

  onAnoChange(ano: number) {
    this.selectedAno.set(Number(ano));
    this.carregarDadosTab(this.activeTab());
  }

  getTurnoLabel(turno: number): string {
    return TURNO_LABELS[turno] || 'Geral';
  }

  getTurnoStyle(turno: number) {
    return TURNO_COLORS[turno] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
  }

  getTaxaBadgeClass(taxa: number | null): string {
    if (taxa === null || taxa === undefined) return 'bg-slate-800 text-slate-400 border-slate-700';
    if (taxa >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (taxa >= 60) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  getOcupacaoBadgeClass(taxa: number | null): string {
    if (taxa === null || taxa === undefined) return 'bg-slate-800 text-slate-400 border-slate-700';
    if (taxa >= 100) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (taxa >= 75) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }
}
