import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        <div class="glass-panel border border-slate-700/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
          <div class="flex items-center gap-3 text-rose-400">
            <div class="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-100">{{ title }}</h3>
          </div>

          <p class="text-sm text-slate-300 leading-relaxed">{{ message }}</p>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              (click)="onCancel()"
              class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">
              Cancelar
            </button>
            <button 
              type="button" 
              (click)="onConfirm()"
              class="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2">
              Confirmar Exclusão
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar exclusão';
  @Input() message = 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
