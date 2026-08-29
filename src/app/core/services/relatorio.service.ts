import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';
import {
  AssiduidadeObreiro,
  AssiduidadeObreiroMensal,
  AssiduidadeObreiroAnual,
  CoberturaEvento,
  ResumoMensalDiaconato,
  DistribuicaoObreiroEvento,
  ResumoPorDescricaoEvento,
  ConflitoBloqueio,
  EscalaObreiroPosto
} from '../models/relatorios.model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  loading = signal<boolean>(false);
  assiduidadeGeral = signal<AssiduidadeObreiro[]>([]);
  assiduidadeMensal = signal<AssiduidadeObreiroMensal[]>([]);
  assiduidadeAnual = signal<AssiduidadeObreiroAnual[]>([]);
  coberturaEventos = signal<CoberturaEvento[]>([]);
  resumoMensal = signal<ResumoMensalDiaconato[]>([]);
  distribuicaoEventos = signal<DistribuicaoObreiroEvento[]>([]);
  resumoPorDescricao = signal<ResumoPorDescricaoEvento[]>([]);
  conflitosBloqueio = signal<ConflitoBloqueio[]>([]);
  escalasPorPosto = signal<EscalaObreiroPosto[]>([]);

  private async fetchAllPaginated<T>(buildQuery: (from: number, to: number) => any): Promise<T[]> {
    let allData: T[] = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await buildQuery(from, from + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allData = allData.concat(data as T[]);
      if (data.length < pageSize) break;
      from += pageSize;
    }
    return allData;
  }

  async fetchAssiduidadeGeral(): Promise<AssiduidadeObreiro[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<AssiduidadeObreiro>((from, to) =>
        this.supabase.from('vw_assiduidade_obreiros').select('*').range(from, to)
      );
      this.assiduidadeGeral.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar assiduidade geral:', err);
      this.toast.error('Erro ao carregar relatório de assiduidade', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchAssiduidadeMensal(idMes?: number): Promise<AssiduidadeObreiroMensal[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<AssiduidadeObreiroMensal>((from, to) => {
        let q = this.supabase.from('vw_assiduidade_obreiros_mensal').select('*');
        if (idMes) q = q.eq('id_mes', idMes);
        return q.range(from, to);
      });
      this.assiduidadeMensal.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar assiduidade mensal:', err);
      this.toast.error('Erro ao carregar assiduidade mensal', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchAssiduidadeAnual(ano?: number): Promise<AssiduidadeObreiroAnual[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<AssiduidadeObreiroAnual>((from, to) => {
        let q = this.supabase.from('vw_assiduidade_obreiros_anual').select('*');
        if (ano) q = q.eq('ano_referencia', ano);
        return q.range(from, to);
      });
      this.assiduidadeAnual.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar assiduidade anual:', err);
      this.toast.error('Erro ao carregar assiduidade anual', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchCoberturaEventos(idMes?: number): Promise<CoberturaEvento[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<CoberturaEvento>((from, to) => {
        let q = this.supabase.from('vw_cobertura_eventos').select('*');
        if (idMes) q = q.eq('id_mes', idMes);
        return q.range(from, to);
      });
      this.coberturaEventos.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar cobertura de eventos:', err);
      this.toast.error('Erro ao carregar cobertura de eventos', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchResumoMensal(): Promise<ResumoMensalDiaconato[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<ResumoMensalDiaconato>((from, to) =>
        this.supabase.from('vw_resumo_mensal_diaconato').select('*').range(from, to)
      );
      this.resumoMensal.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar resumo mensal:', err);
      this.toast.error('Erro ao carregar resumo mensal', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchDistribuicaoEventos(ano?: number): Promise<DistribuicaoObreiroEvento[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<DistribuicaoObreiroEvento>((from, to) => {
        let q = this.supabase.from('vw_distribuicao_obreiros_por_descricao_evento').select('*');
        if (ano) q = q.eq('ano_referencia', ano);
        return q.range(from, to);
      });
      this.distribuicaoEventos.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar distribuição anual por evento:', err);
      this.toast.error('Erro ao carregar distribuição de obreiros por evento', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchResumoPorDescricao(ano?: number): Promise<ResumoPorDescricaoEvento[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<ResumoPorDescricaoEvento>((from, to) => {
        let q = this.supabase.from('vw_resumo_por_descricao_evento').select('*');
        if (ano) q = q.eq('ano_referencia', ano);
        return q.range(from, to);
      });
      this.resumoPorDescricao.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar resumo por tipo de evento:', err);
      this.toast.error('Erro ao carregar resumo por evento', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchConflitosBloqueio(): Promise<ConflitoBloqueio[]> {
    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<ConflitoBloqueio>((from, to) =>
        this.supabase.from('vw_auditoria_conflitos_bloqueio').select('*').range(from, to)
      );
      this.conflitosBloqueio.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar conflitos de bloqueio:', err);
      this.toast.error('Erro ao auditar conflitos de escala', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchEscalasPorPosto(ano?: number, idMes?: number): Promise<EscalaObreiroPosto[]> {
    this.loading.set(true);
    try {
      // 1. Buscar com paginação completa da view SQL vw_escalas_obreiros_por_posto
      const list = await this.fetchAllPaginated<EscalaObreiroPosto>((from, to) => {
        let q = this.supabase.from('vw_escalas_obreiros_por_posto').select('*');
        if (idMes) {
          q = q.eq('id_mes', idMes);
        } else if (ano) {
          q = q.eq('ano_referencia', ano);
        }
        return q.range(from, to);
      });

      if (list.length > 0) {
        this.escalasPorPosto.set(list);
        return list;
      }

      // 2. Fallback resiliente com paginação caso a view ainda não esteja criada
      const rawEscalas = await this.fetchAllPaginated<any>((from, to) => {
        let escQuery = this.supabase
          .from('escala')
          .select(`
            id_escala,
            id_mes,
            checkin,
            mes:mes!inner(id_mes, mes_referencia, ano_referencia),
            obreiros:obreiros!inner(id_obreiro, nome, apelido, diacono, pulpito, ativo),
            locais:locais(id_local, nome, id_area, areas:areas(id_area, nome, icone)),
            eventos:eventos(data)
          `);

        if (idMes) {
          escQuery = escQuery.eq('id_mes', idMes);
        } else if (ano) {
          escQuery = escQuery.eq('mes.ano_referencia', ano);
        }
        return escQuery.range(from, to);
      });

      const groupMap = new Map<string, EscalaObreiroPosto>();

      for (const row of (rawEscalas as any[] || [])) {
        if (!row.obreiros || !row.obreiros.ativo) continue;
        const ob = row.obreiros;
        const loc = row.locais;
        const area = loc?.areas;
        const mes = row.mes;
        const evData = row.eventos?.data;

        const idLocal = loc?.id_local || 0;
        const nomeLocal = loc?.nome || 'Sem Posto Definido';
        const idArea = area?.id_area || 0;
        const nomeArea = area?.nome || 'Geral';
        const iconeArea = area?.icone || '📍';

        const key = `${ob.id_obreiro}_${idLocal}_${idMes ? mes?.id_mes : (ano ? mes?.ano_referencia : 'all')}`;

        if (!groupMap.has(key)) {
          groupMap.set(key, {
            ano_referencia: mes?.ano_referencia,
            id_mes: mes?.id_mes,
            mes_referencia: mes?.mes_referencia,
            id_obreiro: ob.id_obreiro,
            nome_obreiro: ob.nome,
            apelido_obreiro: ob.apelido,
            is_diacono: !!ob.diacono,
            is_pulpito: !!ob.pulpito,
            id_local: idLocal,
            nome_local: nomeLocal,
            id_area: idArea,
            nome_area: nomeArea,
            icone_area: iconeArea,
            total_escalas_posto: 0,
            total_presencas: 0,
            total_faltas: 0,
            total_pendentes: 0,
            data_ultima_escala: evData
          });
        }

        const item = groupMap.get(key)!;
        item.total_escalas_posto++;
        if (row.checkin === true) item.total_presencas!++;
        else if (row.checkin === false) item.total_faltas!++;
        else item.total_pendentes!++;

        if (evData && (!item.data_ultima_escala || evData > item.data_ultima_escala)) {
          item.data_ultima_escala = evData;
        }
      }

      const fallbackList = Array.from(groupMap.values()).sort((a, b) => {
        const cmp = a.nome_obreiro.localeCompare(b.nome_obreiro);
        if (cmp !== 0) return cmp;
        return b.total_escalas_posto - a.total_escalas_posto;
      });

      this.escalasPorPosto.set(fallbackList);
      return fallbackList;
    } catch (err: any) {
      console.error('Erro ao buscar escalas por posto:', err);
      this.toast.error('Erro ao carregar relatório de postos', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }
}
