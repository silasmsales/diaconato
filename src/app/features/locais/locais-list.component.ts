import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalService } from '../../core/services/local.service';
import { AuthService } from '../../core/services/auth.service';
import { Local, CreateLocalDto, UpdateLocalDto, getAreaStyle } from '../../core/models/local.model';
import { LocalModalComponent } from './local-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

export interface AreaGroup {
  area: string;
  locais: Local[];
  totalAtivos: number;
}

@Component({
  selector: 'app-locais-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LocalModalComponent, ConfirmModalComponent],
  templateUrl: './locais-list.component.html'
})
export class LocaisListComponent implements OnInit {
  localService = inject(LocalService);
  authService = inject(AuthService);

  getAreaStyle = getAreaStyle;
  searchQuery = signal<string>('');
  selectedAreaFilter = signal<string>('TODAS');
  viewMode: 'agrupado' | 'cards' = 'agrupado';

  isModalOpen = false;
  isConfirmOpen = false;
  selectedLocal: Local | null = null;
  defaultArea: string | null = null;

  // Lista única de todas as áreas cadastradas
  allAreas = computed(() => {
    const areas = new Set<string>();
    areas.add('Igreja');
    areas.add('Estacionamento');
    this.localService.locais().forEach(l => {
      if (l.area) areas.add(l.area);
    });
    return Array.from(areas);
  });

  // Estatísticas
  totalCount = computed(() => this.localService.locais().length);
  activeCount = computed(() => this.localService.locais().filter(l => l.ativo).length);
  areasCount = computed(() => this.allAreas().length);

  // Lista Filtrada
  filteredLocais = computed(() => {
    let list = this.localService.locais();
    const query = this.searchQuery().toLowerCase().trim();
    const area = this.selectedAreaFilter();

    if (area !== 'TODAS') {
      list = list.filter(l => l.area.toLowerCase() === area.toLowerCase());
    }

    if (query) {
      list = list.filter(l => 
        l.nome.toLowerCase().includes(query) ||
        (l.descricao && l.descricao.toLowerCase().includes(query)) ||
        l.area.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Agrupado por Área
  groupedLocais = computed<AreaGroup[]>(() => {
    const list = this.filteredLocais();
    const map = new Map<string, Local[]>();

    list.forEach(item => {
      const current = map.get(item.area) || [];
      current.push(item);
      map.set(item.area, current);
    });

    const groups: AreaGroup[] = [];
    map.forEach((items, area) => {
      groups.push({
        area,
        locais: items.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome)),
        totalAtivos: items.filter(i => i.ativo).length
      });
    });

    return groups.sort((a, b) => a.area.localeCompare(b.area));
  });

  ngOnInit() {
    this.localService.fetchLocais();
  }

  openCreateModal(defaultArea?: string) {
    this.selectedLocal = null;
    this.defaultArea = defaultArea || null;
    this.isModalOpen = true;
  }

  openEditModal(local: Local) {
    this.selectedLocal = local;
    this.defaultArea = local.area;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedLocal = null;
    this.defaultArea = null;
  }

  async handleSave(dto: CreateLocalDto) {
    if (this.selectedLocal) {
      await this.localService.updateLocal(this.selectedLocal.id_local, dto);
    } else {
      await this.localService.createLocal(dto);
    }
    this.closeModal();
  }

  openDeleteConfirm(local: Local) {
    this.selectedLocal = local;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.isConfirmOpen = false;
    this.selectedLocal = null;
  }

  async handleDelete() {
    if (this.selectedLocal) {
      await this.localService.deleteLocal(this.selectedLocal.id_local);
      this.closeConfirm();
    }
  }

  async toggleAtivo(local: Local) {
    await this.localService.toggleAtivo(local);
  }
}
