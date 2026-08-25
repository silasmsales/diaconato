import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RelatorioService } from '../../core/services/relatorio.service';
import { MesService } from '../../core/services/mes.service';
import { formatMesReferencia, findCurrentMes } from '../../core/models/mes.model';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';

export type RelatorioTab = 'assiduidade' | 'cobertura' | 'distribuicao' | 'resumo' | 'conflitos';

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
