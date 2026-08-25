import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Obreiro, CreateObreiroDto, UpdateObreiroDto } from '../models/obreiro.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ObreiroService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  obreiros = signal<Obreiro[]>([]);
  loading = signal<boolean>(false);

  async fetchAll(): Promise<Obreiro[]> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('obreiros')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      const list = (data as Obreiro[]) || [];
      this.obreiros.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar obreiros:', err);
      this.toast.error('Erro ao carregar obreiros', err.message || 'Verifique a conexão');
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async getById(id: number): Promise<Obreiro | null> {
    try {
      const { data, error } = await this.supabase
        .from('obreiros')
        .select('*')
        .eq('id_obreiro', id)
        .single();

      if (error) throw error;
      return data as Obreiro;
    } catch (err: any) {
      console.error('Erro ao buscar obreiro:', err);
      this.toast.error('Erro ao buscar obreiro', err.message);
      return null;
    }
  }

  async create(dto: CreateObreiroDto): Promise<Obreiro | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('obreiros')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;
      const created = data as Obreiro;
      this.obreiros.update(list => [...list, created].sort((a, b) => a.nome.localeCompare(b.nome)));
      this.toast.success('Obreiro cadastrado!', `${created.nome} foi adicionado(a) com sucesso.`);
      return created;
    } catch (err: any) {
      console.error('Erro ao criar obreiro:', err);
      this.toast.error('Falha ao cadastrar obreiro', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: number, dto: UpdateObreiroDto): Promise<Obreiro | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('obreiros')
        .update(dto)
        .eq('id_obreiro', id)
        .select()
        .single();

      if (error) throw error;
      const updated = data as Obreiro;
      this.obreiros.update(list => list.map(item => item.id_obreiro === id ? updated : item));
      this.toast.success('Obreiro atualizado!', `Dados de ${updated.nome} foram salvos.`);
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar obreiro:', err);
      this.toast.error('Falha ao atualizar obreiro', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('obreiros')
        .delete()
        .eq('id_obreiro', id);

      if (error) throw error;
      this.obreiros.update(list => list.filter(item => item.id_obreiro !== id));
      this.toast.success('Obreiro removido', 'Registro excluído com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar obreiro:', err);
      this.toast.error('Falha ao excluir obreiro', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}
