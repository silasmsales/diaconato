import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mes, CreateMesDto, MESES_NOMES } from '../../core/models/mes.model';

@Component({
  selector: 'app-mes-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        <div class="glass-panel border border-slate-700/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-white">
                {{ mes ? 'Editar Mês de Referência' : 'Novo Mês de Referência' }}
              </h3>
              <p class="text-xs text-slate-400">Defina o ano e o mês para a escala</p>
            </div>
            <button 
              type="button" 
              (click)="onCancel()"
              class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Mês -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mês *
                </label>
                <select 
                  formControlName="mes_referencia"
                  class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                  @for (m of mesesList; track m.value) {
                    <option [value]="m.value">{{ m.name }}</option>
                  }
                </select>
              </div>

              <!-- Ano -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ano *
                </label>
                <input 
                  type="number" 
                  formControlName="ano_referencia"
                  min="1000"
                  max="2100"
                  class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                type="button" 
                (click)="onCancel()"
                class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="form.invalid || loading"
                class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
                @if (loading) {
                  <span class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                }
                Salvar Mês
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class MesModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() mes: Mes | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateMesDto>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  mesesList = Object.entries(MESES_NOMES).map(([val, name]) => ({
    value: Number(val),
    name
  }));

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    const now = new Date();
    this.form = this.fb.group({
      ano_referencia: [this.mes?.ano_referencia || now.getFullYear(), [Validators.required, Validators.min(1000)]],
      mes_referencia: [this.mes?.mes_referencia || (now.getMonth() + 1), [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;
      this.save.emit({
        ano_referencia: Number(raw.ano_referencia),
        mes_referencia: Number(raw.mes_referencia)
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}