import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { TipoEvento, CreateTipoEventoDto, UpdateTipoEventoDto } from '../models/tipo-evento.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  tiposEvento = signal<TipoEvento[]>([]);
  loading = signal<boolean>(false);

  async fetchAll(): Promise<TipoEvento[]> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('tipo_evento')
        .select('*')
        .order('id_tipo_evento', { ascending: true });

      if (error) throw error;
      const list = (data as TipoEvento[]) || [];
      this.tiposEvento.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar tipos de evento:', err);
      this.toast.error('Erro ao carregar modelos de evento', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async create(dto: CreateTipoEventoDto): Promise<TipoEvento | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('tipo_evento')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;
      const created = data as TipoEvento;
      this.tiposEvento.update(list => [...list, created]);
      this.toast.success('Modelo criado!', `Modelo "${created.descricao_padrao}" cadastrado com sucesso.`);
      return created;
    } catch (err: any) {
      console.error('Erro ao criar modelo de evento:', err);
      this.toast.error('Falha ao cadastrar modelo', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: number, dto: UpdateTipoEventoDto): Promise<TipoEvento | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('tipo_evento')
        .update(dto)
        .eq('id_tipo_evento', id)
        .select()
        .single();

      if (error) throw error;
      const updated = data as TipoEvento;
      this.tiposEvento.update(list => list.map(item => item.id_tipo_evento === id ? updated : item));
      this.toast.success('Modelo atualizado!', `Modelo "${updated.descricao_padrao}" atualizado com sucesso.`);
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar modelo:', err);
      this.toast.error('Falha ao atualizar modelo', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('tipo_evento')
        .delete()
        .eq('id_tipo_evento', id);

      if (error) throw error;
      this.tiposEvento.update(list => list.filter(item => item.id_tipo_evento !== id));
      this.toast.success('Modelo removido', 'Modelo de evento excluído com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar modelo:', err);
      this.toast.error('Falha ao excluir modelo', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}