import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'app/core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-box card">
        <h1 class="auth-title">ENTRAR</h1>
        <p class="text-muted text-sm" style="margin-bottom:24px">Acesse sua conta ZeroGrau</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input class="form-control" type="email" formControlName="email" placeholder="seu@email.com" autocomplete="email">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="form-error">E-mail inválido</p>
            }
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input class="form-control" type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password">
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <p class="form-error">Senha obrigatória</p>
            }
          </div>

          @if (errorMsg()) {
            <p class="form-error" style="margin-bottom:16px">{{ errorMsg() }}</p>
          }

          <button class="btn btn-primary w-full" type="submit" [disabled]="loading()">
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <hr class="divider">
        <p class="text-center text-sm text-muted">
          Não tem conta? <a routerLink="/auth/register" class="text-ice">Criar conta</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
    .auth-box { width: 100%; max-width: 420px; padding: 40px; }
    .auth-title { font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 4px; }
    .w-full { width: 100%; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  loading = signal(false);
  errorMsg = signal('');

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    this.auth.login({ email: this.form.value.email!, password: this.form.value.password! }).subscribe({
      next: () => { this.toast.success('Bem-vindo(a)!'); this.router.navigate(['/']); },
      error: () => { this.errorMsg.set('Credenciais inválidas'); this.loading.set(false); }
    });
  }
}
