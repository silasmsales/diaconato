import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bloqueio, CreateBloqueioDto } from '../../core/models/bloqueio.model';
import { Obreiro } from '../../core/models/obreiro.model';
import { MesService } from '../../core/services/mes.service';
import { Mes, formatMesReferencia, MESES_NOMES } from '../../core/models/mes.model';
import { TurnoEnum, TURNO_LABELS } from '../../core/models/turno.enum';
import { DIAS_SEMANA_LABELS } from '../../core/models/tipo-evento.model';

export type BloqueioTipoMode = 'especifico' | 'periodo' | 'par_impar' | 'dia_semana';

export interface BloqueioBatchPayload {
  id_obreiro: number;
  datas: string[]; // List of YYYY-MM-DD
  turnos: number[]; // List of turno numbers [1, 2, 3]
  motivo?: string | null;
}

@Component({
  selector: 'app-bloqueio-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
        <div class="glass-panel border border-slate-700/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-white">
                {{ bloqueio ? 'Editar Bloqueio' : 'Cadastro de Bloqueios & Indisponibilidades' }}
              </h3>
              <p class="text-xs text-slate-400">Escolha o modo de bloqueio, selecione as datas e os turnos</p>
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

          <!-- Mode Tabs (Only when creating new) -->
          @if (!bloqueio) {
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
              <button 
                type="button"
                (click)="setMode('especifico')"
                [class]="mode === 'especifico' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'"
                class="px-2.5 py-2 rounded-lg text-[11px] font-semibold transition-all text-center">
                1. Dia Específico
              </button>
              <button 
                type="button"
                (click)="setMode('periodo')"
                [class]="mode === 'periodo' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'"
                class="px-2.5 py-2 rounded-lg text-[11px] font-semibold transition-all text-center">
                2. Período
              </button>
              <button 
                type="button"
                (click)="setMode('par_impar')"
                [class]="mode === 'par_impar' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'"
                class="px-2.5 py-2 rounded-lg text-[11px] font-semibold transition-all text-center">
                3. Pares/Ímpares
              </button>
              <button 
                type="button"
                (click)="setMode('dia_semana')"
                [class]="mode === 'dia_semana' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'"
                class="px-2.5 py-2 rounded-lg text-[11px] font-semibold transition-all text-center">
                4. Dia da Semana
              </button>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Obreiro -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Obreiro *
              </label>
              <select 
                formControlName="id_obreiro"
                class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                <option [value]="null" disabled>Selecione um obreiro...</option>
                @for (ob of obreiros; track ob.id_obreiro) {
                  <option [value]="ob.id_obreiro">{{ ob.nome }} {{ ob.apelido ? '(' + ob.apelido + ')' : '' }}</option>
                }
              </select>
              @if (form.get('id_obreiro')?.touched && form.get('id_obreiro')?.hasError('required')) {
                <span class="text-xs text-rose-400 mt-1 block">O obreiro é obrigatório</span>
              }
            </div>

            <!-- MODE 1: Dia Específico -->
            @if (mode === 'especifico') {
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Data do Bloqueio *
                </label>
                <input 
                  type="date" 
                  formControlName="data"
                  class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            }

            <!-- MODE 2: Período -->
            @if (mode === 'periodo') {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Data Inicial *
                  </label>
                  <input 
                    type="date" 
                    formControlName="data_inicio"
                    class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Data Final *
                  </label>
                  <input 
                    type="date" 
                    formControlName="data_fim"
                    class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>
            }

            <!-- MODE 3: Pares ou Ímpares -->
            @if (mode === 'par_impar') {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mês de Referência *
                  </label>
                  <select 
                    formControlName="mes_ref"
                    class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                    @for (m of mesesList; track m.key) {
                      <option [value]="m.key">{{ m.label }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Paridade dos Dias *
                  </label>
                  <select 
                    formControlName="paridade"
                    class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                    <option value="pares">Dias Pares (2, 4, 6, 8, ...)</option>
                    <option value="impares">Dias Ímpares (1, 3, 5, 7, ...)</option>
                  </select>
                </div>
              </div>
            }

            <!-- MODE 4: Dia da Semana no Mês -->
            @if (mode === 'dia_semana') {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mês de Referência *
                  </label>
                  <select 
                    formControlName="mes_ref"
                    class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                    @for (m of mesesList; track m.key) {
                      <option [value]="m.key">{{ m.label }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Dia da Semana *
                  </label>
                  <select 
                    formControlName="dia_semana"
                    class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition-all">
                    @for (d of diasSemanaList; track d.value) {
                      <option [value]="d.value">{{ d.name }}s do mês</option>
                    }
                  </select>
                </div>
              </div>
            }

            <!-- Turnos (Multi-Seleção) -->
            <div class="space-y-2 pt-1">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Turnos Indisponíveis *
                </label>
                
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    (click)="selectAllTurnos(true)"
                    class="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
                    Selecionar Todos
                  </button>
                  <span class="text-slate-600 text-xs">•</span>
                  <button 
                    type="button" 
                    (click)="selectAllTurnos(false)"
                    class="text-[11px] text-slate-400 hover:text-slate-200">
                    Limpar
                  </button>
                </div>
              </div>

              <!-- Checkbox Cards -->
              <div class="grid grid-cols-3 gap-2.5">
                <label 
                  [class]="form.get('manha')?.value ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'"
                  class="cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 transition-all select-none">
                  <input type="checkbox" formControlName="manha" class="sr-only" />
                  <div class="text-base">☀️</div>
                  <span class="text-xs font-bold">Manhã</span>
                  <span class="text-[10px] text-slate-500">1º Turno</span>
                </label>

                <label 
                  [class]="form.get('tarde')?.value ? 'bg-sky-500/15 border-sky-500/50 text-sky-300 shadow-md shadow-sky-500/10' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'"
                  class="cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 transition-all select-none">
                  <input type="checkbox" formControlName="tarde" class="sr-only" />
                  <div class="text-base">⛅</div>
                  <span class="text-xs font-bold">Tarde</span>
                  <span class="text-[10px] text-slate-500">2º Turno</span>
                </label>

                <label 
                  [class]="form.get('noite')?.value ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-500/10' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'"
                  class="cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 transition-all select-none">
                  <input type="checkbox" formControlName="noite" class="sr-only" />
                  <div class="text-base">🌙</div>
                  <span class="text-xs font-bold">Noite</span>
                  <span class="text-[10px] text-slate-500">3º Turno</span>
                </label>
              </div>

              @if (!hasSelectedTurno() && (form.get('manha')?.touched || form.get('tarde')?.touched || form.get('noite')?.touched)) {
                <span class="text-xs text-rose-400 mt-1 block">Selecione pelo menos um turno para o bloqueio</span>
              }
            </div>

            <!-- Motivo -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Motivo / Observação
              </label>
              <textarea 
                rows="2"
                formControlName="motivo"
                placeholder="Ex: Viagem, compromisso familiar, escala profissional..."
                class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all resize-none"
              ></textarea>
            </div>

            <!-- Live Calculation Preview Summary -->
            @if (calculatedDates.length > 0) {
              <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1 text-xs">
                <div class="flex items-center justify-between text-indigo-300 font-bold">
                  <span>📊 Total a gerar:</span>
                  <span>{{ calculatedDates.length }} data(s) × {{ getSelectedTurnosCount() }} turno(s) = {{ calculatedDates.length * getSelectedTurnosCount() }} bloqueio(s)</span>
                </div>
                <div class="text-[11px] text-slate-400 truncate">
                  Datas: {{ getDatesPreview() }}
                </div>
              </div>
            }

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
                [disabled]="form.invalid || !hasSelectedTurno() || calculatedDates.length === 0 || loading"
                class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
                @if (loading) {
                  <span class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                }
                Salvar {{ calculatedDates.length * getSelectedTurnosCount() }} Bloqueio(s)
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class BloqueioModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() bloqueio: Bloqueio | null = null;
  @Input() defaultObreiroId: number | null = null;
  @Input() obreiros: Obreiro[] = [];
  @Input() loading = false;
  @Output() save = new EventEmitter<BloqueioBatchPayload>();
  @Output() close = new EventEmitter<void>();

  mesService = inject(MesService);

  mode: BloqueioTipoMode = 'especifico';
  TurnoEnum = TurnoEnum;
  TURNO_LABELS = TURNO_LABELS;

  diasSemanaList = Object.entries(DIAS_SEMANA_LABELS).map(([val, name]) => ({
    value: Number(val),
    name
  }));

  mesesList: { key: string; label: string; year: number; month: number }[] = [];

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.mesService.fetchAll();
    this.buildMesesList();
    this.initForm();
  }

  ngOnChanges() {
    this.buildMesesList();
    this.initForm();
  }

  private buildMesesList() {
    const list: { key: string; label: string; year: number; month: number }[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    // From mesService if exists
    for (const m of this.mesService.meses()) {
      const key = `${m.ano_referencia}-${String(m.mes_referencia).padStart(2, '0')}`;
      if (!list.some(item => item.key === key)) {
        list.push({
          key,
          label: formatMesReferencia(m),
          year: m.ano_referencia,
          month: m.mes_referencia
        });
      }
    }

    // Default current & next months if empty
    if (list.length === 0) {
      for (let y of [currentYear, currentYear + 1]) {
        for (let m = 1; m <= 12; m++) {
          list.push({
            key: `${y}-${String(m).padStart(2, '0')}`,
            label: `${MESES_NOMES[m]}/${y}`,
            year: y,
            month: m
          });
        }
      }
    }

    this.mesesList = list;
  }

  setMode(newMode: BloqueioTipoMode) {
    this.mode = newMode;
  }

  private initForm() {
    const isEditing = !!this.bloqueio;
    const currentTurno = this.bloqueio?.turno;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const defaultMesKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    this.mode = 'especifico';

    this.form = this.fb.group({
      id_obreiro: [this.bloqueio?.id_obreiro || this.defaultObreiroId || null, [Validators.required]],
      data: [this.bloqueio?.data || todayStr],
      data_inicio: [todayStr],
      data_fim: [todayStr],
      mes_ref: [this.mesesList[0]?.key || defaultMesKey],
      paridade: ['pares'],
      dia_semana: [1], // Domingo
      manha: [isEditing ? currentTurno === TurnoEnum.MANHA || currentTurno === TurnoEnum.INTEGRAL : true],
      tarde: [isEditing ? currentTurno === TurnoEnum.TARDE || currentTurno === TurnoEnum.INTEGRAL : false],
      noite: [isEditing ? currentTurno === TurnoEnum.NOITE || currentTurno === TurnoEnum.INTEGRAL : false],
      motivo: [this.bloqueio?.motivo || '']
    });
  }

  get calculatedDates(): string[] {
    if (!this.form) return [];
    const raw = this.form.value;

    if (this.mode === 'especifico') {
      return raw.data ? [raw.data] : [];
    }

    if (this.mode === 'periodo') {
      if (!raw.data_inicio || !raw.data_fim) return [];
      const start = new Date(raw.data_inicio + 'T00:00:00');
      const end = new Date(raw.data_fim + 'T00:00:00');
      if (start > end) return [];

      const list: string[] = [];
      let cur = new Date(start);
      while (cur <= end) {
        list.push(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
      return list;
    }

    if (this.mode === 'par_impar') {
      const mesKey = raw.mes_ref;
      if (!mesKey) return [];
      const [yearStr, monthStr] = mesKey.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr); // 1..12
      const totalDays = new Date(year, month, 0).getDate();
      const isPares = raw.paridade === 'pares';

      const list: string[] = [];
      for (let day = 1; day <= totalDays; day++) {
        const match = isPares ? (day % 2 === 0) : (day % 2 !== 0);
        if (match) {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          list.push(dateStr);
        }
      }
      return list;
    }

    if (this.mode === 'dia_semana') {
      const mesKey = raw.mes_ref;
      const targetDayOfWeek = Number(raw.dia_semana); // 1: Dom .. 7: Sab
      if (!mesKey || !targetDayOfWeek) return [];
      const [yearStr, monthStr] = mesKey.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);
      const totalDays = new Date(year, month, 0).getDate();

      const list: string[] = [];
      for (let day = 1; day <= totalDays; day++) {
        const d = new Date(year, month - 1, day);
        // JS getDay() is 0 (Sunday) to 6 (Saturday), our mapping is 1 (Sunday) to 7 (Saturday)
        const currentDayOfWeek = d.getDay() + 1;
        if (currentDayOfWeek === targetDayOfWeek) {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          list.push(dateStr);
        }
      }
      return list;
    }

    return [];
  }

  hasSelectedTurno(): boolean {
    if (!this.form) return false;
    return !!(this.form.get('manha')?.value || this.form.get('tarde')?.value || this.form.get('noite')?.value);
  }

  getSelectedTurnosCount(): number {
    if (!this.form) return 0;
    let count = 0;
    if (this.form.get('manha')?.value) count++;
    if (this.form.get('tarde')?.value) count++;
    if (this.form.get('noite')?.value) count++;
    return count;
  }

  selectAllTurnos(selected: boolean) {
    this.form.patchValue({
      manha: selected,
      tarde: selected,
      noite: selected
    });
  }

  getDatesPreview(): string {
    const dates = this.calculatedDates;
    if (dates.length === 0) return 'Nenhuma data';
    const formatted = dates.map(d => {
      const [y, m, day] = d.split('-');
      return `${day}/${m}`;
    });
    if (formatted.length <= 6) return formatted.join(', ');
    return `${formatted.slice(0, 6).join(', ')} e mais ${formatted.length - 6} data(s)...`;
  }

  onSubmit() {
    if (this.form.valid && this.hasSelectedTurno() && this.calculatedDates.length > 0) {
      const raw = this.form.value;
      const turnos: number[] = [];
      if (raw.manha) turnos.push(TurnoEnum.MANHA);
      if (raw.tarde) turnos.push(TurnoEnum.TARDE);
      if (raw.noite) turnos.push(TurnoEnum.NOITE);

      this.save.emit({
        id_obreiro: Number(raw.id_obreiro),
        datas: this.calculatedDates,
        turnos,
        motivo: raw.motivo || null
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}