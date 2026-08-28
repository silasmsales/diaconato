import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Evento, CreateEventoDto, UpdateEventoDto } from '../models/evento.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  eventos = signal<Evento[]>([]);
  loading = signal<boolean>(false);

  async fetchAll(): Promise<Evento[]> {
    this.loading.set(true);
    try {
      const allData: Evento[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await this.supabase
          .from('eventos')
          .select(`
            *,
            mes (*)
          `)
          .order('data', { ascending: true })
          .order('turno', { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allData.push(...(data as Evento[]));
          if (data.length < pageSize) {
            hasMore = false;
          } else {
            from += pageSize;
          }
        } else {
          hasMore = false;
        }
      }

      this.eventos.set(allData);
      return allData;
    } catch (err: any) {
      console.error('Erro ao buscar eventos:', err);
      this.toast.error('Erro ao carregar eventos', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async fetchByMes(idMes: number): Promise<Evento[]> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('eventos')
        .select(`
          *,
          mes (*)
        `)
        .eq('id_mes', idMes)
        .order('data', { ascending: true })
        .order('turno', { ascending: true });

      if (error) throw error;
      const list = (data as Evento[]) || [];
      this.eventos.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar eventos por mês:', err);
      this.toast.error('Erro ao carregar eventos do mês', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async create(dto: CreateEventoDto): Promise<Evento | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('eventos')
        .insert([dto])
        .select(`
          *,
          mes (*)
        `)
        .single();

      if (error) throw error;
      const created = data as Evento;
      this.eventos.update(list => [...list, created].sort((a, b) => {
        const d = (a.data || '').localeCompare(b.data || '');
        if (d !== 0) return d;
        return (a.turno || 0) - (b.turno || 0);
      }));
      this.toast.success('Evento criado!', `${created.descricao || 'Novo culto/evento'} registrado com sucesso.`);
      return created;
    } catch (err: any) {
      console.error('Erro ao criar evento:', err);
      this.toast.error('Falha ao cadastrar evento', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: number, dto: UpdateEventoDto): Promise<Evento | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('eventos')
        .update(dto)
        .eq('id_evento', id)
        .select(`
          *,
          mes (*)
        `)
        .single();

      if (error) throw error;
      const updated = data as Evento;
      this.eventos.update(list => list.map(item => item.id_evento === id ? updated : item));
      this.toast.success('Evento atualizado!', 'Dados do culto/evento salvos.');
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar evento:', err);
      this.toast.error('Falha ao atualizar evento', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  
  async saveGeneratedEvents(idMes: number, dtos: CreateEventoDto[], replaceExisting: boolean = true): Promise<boolean> {
    this.loading.set(true);
    try {
      if (replaceExisting) {
        // Remover eventos anteriores deste mês (cascade remove escalas relacionadas)
        const { error: delError } = await this.supabase
          .from('eventos')
          .delete()
          .eq('id_mes', idMes);

        if (delError) throw delError;
      }

      if (dtos.length > 0) {
        const { data, error: insError } = await this.supabase
          .from('eventos')
          .insert(dtos)
          .select(`
            *,
            mes (*)
          `);

        if (insError) throw insError;
      }

      // Atualizar lista local
      await this.fetchByMes(idMes);
      this.toast.success('Cultos e Eventos Gerados!', `${dtos.length} cultos foram criados com sucesso para o mês.`);
      return true;
    } catch (err: any) {
      console.error('Erro ao salvar eventos gerados:', err);
      this.toast.error('Falha ao gerar eventos', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('eventos')
        .delete()
        .eq('id_evento', id);

      if (error) throw error;
      this.eventos.update(list => list.filter(item => item.id_evento !== id));
      this.toast.success('Evento removido', 'Culto/evento excluído com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar evento:', err);
      this.toast.error('Falha ao excluir evento', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}

