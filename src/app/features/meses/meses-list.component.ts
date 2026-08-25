import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesService } from '../../core/services/mes.service';
import { Mes, CreateMesDto, formatMesReferencia, MESES_NOMES } from '../../core/models/mes.model';
import { MesModalComponent } from './mes-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meses-list',
  standalone: true,
  imports: [CommonModule, MesModalComponent, ConfirmModalComponent, RouterLink],
  templateUrl: './meses-list.component.html'
})
export class MesesListComponent implements OnInit {
  mesService = inject(MesService);
  meses = this.mesService.meses;

  formatMesReferencia = formatMesReferencia;

  isModalOpen = false;
  isConfirmOpen = false;
  selectedMes: Mes | null = null;

  ngOnInit() {
    this.mesService.fetchAll();
  }

  formatNumber(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  getNomeMes(m: number): string {
    return MESES_NOMES[m] || 'Mês ' + m;
  }

  openCreateModal() {
    this.selectedMes = null;
    this.isModalOpen = true;
  }

  openEditModal(item: Mes) {
    this.selectedMes = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedMes = null;
  }

  openDeleteConfirm(item: Mes) {
    this.selectedMes = item;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.isConfirmOpen = false;
    this.selectedMes = null;
  }

  async handleSave(dto: CreateMesDto) {
    if (this.selectedMes && this.selectedMes.id_mes) {
      const res = await this.mesService.update(this.selectedMes.id_mes, dto);
      if (res) this.closeModal();
    } else {
      const res = await this.mesService.create(dto);
      if (res) this.closeModal();
    }
  }

  async handleDelete() {
    if (this.selectedMes && this.selectedMes.id_mes) {
      const success = await this.mesService.delete(this.selectedMes.id_mes);
      if (success) this.closeConfirm();
    }
  }
}