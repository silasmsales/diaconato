import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Escala, CreateEscalaDto } from '../models/escala.model';
import { ToastService } from './toast.service';

export interface TaxaPresencaTipoCulto {
  total: number;
  presencas: number;
  faltas: number;
  pendentes: number;
  pct: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class EscalaService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  escalas = signal<Escala[]>([]);
  taxasPresencaTipoMap = signal<Map<string, TaxaPresencaTipoCulto>>(new Map());
  loading = signal<boolean>(false);

  // Cache em memória indexado por id_mes para carregamento instantâneo
  private mesCache = new Map<number, Escala[]>();

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

  async fetchTaxasPresencaPorTipoEvento(ano?: number): Promise<Map<string, TaxaPresencaTipoCulto>> {
    const targetAno = ano || new Date().getFullYear();
    try {
      const map = new Map<string, TaxaPresencaTipoCulto>();

      // 1. Tenta buscar da view vw_distribuicao_obreiros_por_descricao_evento filtrando pelo ano
      try {
        const viewData = await this.fetchAllPaginated<any>((from, to) =>
          this.supabase
            .from('vw_distribuicao_obreiros_por_descricao_evento')
            .select('*')
            .eq('ano_referencia', targetAno)
            .range(from, to)
        );

        if (viewData && viewData.length > 0) {
          for (const row of viewData) {
            const key = `${row.id_obreiro}_${(row.descricao_evento || '').trim().toLowerCase()}`;
            const curr = map.get(key) || { total: 0, presencas: 0, faltas: 0, pendentes: 0, pct: null };
            curr.total += Number(row.total_escalas_no_ano || 0);
            curr.presencas += Number(row.total_presencas || 0);
            curr.faltas += Number(row.total_faltas || 0);
            curr.pendentes += Number(row.total_pendentes || 0);
            const concluidas = curr.presencas + curr.faltas;
            curr.pct = concluidas > 0 ? Math.round((curr.presencas / concluidas) * 100) : null;
            map.set(key, curr);
          }
          this.taxasPresencaTipoMap.set(map);
          return map;
        }
      } catch (errView) {
        console.warn('View vw_distribuicao_obreiros_por_descricao_evento não disponível, usando fallback:', errView);
      }

      // 2. Fallback direto da tabela escala com paginação segura e filtro do ano
      const rawEscalas = await this.fetchAllPaginated<any>((from, to) =>
        this.supabase
          .from('escala')
          .select(`
            id_obreiro,
            checkin,
            eventos!inner(descricao, data)
          `)
          .gte('eventos.data', `${targetAno}-01-01`)
          .lte('eventos.data', `${targetAno}-12-31`)
          .range(from, to)
      );

      if (rawEscalas && rawEscalas.length > 0) {
        for (const row of rawEscalas) {
          if (!row.id_obreiro || !row.eventos?.descricao) continue;
          const key = `${row.id_obreiro}_${(row.eventos.descricao || '').trim().toLowerCase()}`;
          const curr = map.get(key) || { total: 0, presencas: 0, faltas: 0, pendentes: 0, pct: null };
          curr.total++;
          if (row.checkin === true) curr.presencas++;
          else if (row.checkin === false) curr.faltas++;
          else curr.pendentes++;
          const concluidas = curr.presencas + curr.faltas;
          curr.pct = concluidas > 0 ? Math.round((curr.presencas / concluidas) * 100) : null;
          map.set(key, curr);
        }
        this.taxasPresencaTipoMap.set(map);
        return map;
      }

      this.taxasPresencaTipoMap.set(map);
      return map;
    } catch (err) {
      console.error('Erro ao buscar taxas de presença por tipo de evento:', err);
      return new Map();
    }
  }

  async fetchByMes(idMes: number, forceRefresh: boolean = false): Promise<Escala[]> {
    if (!forceRefresh && this.mesCache.has(idMes)) {
      const cached = this.mesCache.get(idMes)!;
      this.escalas.set(cached);
      return cached;
    }

    this.loading.set(true);
    try {
      const list = await this.fetchAllPaginated<Escala>((from, to) =>
        this.supabase
          .from('escala')
          .select(`
            *,
            eventos (*),
            obreiros (*),
            mes (*)
          `)
          .eq('id_mes', idMes)
          .order('id_escala', { ascending: true })
          .range(from, to)
      );

      this.mesCache.set(idMes, list);
      this.escalas.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar escala do mês:', err);
      this.toast.error('Erro ao carregar escala', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchAll(): Promise<Escala[]> {
    this.loading.set(true);
    try {
      const allData: Escala[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await this.supabase
          .from('escala')
          .select(`
            *,
            eventos (*),
            obreiros (*),
            mes (*)
          `)
          .order('id_escala', { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allData.push(...(data as Escala[]));
          if (data.length < pageSize) {
            hasMore = false;
          } else {
            from += pageSize;
          }
        } else {
          hasMore = false;
        }
      }

      // Atualizar cache de cada mês carregado
      const groupedByMes = new Map<number, Escala[]>();
      for (const item of allData) {
        if (item.id_mes) {
          if (!groupedByMes.has(item.id_mes)) groupedByMes.set(item.id_mes, []);
          groupedByMes.get(item.id_mes)!.push(item);
        }
      }
      for (const [mId, list] of groupedByMes.entries()) {
        this.mesCache.set(mId, list);
      }

      this.escalas.set(allData);
      return allData;
    } catch (err: any) {
      console.error('Erro ao buscar todas as escalas:', err);
      this.toast.error('Erro ao carregar escalas', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async addObreiroToEvento(dto: CreateEscalaDto): Promise<Escala | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('escala')
        .insert([dto])
        .select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `)
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          this.toast.warning('Obreiro já escalado', 'Este obreiro já faz parte da escala deste evento.');
          return null;
        }
        throw error;
      }
      const created = data as Escala;
      this.escalas.update(list => [...list, created]);
      if (created.id_mes && this.mesCache.has(created.id_mes)) {
        this.mesCache.set(created.id_mes, [...this.mesCache.get(created.id_mes)!, created]);
      }
      this.toast.success('Obreiro escalado!', 'Inclusão na escala realizada com sucesso.');
      return created;
    } catch (err: any) {
      console.error('Erro ao escalar obreiro:', err);
      this.toast.error('Falha ao adicionar na escala', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async addMultipleObreirosToEvento(dtos: CreateEscalaDto[]): Promise<Escala[]> {
    if (!dtos || dtos.length === 0) return [];
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('escala')
        .insert(dtos)
        .select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `);

      if (error) {
        if (error.code === '23505') {
          this.toast.warning('Atenção', 'Um ou mais obreiros selecionados já estavam escalados neste evento.');
        } else {
          throw error;
        }
      }

      const createdList = (data as Escala[]) || [];
      if (createdList.length > 0) {
        this.escalas.update(list => [...list, ...createdList]);
        const mId = dtos[0].id_mes;
        if (mId && this.mesCache.has(mId)) {
          this.mesCache.set(mId, [...(this.mesCache.get(mId) || []), ...createdList]);
        }
        this.toast.success('Obreiros escalados!', `${createdList.length} ${createdList.length === 1 ? 'obreiro foi adicionado' : 'obreiros foram adicionados'} à escala.`);
      }
      return createdList;
    } catch (err: any) {
      console.error('Erro ao escalar múltiplos obreiros:', err);
      this.toast.error('Erro ao escalar', err.message || 'Falha ao incluir obreiros na escala.');
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async updateCheckin(idEscala: number, checkin: boolean | null): Promise<Escala | null> {
    try {
      const { data, error } = await this.supabase
        .from('escala')
        .update({ checkin })
        .eq('id_escala', idEscala)
        .select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `)
        .single();

      if (error) throw error;
      const updated = data as Escala;
      this.escalas.update(list => list.map(item => item.id_escala === idEscala ? updated : item));
      if (updated.id_mes && this.mesCache.has(updated.id_mes)) {
        this.mesCache.set(
          updated.id_mes,
          this.mesCache.get(updated.id_mes)!.map(item => item.id_escala === idEscala ? updated : item)
        );
      }
      
      const statusText = checkin === true ? 'Presente ✅' : (checkin === false ? 'Ausente ❌' : 'Pendente ⏳');
      this.toast.success('Check-in atualizado', `Status alterado para: ${statusText}`);
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar check-in:', err);
      this.toast.error('Falha ao registrar check-in', err.message);
      return null;
    }
  }

  async substituirObreiro(idEscala: number, novoIdObreiro: number): Promise<Escala | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('escala')
        .update({ 
          id_obreiro: novoIdObreiro,
          checkin: null // redefinir check-in para pendente
        })
        .eq('id_escala', idEscala)
        .select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `)
        .single();

      if (error) {
        if (error.code === '23505') {
          this.toast.warning('Obreiro já escalado', 'Este obreiro substituto já faz parte da escala deste culto.');
          return null;
        }
        throw error;
      }

      const updated = data as Escala;
      this.escalas.update(list => list.map(item => item.id_escala === idEscala ? updated : item));
      if (updated.id_mes && this.mesCache.has(updated.id_mes)) {
        this.mesCache.set(
          updated.id_mes,
          this.mesCache.get(updated.id_mes)!.map(item => item.id_escala === idEscala ? updated : item)
        );
      }
      this.toast.success('Substituição realizada!', `Obreiro substituído com sucesso por ${updated.obreiros?.nome}.`);
      return updated;
    } catch (err: any) {
      console.error('Erro ao substituir obreiro:', err);
      this.toast.error('Falha ao substituir obreiro', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async saveGeneratedSchedule(idMes: number, dtos: CreateEscalaDto[], replaceExisting: boolean = true): Promise<boolean> {
    this.loading.set(true);
    try {
      if (replaceExisting) {
        // Remover escalas anteriores deste mês
        const { error: delError } = await this.supabase
          .from('escala')
          .delete()
          .eq('id_mes', idMes);

        if (delError) throw delError;
      }

      if (dtos.length > 0) {
        const { data, error: insError } = await this.supabase
          .from('escala')
          .insert(dtos)
          .select(`
            *,
            eventos (*),
            obreiros (*),
            mes (*)
          `);

        if (insError) throw insError;
      }

      // Atualizar cache do mês gerado com os dados frescos
      await this.fetchByMes(idMes, true);
      this.toast.success('Escala Mensal Gerada!', `${dtos.length} escalas foram gravadas com sucesso.`);
      return true;
    } catch (err: any) {
      console.error('Erro ao salvar escala gerada:', err);
      this.toast.error('Falha ao salvar escala', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async removeObreiroFromEvento(idEscala: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('escala')
        .delete()
        .eq('id_escala', idEscala);

      if (error) throw error;
      this.escalas.update(list => list.filter(item => item.id_escala !== idEscala));
      this.mesCache.clear();
      this.toast.success('Escala atualizada', 'Obreiro desescalado com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao remover da escala:', err);
      this.toast.error('Falha ao remover da escala', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}
