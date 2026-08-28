import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Escala, CreateEscalaDto } from '../models/escala.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EscalaService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  escalas = signal<Escala[]>([]);
  loading = signal<boolean>(false);

  // Cache em memória indexado por id_mes para carregamento instantâneo
  private mesCache = new Map<number, Escala[]>();

  async fetchByMes(idMes: number, forceRefresh: boolean = false): Promise<Escala[]> {
    if (!forceRefresh && this.mesCache.has(idMes)) {
      const cached = this.mesCache.get(idMes)!;
      this.escalas.set(cached);
      return cached;
    }

    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('escala')
        .select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `)
        .eq('id_mes', idMes)
        .order('id_escala', { ascending: true })
        .limit(2000);

      if (error) throw error;
      const list = (data as Escala[]) || [];
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
