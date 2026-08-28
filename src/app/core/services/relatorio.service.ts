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

  async fetchAssiduidadeGeral(): Promise<AssiduidadeObreiro[]> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('vw_assiduidade_obreiros')
        .select('*');
      if (error) throw error;
      const list = (data as AssiduidadeObreiro[]) || [];
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
      let query = this.supabase.from('vw_assiduidade_obreiros_mensal').select('*');
      if (idMes) {
        query = query.eq('id_mes', idMes);
      }
      const { data, error } = await query;
      if (error) throw error;
      const list = (data as AssiduidadeObreiroMensal[]) || [];
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
      let query = this.supabase.from('vw_assiduidade_obreiros_anual').select('*');
      if (ano) {
        query = query.eq('ano_referencia', ano);
      }
      const { data, error } = await query;
      if (error) throw error;
      const list = (data as AssiduidadeObreiroAnual[]) || [];
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
      let query = this.supabase.from('vw_cobertura_eventos').select('*');
      if (idMes) {
        query = query.eq('id_mes', idMes);
      }
      const { data, error } = await query;
      if (error) throw error;
      const list = (data as CoberturaEvento[]) || [];
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
      const { data, error } = await this.supabase
        .from('vw_resumo_mensal_diaconato')
        .select('*');
      if (error) throw error;
      const list = (data as ResumoMensalDiaconato[]) || [];
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
      let query = this.supabase.from('vw_distribuicao_obreiros_por_descricao_evento').select('*');
      if (ano) {
        query = query.eq('ano_referencia', ano);
      }
      const { data, error } = await query;
      if (error) throw error;
      const list = (data as DistribuicaoObreiroEvento[]) || [];
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
      let query = this.supabase.from('vw_resumo_por_descricao_evento').select('*');
      if (ano) {
        query = query.eq('ano_referencia', ano);
      }
      const { data, error } = await query;
      if (error) throw error;
      const list = (data as ResumoPorDescricaoEvento[]) || [];
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
      const { data, error } = await this.supabase
        .from('vw_auditoria_conflitos_bloqueio')
        .select('*');
      if (error) throw error;
      const list = (data as ConflitoBloqueio[]) || [];
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
      // 1. Tentar buscar diretamente da view SQL vw_escalas_obreiros_por_posto
      let query = this.supabase.from('vw_escalas_obreiros_por_posto').select('*');
      if (idMes) {
        query = query.eq('id_mes', idMes);
      } else if (ano) {
        query = query.eq('ano_referencia', ano);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const list = (data as EscalaObreiroPosto[]) || [];
        this.escalasPorPosto.set(list);
        return list;
      }

      // 2. Fallback resiliente: agrega diretamente da tabela escala com relacionamentos
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

      const { data: rawEscalas, error: escErr } = await escQuery;
      if (escErr) throw escErr;

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

      const list = Array.from(groupMap.values()).sort((a, b) => {
        const cmp = a.nome_obreiro.localeCompare(b.nome_obreiro);
        if (cmp !== 0) return cmp;
        return b.total_escalas_posto - a.total_escalas_posto;
      });

      this.escalasPorPosto.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar escalas por posto:', err);
      this.toast.error('Erro ao carregar relatório de postos', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }
}
