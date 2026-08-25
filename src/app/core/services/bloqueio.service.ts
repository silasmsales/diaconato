import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Bloqueio, CreateBloqueioDto, UpdateBloqueioDto } from '../models/bloqueio.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class BloqueioService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  bloqueios = signal<Bloqueio[]>([]);
  loading = signal<boolean>(false);

  async fetchAll(): Promise<Bloqueio[]> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('bloqueios')
        .select(`
          *,
          obreiros (*)
        `)
        .order('data', { ascending: true });

      if (error) throw error;
      const list = (data as Bloqueio[]) || [];
      this.bloqueios.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar bloqueios:', err);
      this.toast.error('Erro ao carregar bloqueios', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async createBatch(dtos: CreateBloqueioDto[]): Promise<Bloqueio[] | null> {
    if (dtos.length === 0) return [];
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('bloqueios')
        .insert(dtos)
        .select(`
          *,
          obreiros (*)
        `);

      if (error) throw error;
      const createdList = (data as Bloqueio[]) || [];
      this.bloqueios.update(list => [...list, ...createdList].sort((a, b) => a.data.localeCompare(b.data)));
      
      const count = createdList.length;
      this.toast.success(
        count > 1 ? `${count} bloqueios registrados!` : 'Bloqueio registrado!',
        'Indisponibilidade(s) cadastrada(s) com sucesso.'
      );
      return createdList;
    } catch (err: any) {
      console.error('Erro ao criar bloqueios em lote:', err);
      this.toast.error('Falha ao cadastrar bloqueio(s)', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async create(dto: CreateBloqueioDto): Promise<Bloqueio | null> {
    const list = await this.createBatch([dto]);
    return list && list.length > 0 ? list[0] : null;
  }

  async update(id: number, dto: UpdateBloqueioDto): Promise<Bloqueio | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('bloqueios')
        .update(dto)
        .eq('id_bloqueio', id)
        .select(`
          *,
          obreiros (*)
        `)
        .single();

      if (error) throw error;
      const updated = data as Bloqueio;
      this.bloqueios.update(list => list.map(item => item.id_bloqueio === id ? updated : item));
      this.toast.success('Bloqueio atualizado!', 'Alterações salvas com sucesso.');
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar bloqueio:', err);
      this.toast.error('Falha ao atualizar bloqueio', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('bloqueios')
        .delete()
        .eq('id_bloqueio', id);

      if (error) throw error;
      this.bloqueios.update(list => list.filter(item => item.id_bloqueio !== id));
      this.toast.success('Bloqueio removido', 'Registro excluído com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar bloqueio:', err);
      this.toast.error('Falha ao excluir bloqueio', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}