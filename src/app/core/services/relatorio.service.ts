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
  ConflitoBloqueio
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
}
