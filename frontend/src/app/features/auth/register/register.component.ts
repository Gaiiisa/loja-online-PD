import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'app/core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-box card">
        <h1 class="auth-title">CRIAR CONTA</h1>
        <p class="text-muted text-sm" style="margin-bottom:24px">Junte-se ao universo ZeroGrau</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label class="form-label">Nome completo</label>
<input class="form-control" type="text" formControlName="name" placeholder="Seu nome" autocomplete="name" maxlength="100">
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <p class="form-error">
                @if (form.get('name')?.errors?.['required']) { Nome é obrigatório }
                @if (form.get('name')?.errors?.['maxlength']) { Máximo 100 caracteres }
              </p>
            }
          </div>
          <div class="form-group">
            <label class="form-label">E-mail</label>
<input class="form-control" type="email" formControlName="email" placeholder="seu@email.com" autocomplete="email" maxlength="100">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="form-error">
                @if (form.get('email')?.errors?.['required']) { E-mail é obrigatório }
                @if (form.get('email')?.errors?.['email']) { E-mail inválido }
                @if (form.get('email')?.errors?.['maxlength']) { Máximo 100 caracteres }
              </p>
            }
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
<input class="form-control" type="password" formControlName="password" placeholder="mín. 6 caracteres" autocomplete="new-password" maxlength="100">
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <p class="form-error">
                @if (form.get('password')?.errors?.['required']) { Senha é obrigatória }
                @if (form.get('password')?.errors?.['minlength']) { Mínimo 6 caracteres }
                @if (form.get('password')?.errors?.['maxlength']) { Máximo 100 caracteres }
              </p>
            }
          </div>

          @if (errorMsg()) {
            <p class="form-error" style="margin-bottom:16px">{{ errorMsg() }}</p>
          }

          <button class="btn btn-primary w-full" type="submit" [disabled]="loading()">
            {{ loading() ? 'Criando conta...' : 'Criar Conta' }}
          </button>
        </form>

        <hr class="divider">
        <p class="text-center text-sm text-muted">
          Já tem conta? <a routerLink="/auth/login" class="text-ice">Entrar</a>
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
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100)])
  });

  loading = signal(false);
  errorMsg = signal('');

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    this.auth.register({
      name: this.form.value.name!,
      email: this.form.value.email!,
      password: this.form.value.password!
    }).subscribe({
      next: () => { this.toast.success('Conta criada!'); this.router.navigate(['/']); },
      error: (e) => {
        this.errorMsg.set(e.error?.message ?? 'Erro ao criar conta');
        this.loading.set(false);
      }
    });
  }
}
