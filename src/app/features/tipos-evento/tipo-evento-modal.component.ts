import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoEvento, CreateTipoEventoDto, DIAS_SEMANA_LABELS } from '../../core/models/tipo-evento.model';
import { TurnoEnum, TURNO_LABELS } from '../../core/models/turno.enum';

@Component({
  selector: 'app-tipo-evento-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
        <div class="glass-panel border border-slate-700/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-white">
                {{ tipoEvento ? 'Editar Modelo de Culto' : 'Novo Modelo de Culto / Evento' }}
              </h3>
              <p class="text-xs text-slate-400">Configure um modelo padrão de vagas e horários para cultos frequentes</p>
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

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Descrição Padrão -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Descrição Padrão do Culto *
              </label>
              <input 
                type="text" 
                formControlName="descricao_padrao"
                placeholder="Ex: Culto de Celebração de Domingo"
                class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
              @if (form.get('descricao_padrao')?.touched && form.get('descricao_padrao')?.hasError('required')) {
                <span class="text-xs text-rose-400 mt-1 block">A descrição é obrigatória</span>
              }
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Dia da Semana Padrão -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Dia da Semana Padrão
                </label>
                <select 
                  formControlName="dia_semana_padrao"
                  class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                  <option [value]="null">Sem dia fixo</option>
                  @for (d of diasSemanaList; track d.value) {
                    <option [value]="d.value">{{ d.name }}</option>
                  }
                </select>
              </div>

              <!-- Turno Padrão -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Turno Padrão *
                </label>
                <select 
                  formControlName="turno_padrao"
                  class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                  <option [value]="TurnoEnum.MANHA">1 - Manhã</option>
                  <option [value]="TurnoEnum.TARDE">2 - Tarde</option>
                  <option [value]="TurnoEnum.NOITE">3 - Noite</option>
                </select>
              </div>
            </div>

            <!-- Horários e Vagas Padrão -->
            <div class="space-y-3 pt-2">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Estrutura Padrão de Vagas por Horário
              </span>

              <!-- 1º Horário -->
              <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-200">1º Horário</span>
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                      <input 
                        type="checkbox" 
                        formControlName="exclusivo_diacono_primeiro_padrao"
                        class="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Exclusivo Diáconos</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs text-purple-400 font-medium">
                      <input 
                        type="checkbox" 
                        formControlName="pulpito_primeiro"
                        class="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Púlpito</span>
                    </label>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <label class="text-xs text-slate-400">Vagas padrão:</label>
                  <input 
                    type="number" 
                    min="0" 
                    formControlName="n_primeiro_horario_padrao"
                    class="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-center text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <!-- 2º Horário -->
              <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-200">2º Horário</span>
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                      <input 
                        type="checkbox" 
                        formControlName="exclusivo_diacono_segundo_padrao"
                        class="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Exclusivo Diáconos</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs text-purple-400 font-medium">
                      <input 
                        type="checkbox" 
                        formControlName="pulpito_segundo"
                        class="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Púlpito</span>
                    </label>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <label class="text-xs text-slate-400">Vagas padrão:</label>
                  <input 
                    type="number" 
                    min="0" 
                    formControlName="n_segundo_horario_padrao"
                    class="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-center text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <!-- 3º Horário -->
              <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-200">3º Horário</span>
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                      <input 
                        type="checkbox" 
                        formControlName="exclusivo_diacono_terceiro_padrao"
                        class="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Exclusivo Diáconos</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs text-purple-400 font-medium">
                      <input 
                        type="checkbox" 
                        formControlName="pulpito_terceiro"
                        class="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span>Púlpito</span>
                    </label>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <label class="text-xs text-slate-400">Vagas padrão:</label>
                  <input 
                    type="number" 
                    min="0" 
                    formControlName="n_terceiro_horario_padrao"
                    class="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-center text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
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
                Salvar Modelo
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class TipoEventoModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() tipoEvento: TipoEvento | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateTipoEventoDto>();
  @Output() close = new EventEmitter<void>();

  TurnoEnum = TurnoEnum;
  TURNO_LABELS = TURNO_LABELS;

  diasSemanaList = Object.entries(DIAS_SEMANA_LABELS).map(([val, name]) => ({
    value: Number(val),
    name
  }));

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      descricao_padrao: [this.tipoEvento?.descricao_padrao || '', [Validators.required]],
      dia_semana_padrao: [this.tipoEvento?.dia_semana_padrao ?? null],
      turno_padrao: [this.tipoEvento?.turno_padrao || TurnoEnum.NOITE, [Validators.required]],
      n_primeiro_horario_padrao: [this.tipoEvento?.n_primeiro_horario_padrao ?? 2, [Validators.min(0)]],
      exclusivo_diacono_primeiro_padrao: [this.tipoEvento?.exclusivo_diacono_primeiro_padrao ?? false],
      pulpito_primeiro: [this.tipoEvento?.pulpito_primeiro ?? true],
      n_segundo_horario_padrao: [this.tipoEvento?.n_segundo_horario_padrao ?? 0, [Validators.min(0)]],
      exclusivo_diacono_segundo_padrao: [this.tipoEvento?.exclusivo_diacono_segundo_padrao ?? false],
      pulpito_segundo: [this.tipoEvento?.pulpito_segundo ?? true],
      n_terceiro_horario_padrao: [this.tipoEvento?.n_terceiro_horario_padrao ?? 0, [Validators.min(0)]],
      exclusivo_diacono_terceiro_padrao: [this.tipoEvento?.exclusivo_diacono_terceiro_padrao ?? false],
      pulpito_terceiro: [this.tipoEvento?.pulpito_terceiro ?? true]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;
      this.save.emit({
        ...raw,
        dia_semana_padrao: raw.dia_semana_padrao ? Number(raw.dia_semana_padrao) : null,
        turno_padrao: Number(raw.turno_padrao),
        n_primeiro_horario_padrao: Number(raw.n_primeiro_horario_padrao || 0),
        n_segundo_horario_padrao: Number(raw.n_segundo_horario_padrao || 0),
        n_terceiro_horario_padrao: Number(raw.n_terceiro_horario_padrao || 0)
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}