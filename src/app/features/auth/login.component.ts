import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center p-4">
      <div class="glass-panel border border-slate-700/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        <!-- Logo & Header -->
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-[2px] shadow-xl shadow-indigo-600/30 mx-auto">
            <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <svg class="w-7 h-7 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m-7-7l7-7 7 7" />
                <circle cx="12" cy="12" r="9" stroke-width="2" />
              </svg>
            </div>
          </div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">
            Gestão do Diaconato
          </h1>
          <p class="text-xs text-slate-400">
            Acesse com suas credenciais autorizadas
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- E-mail -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              E-mail *
            </label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="seuemail@igreja.com"
              class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
            />
            @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
              <span class="text-[11px] text-rose-400">Insira um e-mail válido</span>
            }
          </div>

          <!-- Senha -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Senha *
            </label>
            <input 
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
            />
            @if (form.get('password')?.touched && form.get('password')?.hasError('minlength')) {
              <span class="text-[11px] text-rose-400">A senha deve ter no mínimo 6 caracteres</span>
            }
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            [disabled]="form.invalid || authService.loading()"
            class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2">
            @if (authService.loading()) {
              <span class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            }
            <span>Entrar no Sistema</span>
          </button>
        </form>

        <div class="text-center pt-2 border-t border-slate-800">
          <p class="text-[11px] text-slate-500">
            Acesso restrito. Solicite seu cadastro ao administrador pastoral.
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    await this.authService.login(email, password);
  }
}