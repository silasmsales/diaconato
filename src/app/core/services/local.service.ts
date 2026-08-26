import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';
import { Local, CreateLocalDto, UpdateLocalDto } from '../models/local.model';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  locais = signal<Local[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.fetchLocais();
  }

  async fetchLocais(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabase
        .from('locais')
        .select('*')
        .order('area', { ascending: true })
        .order('ordem', { ascending: true })
        .order('nome', { ascending: true });

      if (error) throw error;
      this.locais.set(data as Local[] || []);
    } catch (err: any) {
      console.error('Erro ao buscar locais:', err);
      this.error.set(err.message || 'Erro ao carregar locais');
      this.toast.error('Erro', 'Não foi possível carregar os locais de atuação.');
    } finally {
      this.loading.set(false);
    }
  }

  async createLocal(dto: CreateLocalDto): Promise<Local | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('locais')
        .insert([{
          nome: dto.nome.trim(),
          area: dto.area.trim(),
          descricao: dto.descricao?.trim() || null,
          ordem: dto.ordem ?? 0,
          ativo: dto.ativo ?? true
        }])
        .select()
        .single();

      if (error) throw error;

      const newLocal = data as Local;
      this.locais.update(prev => [...prev, newLocal]);
      this.toast.success('Sucesso', `Local "${newLocal.nome}" cadastrado com sucesso!`);
      return newLocal;
    } catch (err: any) {
      console.error('Erro ao criar local:', err);
      this.toast.error('Erro', err.message || 'Falha ao cadastrar local.');
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async updateLocal(id: number, dto: UpdateLocalDto): Promise<Local | null> {
    this.loading.set(true);
    try {
      const payload: any = {};
      if (dto.nome !== undefined) payload.nome = dto.nome.trim();
      if (dto.area !== undefined) payload.area = dto.area.trim();
      if (dto.descricao !== undefined) payload.descricao = dto.descricao?.trim() || null;
      if (dto.ordem !== undefined) payload.ordem = dto.ordem;
      if (dto.ativo !== undefined) payload.ativo = dto.ativo;

      const { data, error } = await this.supabase
        .from('locais')
        .update(payload)
        .eq('id_local', id)
        .select()
        .single();

      if (error) throw error;

      const updated = data as Local;
      this.locais.update(prev => prev.map(item => item.id_local === id ? updated : item));
      this.toast.success('Atualizado', `Local "${updated.nome}" atualizado.`);
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar local:', err);
      this.toast.error('Erro', err.message || 'Falha ao atualizar local.');
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async toggleAtivo(local: Local): Promise<void> {
    const novoStatus = !local.ativo;
    try {
      const { error } = await this.supabase
        .from('locais')
        .update({ ativo: novoStatus })
        .eq('id_local', local.id_local);

      if (error) throw error;

      this.locais.update(prev =>
        prev.map(item => item.id_local === local.id_local ? { ...item, ativo: novoStatus } : item)
      );
      this.toast.info('Status Alterado', `Local marcado como ${novoStatus ? 'Ativo' : 'Inativo'}.`);
    } catch (err: any) {
      console.error('Erro ao alterar status do local:', err);
      this.toast.error('Erro', 'Não foi possível alterar o status do local.');
    }
  }

  async deleteLocal(id: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('locais')
        .delete()
        .eq('id_local', id);

      if (error) throw error;

      this.locais.update(prev => prev.filter(item => item.id_local !== id));
      this.toast.success('Excluído', 'Local removido com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir local:', err);
      this.toast.error('Erro', err.message || 'Falha ao excluir local.');
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}
