import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutoEscalaService, AutoEscalaResult } from '../../core/services/auto-escala.service';
import { EscalaService } from '../../core/services/escala.service';
import { EventoService } from '../../core/services/evento.service';
import { ObreiroService } from '../../core/services/obreiro.service';
import { MesService } from '../../core/services/mes.service';
import { BloqueioService } from '../../core/services/bloqueio.service';
import { ToastService } from '../../core/services/toast.service';
import { formatMesReferencia, findCurrentMes } from '../../core/models/mes.model';
import { TURNO_LABELS, TURNO_COLORS } from '../../core/models/turno.enum';

@Component({
  selector: 'app-escala-gerador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './escala-gerador.component.html'
})
export class EscalaGeradorComponent implements OnInit {
  autoEscalaService = inject(AutoEscalaService);
  escalaService = inject(EscalaService);
  eventoService = inject(EventoService);
  obreiroService = inject(ObreiroService);
  mesService = inject(MesService);
  bloqueioService = inject(BloqueioService);
  toast = inject(ToastService);
  router = inject(Router);

  formatMesReferencia = formatMesReferencia;

  selectedMesId = signal<number>(0);
  replaceExisting = true;
  isGenerating = false;
  isSaving = false;

  result: AutoEscalaResult | null = null;

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    const [meses] = await Promise.all([
      this.mesService.fetchAll(),
      this.eventoService.fetchAll(),
      this.obreiroService.fetchAll(),
      this.bloqueioService.fetchAll(),
      this.escalaService.fetchAll()
    ]);

    if (this.selectedMesId() === 0) {
      const cur = findCurrentMes(meses);
      if (cur && cur.id_mes) {
        this.selectedMesId.set(cur.id_mes);
      }
    }
  }

  onMesChange(mesId: number) {
    this.selectedMesId.set(Number(mesId));
    this.result = null;
  }

  getEventosCountDoMes(): number {
    const mesId = Number(this.selectedMesId());
    if (!mesId) return 0;
    return this.eventoService.eventos().filter(e => Number(e.id_mes) === mesId).length;
  }

  getObreirosElegiveisCount(): number {
    return this.obreiroService.obreiros().filter(o => o.ativo && !o.lider).length;
  }

  getDiaconosCount(): number {
    return this.obreiroService.obreiros().filter(o => o.ativo && !o.lider && o.diacono).length;
  }

  getPulpitoCount(): number {
    return this.obreiroService.obreiros().filter(o => o.ativo && !o.lider && o.pulpito).length;
  }

  getTurnoLabel(turno: number): string {
    return TURNO_LABELS[turno] || 'Geral';
  }

  getTurnoStyle(turno: number) {
    return TURNO_COLORS[turno] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
  }

  getInitials(name?: string): string {
    if (!name) return 'OB';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getMediaEscalas(): string {
    if (!this.result || !this.result.obreiroStats || this.result.obreiroStats.length === 0) return '0';
    const total = this.result.obreiroStats.reduce((acc, s) => acc + s.totalEscalas, 0);
    return (total / this.result.obreiroStats.length).toFixed(1);
  }

  getMinEscalas(): number {
    if (!this.result || !this.result.obreiroStats || this.result.obreiroStats.length === 0) return 0;
    return Math.min(...this.result.obreiroStats.map(s => s.totalEscalas));
  }

  getMaxEscalas(): number {
    if (!this.result || !this.result.obreiroStats || this.result.obreiroStats.length === 0) return 0;
    return Math.max(...this.result.obreiroStats.map(s => s.totalEscalas));
  }

  executarGeracaoAutomatica() {
    const mesId = Number(this.selectedMesId());
    if (!mesId) {
      this.toast.warning('Selecione um mês', 'Por favor, selecione um mês de referência para gerar a escala.');
      return;
    }

    try {
      this.result = this.autoEscalaService.generateMonthlySchedule(
        mesId,
        this.eventoService.eventos(),
        this.obreiroService.obreiros(),
        this.bloqueioService.bloqueios(),
        this.escalaService.escalas(),
        this.replaceExisting
      );

      if (this.result.totalVagasNecessarias === 0) {
        this.toast.warning('Sem cultos', 'Nenhum culto cadastrado para este mês. Use "Gerar Cultos do Mês" para criá-los.');
      } else if (this.result.totalVagasPreenchidas === this.result.totalVagasNecessarias) {
        this.toast.success('Escala calculada!', `100% das vagas (${this.result.totalVagasPreenchidas}) foram preenchidas com sucesso.`);
      } else {
        this.toast.warning('Escala com vagas abertas', `${this.result.totalVagasPreenchidas} de ${this.result.totalVagasNecessarias} vagas foram preenchidas.`);
      }
    } catch (err: any) {
      console.error('Erro na execução da geração automática:', err);
      this.toast.error('Erro ao processar regras', err.message || 'Ocorreu um erro inesperado.');
    } finally {
      this.isGenerating = false;
    }
  }

  async salvarEscalaNoBanco() {
    if (!this.result || this.result.dtos.length === 0) return;
    this.isSaving = true;

    try {
      const success = await this.escalaService.saveGeneratedSchedule(
        this.result.id_mes,
        this.result.dtos,
        this.replaceExisting
      );

      if (success) {
        this.router.navigate(['/escalas'], { queryParams: { mes: this.result.id_mes } });
      }
    } catch (err: any) {
      console.error('Erro ao salvar escala no banco:', err);
      this.toast.error('Erro ao salvar', err.message);
    } finally {
      this.isSaving = false;
    }
  }
}