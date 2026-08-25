import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Mes, CreateMesDto, UpdateMesDto, formatMesReferencia } from '../models/mes.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class MesService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  meses = signal<Mes[]>([]);
  loading = signal<boolean>(false);

  async fetchAll(): Promise<Mes[]> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('mes')
        .select('*')
        .order('ano_referencia', { ascending: false })
        .order('mes_referencia', { ascending: false });

      if (error) throw error;
      const list = (data as Mes[]) || [];
      this.meses.set(list);
      return list;
    } catch (err: any) {
      console.error('Erro ao buscar meses:', err);
      this.toast.error('Erro ao carregar meses de referência', err.message);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  async create(dto: CreateMesDto): Promise<Mes | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('mes')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;
      const created = data as Mes;
      this.meses.update(list => [created, ...list].sort((a, b) => {
        if (b.ano_referencia !== a.ano_referencia) return b.ano_referencia - a.ano_referencia;
        return b.mes_referencia - a.mes_referencia;
      }));
      this.toast.success('Mês cadastrado!', `Período ${formatMesReferencia(created)} adicionado.`);
      return created;
    } catch (err: any) {
      console.error('Erro ao criar mês:', err);
      this.toast.error('Falha ao cadastrar mês', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: number, dto: UpdateMesDto): Promise<Mes | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('mes')
        .update(dto)
        .eq('id_mes', id)
        .select()
        .single();

      if (error) throw error;
      const updated = data as Mes;
      this.meses.update(list => list.map(item => item.id_mes === id ? updated : item));
      this.toast.success('Mês atualizado!', `Período ${formatMesReferencia(updated)} atualizado.`);
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar mês:', err);
      this.toast.error('Falha ao atualizar mês', err.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('mes')
        .delete()
        .eq('id_mes', id);

      if (error) throw error;
      this.meses.update(list => list.filter(item => item.id_mes !== id));
      this.toast.success('Mês removido', 'Registro excluído com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar mês:', err);
      this.toast.error('Falha ao excluir mês', err.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}