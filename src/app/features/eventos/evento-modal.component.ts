import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Evento, CreateEventoDto } from '../../core/models/evento.model';
import { Mes, formatMesReferencia } from '../../core/models/mes.model';
import { TipoEventoService } from '../../core/services/tipo-evento.service';
import { MesService } from '../../core/services/mes.service';
import { TurnoEnum, TURNO_LABELS } from '../../core/models/turno.enum';

@Component({
  selector: 'app-evento-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
        <div class="glass-panel border border-slate-700/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-white">
                {{ evento ? 'Editar Culto / Evento' : 'Novo Culto / Evento' }}
              </h3>
              <p class="text-xs text-slate-400">Defina o mês de referência, data, turno e vagas por horário</p>
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

          @if (!evento && tipoEventoService.tiposEvento().length > 0) {
            <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1.5">
              <label class="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                ⚡ Preencher a partir de um Modelo:
              </label>
              <select 
                (change)="applyTemplate($event)"
                class="w-full px-3 py-1.5 bg-slate-900 border border-indigo-500/30 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-400">
                <option value="">Selecione um modelo para preenchimento rápido...</option>
                @for (t of tipoEventoService.tiposEvento(); track t.id_tipo_evento) {
                  <option [value]="t.id_tipo_evento">{{ t.descricao_padrao }}</option>
                }
              </select>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Mês de Referência (Obrigatório) -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mês de Referência *
              </label>
              <select 
                formControlName="id_mes"
                class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                <option [value]="null" disabled>Selecione o mês de referência...</option>
                @for (m of mesService.meses(); track m.id_mes) {
                  <option [value]="m.id_mes">{{ formatMesReferencia(m) }}</option>
                }
              </select>
              @if (form.get('id_mes')?.touched && form.get('id_mes')?.hasError('required')) {
                <span class="text-xs text-rose-400 mt-1 block">O mês de referência é obrigatório</span>
              }
            </div>

            <!-- Descrição -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Descrição do Culto / Evento *
              </label>
              <input 
                type="text" 
                formControlName="descricao"
                placeholder="Ex: Culto de Celebração da Família"
                class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
              @if (form.get('descricao')?.touched && form.get('descricao')?.hasError('required')) {
                <span class="text-xs text-rose-400 mt-1 block">A descrição é obrigatória</span>
              }
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Data -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Data do Evento *
                </label>
                <input 
                  type="date" 
                  formControlName="data"
                  (change)="onDateChange($event)"
                  class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>

              <!-- Turno -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Turno *
                </label>
                <select 
                  formControlName="turno"
                  class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                  <option [value]="TurnoEnum.MANHA">1 - Manhã</option>
                  <option [value]="TurnoEnum.TARDE">2 - Tarde</option>
                  <option [value]="TurnoEnum.NOITE">3 - Noite</option>
                </select>
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Distribuição de Obreiros por Horário
              </span>

              <!-- 1º Horário -->
              <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-200">1º Horário</span>
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                      <input 
                        type="checkbox" 
                        formControlName="exclusivo_diacono_primeiro"
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
                  <label class="text-xs text-slate-400">Vagas:</label>
                  <input 
                    type="number" 
                    min="0" 
                    formControlName="n_primeiro_horario"
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
                        formControlName="exclusivo_diacono_segundo"
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
                  <label class="text-xs text-slate-400">Vagas:</label>
                  <input 
                    type="number" 
                    min="0" 
                    formControlName="n_segundo_horario"
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
                        formControlName="exclusivo_diacono_terceiro"
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
                  <label class="text-xs text-slate-400">Vagas:</label>
                  <input 
                    type="number" 
                    min="0" 
                    formControlName="n_terceiro_horario"
                    class="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-center text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                Salvar Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class EventoModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() evento: Evento | null = null;
  @Input() defaultMesId: number | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateEventoDto>();
  @Output() close = new EventEmitter<void>();

  tipoEventoService = inject(TipoEventoService);
  mesService = inject(MesService);

  formatMesReferencia = formatMesReferencia;
  TurnoEnum = TurnoEnum;
  TURNO_LABELS = TURNO_LABELS;

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.tipoEventoService.fetchAll();
    this.mesService.fetchAll();
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    const defaultDate = this.evento?.data || new Date().toISOString().split('T')[0];
    const initialMesId = this.evento?.id_mes || this.defaultMesId || this.findMatchingMesId(defaultDate);

    this.form = this.fb.group({
      id_mes: [initialMesId, [Validators.required]],
      descricao: [this.evento?.descricao || '', [Validators.required]],
      data: [defaultDate, [Validators.required]],
      turno: [this.evento?.turno || TurnoEnum.NOITE, [Validators.required]],
      n_primeiro_horario: [this.evento?.n_primeiro_horario ?? 2, [Validators.min(0)]],
      exclusivo_diacono_primeiro: [this.evento?.exclusivo_diacono_primeiro ?? false],
      pulpito_primeiro: [this.evento?.pulpito_primeiro ?? true],
      n_segundo_horario: [this.evento?.n_segundo_horario ?? 0, [Validators.min(0)]],
      exclusivo_diacono_segundo: [this.evento?.exclusivo_diacono_segundo ?? false],
      pulpito_segundo: [this.evento?.pulpito_segundo ?? true],
      n_terceiro_horario: [this.evento?.n_terceiro_horario ?? 0, [Validators.min(0)]],
      exclusivo_diacono_terceiro: [this.evento?.exclusivo_diacono_terceiro ?? false],
      pulpito_terceiro: [this.evento?.pulpito_terceiro ?? true]
    });
  }

  findMatchingMesId(dateStr: string): number | null {
    if (!dateStr) return this.mesService.meses()[0]?.id_mes ?? null;
    const [year, month] = dateStr.split('-').map(Number);
    const found = this.mesService.meses().find(m => m.ano_referencia === year && m.mes_referencia === month);
    return found?.id_mes || this.mesService.meses()[0]?.id_mes || null;
  }

  onDateChange(event: any) {
    const dateStr = event.target.value;
    if (dateStr && !this.form.get('id_mes')?.value) {
      const matchId = this.findMatchingMesId(dateStr);
      if (matchId) {
        this.form.patchValue({ id_mes: matchId });
      }
    }
  }

  applyTemplate(event: any) {
    const templateId = Number(event.target.value);
    if (!templateId) return;

    const template = this.tipoEventoService.tiposEvento().find(t => t.id_tipo_evento === templateId);
    if (!template) return;

    this.form.patchValue({
      descricao: template.descricao_padrao,
      turno: template.turno_padrao,
      n_primeiro_horario: template.n_primeiro_horario_padrao,
      exclusivo_diacono_primeiro: template.exclusivo_diacono_primeiro_padrao,
      pulpito_primeiro: template.pulpito_primeiro ?? true,
      n_segundo_horario: template.n_segundo_horario_padrao,
      exclusivo_diacono_segundo: template.exclusivo_diacono_segundo_padrao,
      pulpito_segundo: template.pulpito_segundo ?? true,
      n_terceiro_horario: template.n_terceiro_horario_padrao,
      exclusivo_diacono_terceiro: template.exclusivo_diacono_terceiro_padrao,
      pulpito_terceiro: template.pulpito_terceiro ?? true
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;
      this.save.emit({
        ...raw,
        id_mes: Number(raw.id_mes),
        turno: Number(raw.turno),
        n_primeiro_horario: Number(raw.n_primeiro_horario || 0),
        n_segundo_horario: Number(raw.n_segundo_horario || 0),
        n_terceiro_horario: Number(raw.n_terceiro_horario || 0)
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}