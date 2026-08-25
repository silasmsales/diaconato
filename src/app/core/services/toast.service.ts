import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private currentTimeout: any = null;

  show(toast: Omit<ToastMessage, 'id'>) {
    // Limpar timer do toast anterior
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id, duration: toast.duration || 4000 };
    
    // Garantir exibição de APENAS UM toast por vez em toda a aplicação
    this.toasts.set([newToast]);

    this.currentTimeout = setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
  }

  success(title: string, message?: string) {
    this.show({ type: 'success', title, message });
  }

  error(title: string, message?: string) {
    this.show({ type: 'error', title, message });
  }

  info(title: string, message?: string) {
    this.show({ type: 'info', title, message });
  }

  warning(title: string, message?: string) {
    this.show({ type: 'warning', title, message });
  }

  remove(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.toasts.set([]);
  }
}
