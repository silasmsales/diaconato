import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObreiroService } from '../../core/services/obreiro.service';
import { AuthService } from '../../core/services/auth.service';
import { Obreiro, CreateObreiroDto } from '../../core/models/obreiro.model';
import { ObreiroModalComponent } from './obreiro-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-obreiros-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ObreiroModalComponent, ConfirmModalComponent],
  templateUrl: './obreiros-list.component.html'
})
export class ObreirosListComponent implements OnInit {
  authService = inject(AuthService);
  obreiroService = inject(ObreiroService);

  obreiros = this.obreiroService.obreiros;
  searchQuery = signal<string>('');
  currentFilter = signal<'todos' | 'diaconos' | 'lideres' | 'pulpito' | 'inativos'>('todos');

  // Modal States
  isModalOpen = false;
  isConfirmOpen = false;
  selectedObreiro: Obreiro | null = null;

  // Computed Counters
  activeCount = computed(() => this.obreiros().filter(o => o.ativo).length);
  diaconosCount = computed(() => this.obreiros().filter(o => o.diacono).length);
  lideresCount = computed(() => this.obreiros().filter(o => o.lider).length);
  pulpitoCount = computed(() => this.obreiros().filter(o => o.pulpito).length);

  // Filtered List
  filteredObreiros = computed(() => {
    let list = this.obreiros();
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      list = list.filter(o => 
        o.nome.toLowerCase().includes(query) ||
        (o.apelido && o.apelido.toLowerCase().includes(query)) ||
        (o.telefone && o.telefone.includes(query)) ||
        (o.email && o.email.toLowerCase().includes(query))
      );
    }

    const filter = this.currentFilter();
    if (filter === 'diaconos') list = list.filter(o => o.diacono);
    else if (filter === 'lideres') list = list.filter(o => o.lider);
    else if (filter === 'pulpito') list = list.filter(o => o.pulpito);
    else if (filter === 'inativos') list = list.filter(o => !o.ativo);

    return list;
  });

  ngOnInit() {
    this.obreiroService.fetchAll();
  }

  getInitials(name: string): string {
    if (!name) return 'OB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getWhatsAppUrl(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    const cleanNumber = digits.startsWith('55') ? digits : '55' + digits;
    return `https://wa.me/${cleanNumber}`;
  }

  getFormattedPhone(phone?: string | null): string {
    if (!phone) return '';
    const d = phone.replace(/\D/g, '');
    if (d.length === 11) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 7)}-${d.substring(7)}`;
    }
    if (d.length === 10) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 6)}-${d.substring(6)}`;
    }
    if (d.length === 13 && d.startsWith('55')) {
      return `(${d.substring(2, 4)}) ${d.substring(4, 9)}-${d.substring(9)}`;
    }
    if (d.length === 12 && d.startsWith('55')) {
      return `(${d.substring(2, 4)}) ${d.substring(4, 8)}-${d.substring(8)}`;
    }
    return phone;
  }

  openCreateModal() {
    this.selectedObreiro = null;
    this.isModalOpen = true;
  }

  openEditModal(item: Obreiro) {
    this.selectedObreiro = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedObreiro = null;
  }

  openDeleteConfirm(item: Obreiro) {
    this.selectedObreiro = item;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.isConfirmOpen = false;
    this.selectedObreiro = null;
  }

  async handleSave(dto: CreateObreiroDto) {
    if (this.selectedObreiro && this.selectedObreiro.id_obreiro) {
      const res = await this.obreiroService.update(this.selectedObreiro.id_obreiro, dto);
      if (res) this.closeModal();
    } else {
      const res = await this.obreiroService.create(dto);
      if (res) this.closeModal();
    }
  }

  async handleDelete() {
    if (this.selectedObreiro && this.selectedObreiro.id_obreiro) {
      const success = await this.obreiroService.delete(this.selectedObreiro.id_obreiro);
      if (success) this.closeConfirm();
    }
  }
}
