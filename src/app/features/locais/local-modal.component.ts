import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Local, CreateLocalDto, PRESET_AREAS, getAreaStyle } from '../../core/models/local.model';

@Component({
  selector: 'app-local-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          (click)="close.emit()">
        </div>

        <!-- Modal Box -->
        <div class="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 space-y-5 animate-scale-in">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">
                📍
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">
                  {{ isEditMode ? 'Editar Local de Atuação' : 'Novo Local de Atuação' }}
                </h3>
                <p class="text-xs text-slate-400">
                  {{ isEditMode ? 'Atualize as informações do posto de serviço' : 'Cadastre um novo posto de trabalho para os obreiros' }}
                </p>
              </div>
            </div>

            <button 
              type="button" 
              (click)="close.emit()" 
              class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Body -->
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Nome do Local -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nome do Local / Posto <span class="text-rose-400">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.nome" 
                name="nome"
                required
                placeholder="Ex: Porta Principal, SAMU, Púlpito..."
                class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <!-- Área de Atuação -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Área de Atuação <span class="text-rose-400">*</span>
              </label>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select 
                  [(ngModel)]="selectedAreaOption" 
                  name="selectedAreaOption"
                  (change)="onAreaOptionChange()"
                  class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-all">
                  @for (area of availableAreas(); track area) {
                    <option [value]="area">{{ area }}</option>
                  }
                  <option value="__NEW__">+ Nova Área Personalizada...</option>
                </select>

                @if (isCustomArea) {
                  <input 
                    type="text" 
                    [(ngModel)]="customAreaName" 
                    name="customAreaName"
                    required
                    placeholder="Digite o nome da nova área..."
                    class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-indigo-500/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all animate-fade-in"
                  />
                }
              </div>
              <p class="text-[11px] text-slate-400 mt-1">
                Classifica se o posto pertence à Igreja, Estacionamento ou uma área personalizada.
              </p>
            </div>

            <!-- Descrição / Instruções do Posto -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Descrição ou Instruções (Opcional)
              </label>
              <textarea 
                [(ngModel)]="formData.descricao" 
                name="descricao"
                rows="2"
                placeholder="Ex: Recepção na entrada principal, orientar fluxo de visitantes..."
                class="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none">
              </textarea>
            </div>

            <!-- Grid: Ordem de Exibição & Status Ativo -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ordem de Exibição
                </label>
                <input 
                  type="number" 
                  [(ngModel)]="formData.ordem" 
                  name="ordem"
                  min="0"
                  placeholder="0"
                  class="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <div class="flex items-center gap-3 pt-2">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="formData.ativo" 
                      name="ativo"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span class="text-xs font-medium" [class.text-emerald-400]="formData.ativo" [class.text-slate-400]="!formData.ativo">
                    {{ formData.ativo ? 'Ativo para escalas' : 'Inativo' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                type="button" 
                (click)="close.emit()"
                class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                Cancelar
              </button>
              
              <button 
                type="submit" 
                [disabled]="loading || !formData.nome || (isCustomArea && !customAreaName)"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 flex items-center gap-2">
                @if (loading) {
                  <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Salvando...</span>
                } @else {
                  <span>{{ isEditMode ? 'Salvar Alterações' : 'Cadastrar Local' }}</span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class LocalModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() local: Local | null = null;
  @Input() defaultArea: string | null = null;
  @Input() existingAreas: string[] = [];
  @Input() loading = false;

  @Output() save = new EventEmitter<CreateLocalDto>();
  @Output() close = new EventEmitter<void>();

  isEditMode = false;
  selectedAreaOption = 'Igreja';
  customAreaName = '';
  isCustomArea = false;

  formData: CreateLocalDto = {
    nome: '',
    area: 'Igreja',
    descricao: '',
    ordem: 0,
    ativo: true
  };

  // Signal interno para reatividade com as áreas vindas do pai
  areasListSignal = signal<string[]>([]);

  availableAreas = computed(() => {
    const list = new Set([...PRESET_AREAS, ...this.areasListSignal()]);
    return Array.from(list).filter(Boolean);
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['existingAreas'] && this.existingAreas) {
      this.areasListSignal.set(this.existingAreas);
    }

    if (changes['isOpen'] && this.isOpen) {
      // Atualiza lista de áreas disponíveis
      if (this.existingAreas) {
        this.areasListSignal.set(this.existingAreas);
      }

      if (this.local) {
        this.isEditMode = true;
        this.formData = {
          nome: this.local.nome,
          area: this.local.area,
          descricao: this.local.descricao || '',
          ordem: this.local.ordem ?? 0,
          ativo: this.local.ativo
        };
        if (this.availableAreas().includes(this.local.area)) {
          this.selectedAreaOption = this.local.area;
          this.isCustomArea = false;
          this.customAreaName = '';
        } else {
          this.selectedAreaOption = '__NEW__';
          this.isCustomArea = true;
          this.customAreaName = this.local.area;
        }
      } else {
        this.isEditMode = false;
        const targetArea = this.defaultArea || 'Igreja';
        
        if (this.availableAreas().includes(targetArea)) {
          this.selectedAreaOption = targetArea;
          this.isCustomArea = false;
          this.customAreaName = '';
        } else {
          this.selectedAreaOption = '__NEW__';
          this.isCustomArea = true;
          this.customAreaName = targetArea;
        }

        this.formData = {
          nome: '',
          area: targetArea,
          descricao: '',
          ordem: 0,
          ativo: true
        };
      }
    }
  }

  onAreaOptionChange() {
    if (this.selectedAreaOption === '__NEW__') {
      this.isCustomArea = true;
    } else {
      this.isCustomArea = false;
      this.formData.area = this.selectedAreaOption;
    }
  }

  onSubmit() {
    if (!this.formData.nome?.trim()) return;

    const finalArea = this.isCustomArea 
      ? this.customAreaName.trim() 
      : this.selectedAreaOption.trim();

    if (!finalArea) return;

    this.save.emit({
      ...this.formData,
      area: finalArea
    });
  }
}
