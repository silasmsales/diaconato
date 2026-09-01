import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { ObreiroAuthService } from '../../core/services/obreiro-auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Obreiro } from '../../core/models/obreiro.model';

@Component({
  selector: 'app-portal-contatos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-contatos.component.html'
})
export class PortalContatosComponent implements OnInit {
  private supabase = inject(SupabaseService).client;
  private toast = inject(ToastService);
  public obreiroAuth = inject(ObreiroAuthService);

  loading = signal<boolean>(true);
  obreiros = signal<Obreiro[]>([]);
  searchQuery = signal<string>('');
  filtroFuncao = signal<'TODOS' | 'DIACONOS' | 'LIDERES' | 'PULPITO'>('TODOS');

  // Lista Filtrada
  obreirosFiltrados = computed(() => {
    const list = this.obreiros();
    const query = this.searchQuery().toLowerCase().trim();
    const funcao = this.filtroFuncao();

    return list.filter(ob => {
      // Filtro por Função
      if (funcao === 'DIACONOS' && !ob.diacono) return false;
      if (funcao === 'LIDERES' && !ob.lider) return false;
      if (funcao === 'PULPITO' && !ob.pulpito) return false;

      // Filtro por Busca de Texto
      if (query) {
        const nome = (ob.nome || '').toLowerCase();
        const apelido = (ob.apelido || '').toLowerCase();
        const tel = (ob.telefone || '').replace(/\D/g, '');
        const email = (ob.email || '').toLowerCase();
        const cleanQuery = query.replace(/\D/g, '');

        const matchNome = nome.includes(query);
        const matchApelido = apelido.includes(query);
        const matchEmail = email.includes(query);
        const matchTel = cleanQuery ? tel.includes(cleanQuery) : false;

        if (!matchNome && !matchApelido && !matchEmail && !matchTel) {
          return false;
        }
      }

      return true;
    });
  });

  // Estatísticas
  totalAtivos = computed(() => this.obreiros().length);
  totalDiaconos = computed(() => this.obreiros().filter(o => o.diacono).length);
  totalLideres = computed(() => this.obreiros().filter(o => o.lider).length);

  async ngOnInit() {
    await this.carregarContatos();
  }

  async carregarContatos() {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('obreiros')
        .select('id_obreiro, nome, apelido, telefone, email, diacono, pulpito, lider, ativo, foto')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) throw error;
      this.obreiros.set((data as Obreiro[]) || []);
    } catch (err: any) {
      console.error('Erro ao carregar contatos de obreiros:', err);
      this.toast.error('Erro', 'Não foi possível carregar a lista de contatos.');
    } finally {
      this.loading.set(false);
    }
  }

  getInitials(name?: string): string {
    if (!name) return 'OB';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getCleanWhatsAppNumber(phone?: string | null): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10 || digits.length === 11) {
      return `55${digits}`;
    }
    if (digits.startsWith('55')) {
      return digits;
    }
    return `55${digits}`;
  }

  getFormattedPhone(phone?: string | null): string {
    if (!phone) return 'Telefone não informado';
    const d = phone.replace(/\D/g, '');
    if (d.length === 11) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 7)}-${d.substring(7)}`;
    }
    if (d.length === 10) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 6)}-${d.substring(6)}`;
    }
    return phone;
  }

  async copyPhone(phone: string, nome: string) {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      this.toast.success('Copiado!', `Telefone de ${nome} copiado para a área de transferência.`);
    } catch {
      this.toast.info('Telefone', phone);
    }
  }

  limparBusca() {
    this.searchQuery.set('');
  }
}
