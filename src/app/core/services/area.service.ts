import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';
import { Area, CreateAreaDto, UpdateAreaDto } from '../models/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);

  areas = signal<Area[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.fetchAreas();
  }

  async fetchAreas(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabase
        .from('areas')
        .select('*')
        .order('id_area', { ascending: true });

      if (error) throw error;
      this.areas.set((data as Area[]) || []);
    } catch (err: any) {
      console.error('Erro ao buscar áreas:', err);
      this.error.set(err.message || 'Erro ao carregar áreas');
      this.toast.error('Erro', 'Não foi possível carregar as áreas de atuação.');
    } finally {
      this.loading.set(false);
    }
  }

  async createArea(dto: CreateAreaDto): Promise<Area | null> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('areas')
        .insert([{
          nome: dto.nome.trim(),
          descricao: dto.descricao?.trim() || null,
          icone: dto.icone || '📍',
          ativo: dto.ativo ?? true
        }])
        .select()
        .single();

      if (error) throw error;

      const newArea = data as Area;
      this.areas.update(prev => [...prev, newArea].sort((a, b) => a.id_area - b.id_area));
      this.toast.success('Sucesso', `Área "${newArea.nome}" cadastrada com sucesso!`);
      return newArea;
    } catch (err: any) {
      console.error('Erro ao criar área:', err);
      this.toast.error('Erro', err.message || 'Falha ao cadastrar área.');
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async updateArea(id: number, dto: UpdateAreaDto): Promise<Area | null> {
    this.loading.set(true);
    try {
      const payload: any = {};
      if (dto.nome !== undefined) payload.nome = dto.nome.trim();
      if (dto.descricao !== undefined) payload.descricao = dto.descricao?.trim() || null;
      if (dto.icone !== undefined) payload.icone = dto.icone;
      if (dto.ativo !== undefined) payload.ativo = dto.ativo;

      const { data, error } = await this.supabase
        .from('areas')
        .update(payload)
        .eq('id_area', id)
        .select()
        .single();

      if (error) throw error;

      const updated = data as Area;
      this.areas.update(prev => prev.map(item => item.id_area === id ? updated : item));
      this.toast.success('Atualizado', `Área "${updated.nome}" atualizada.`);
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar área:', err);
      this.toast.error('Erro', err.message || 'Falha ao atualizar área.');
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async deleteArea(id: number): Promise<boolean> {
    this.loading.set(true);
    try {
      const { error } = await this.supabase
        .from('areas')
        .delete()
        .eq('id_area', id);

      if (error) throw error;

      this.areas.update(prev => prev.filter(item => item.id_area !== id));
      this.toast.success('Excluído', 'Área removida com sucesso.');
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir área:', err);
      this.toast.error('Erro', err.message || 'Falha ao excluir área.');
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}
