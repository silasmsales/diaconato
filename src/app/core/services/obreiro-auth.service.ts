import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';
import { Obreiro } from '../models/obreiro.model';

const OBREIRO_STORAGE_KEY = 'diaconato_obreiro_session';

@Injectable({
  providedIn: 'root'
})
export class ObreiroAuthService {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);
  private toast = inject(ToastService);

  currentObreiro = signal<Obreiro | null>(null);
  loading = signal<boolean>(false);

  isAuthenticated = computed(() => !!this.currentObreiro());

  constructor() {
    this.initSession();
  }

  private initSession(): void {
    try {
      const saved = localStorage.getItem(OBREIRO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Obreiro;
        if (parsed && parsed.id_obreiro) {
          this.currentObreiro.set(parsed);
          // Atualiza dados em segundo plano
          this.refreshObreiroData(parsed.id_obreiro);
        }
      }
    } catch (e) {
      console.warn('Erro ao restaurar sessão do obreiro:', e);
      localStorage.removeItem(OBREIRO_STORAGE_KEY);
    }
  }

  async refreshObreiroData(idObreiro: number): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from('obreiros')
        .select('*')
        .eq('id_obreiro', idObreiro)
        .eq('ativo', true)
        .maybeSingle();

      if (!error && data) {
        this.currentObreiro.set(data as Obreiro);
        localStorage.setItem(OBREIRO_STORAGE_KEY, JSON.stringify(data));
      } else if (!data) {
        // Obreiro desativado ou removido
        this.logout();
      }
    } catch (e) {
      console.warn('Erro ao atualizar dados do obreiro:', e);
    }
  }

  /**
   * Realiza login usando email e data de nascimento (formato YYYY-MM-DD ou DD/MM/YYYY)
   */
  async login(email: string, dataNascimento: string): Promise<boolean> {
    this.loading.set(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      let cleanDate = dataNascimento.trim();

      // Se inserido como DD/MM/YYYY, converte para YYYY-MM-DD
      if (cleanDate.includes('/')) {
        const parts = cleanDate.split('/');
        if (parts.length === 3) {
          cleanDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      const { data, error } = await this.supabase
        .from('obreiros')
        .select('*')
        .ilike('email', cleanEmail)
        .eq('data_nascimento', cleanDate)
        .eq('ativo', true)
        .maybeSingle();

      if (error) {
        console.error('Erro na consulta de login do obreiro:', error);
        this.toast.error('Erro de Acesso', 'Ocorreu uma falha ao verificar suas credenciais.');
        return false;
      }

      if (!data) {
        this.toast.error(
          'Acesso Negado',
          'Nenhum obreiro ativo foi encontrado com este e-mail e data de nascimento.'
        );
        return false;
      }

      // Encerra qualquer sessão administrativa ativa para garantir exclusividade mútua
      try {
        await this.supabase.auth.signOut();
      } catch (_) {}

      const obreiro = data as Obreiro;
      this.currentObreiro.set(obreiro);
      localStorage.setItem(OBREIRO_STORAGE_KEY, JSON.stringify(obreiro));

      this.toast.success(
        `Bem-vindo(a), ${obreiro.nome}!`,
        'Acesso ao Portal do Obreiro realizado com sucesso.'
      );
      this.router.navigate(['/portal']);
      return true;
    } catch (err: any) {
      console.error('Erro inesperado no login do obreiro:', err);
      this.toast.error('Erro Inesperado', 'Não foi possível completar o login.');
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    this.currentObreiro.set(null);
    localStorage.removeItem(OBREIRO_STORAGE_KEY);
    this.toast.info('Sessão Encerrada', 'Você saiu do Portal do Obreiro.');
    this.router.navigate(['/portal/login']);
  }
}
