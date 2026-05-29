import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { CartService } from 'app/core/services/cart.service';
import { OrderService } from 'app/core/services/order.service';
import { ToastService } from 'app/core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  template: `
    <div class="container section">
      <h1 class="page-title" style="margin-bottom:32px">CHECKOUT</h1>

      @if (success()) {
        <div class="success-box card text-center">
          <div style="font-size:4rem">✅</div>
          <h2 style="margin:16px 0 8px">Pedido realizado!</h2>
          <p class="text-muted">{{ successMsg() }}</p>
          <a routerLink="/orders" class="btn btn-primary mt-lg">Ver Meus Pedidos</a>
        </div>
      } @else {
        <div class="checkout-layout">
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="card" style="padding:24px;margin-bottom:16px">
              <h3 style="margin-bottom:20px">Endereço de entrega</h3>
              <div class="form-group">
                <label class="form-label">Nome completo</label>
                <input class="form-control" type="text" formControlName="name" maxlength="100">
              </div>
              <div class="form-group">
                <label class="form-label">E-mail para confirmação</label>
                <input class="form-control" type="email" formControlName="email" maxlength="100">
              </div>
              <div class="form-group">
                <label class="form-label">Endereço</label>
                <input class="form-control" type="text" formControlName="address" placeholder="Rua, número, complemento" maxlength="255">
              </div>
              <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px">
                <div class="form-group">
                  <label class="form-label">Cidade</label>
                  <input class="form-control" type="text" formControlName="city" maxlength="100">
                </div>
                <div class="form-group">
                  <label class="form-label">Estado</label>
                  <input class="form-control" type="text" formControlName="state" placeholder="SP" maxlength="2">
                </div>
                <div class="form-group">
                  <label class="form-label">CEP</label>
                  <input class="form-control" type="text" formControlName="zip" placeholder="00000-000" maxlength="10">
                </div>
              </div>
            </div>

            <div class="card" style="padding:24px">
              <h3 style="margin-bottom:20px">Pagamento</h3>
              <div class="form-group">
                <label class="form-label">Método de pagamento</label>
                <select class="form-control" formControlName="paymentMethod">
                  <option value="CREDIT_CARD">Cartão de crédito</option>
                  <option value="PIX">PIX</option>
                  <option value="BOLETO">Boleto</option>
                </select>
              </div>
            </div>

            @if (errorMsg()) {
              <p class="form-error mt-md">{{ errorMsg() }}</p>
            }

            <button class="btn btn-primary btn-lg w-full mt-md" type="submit" [disabled]="loading()">
              {{ loading() ? 'Processando...' : 'Confirmar Pedido — R$ ' + (cart.subtotal() + (cart.subtotal() >= 299 ? 0 : 19.9) | number:'1.2-2') }}
            </button>
          </form>

          <aside class="order-summary card">
            <h3 style="margin-bottom:16px">Seu Pedido</h3>
            @for (item of cart.items(); track item.product.id) {
              <div style="display:flex;gap:8px;margin-bottom:8px;font-size:0.9rem">
                <span>{{ item.product.emoji }}</span>
                <span style="flex:1">{{ item.product.name }} × {{ item.qty }}</span>
                <span class="mono">R$ {{ item.product.price * item.qty | number:'1.2-2' }}</span>
              </div>
            }
            <hr class="divider">
            <div style="display:flex;justify-content:space-between;font-weight:700">
              <span>Total</span>
              <span class="mono text-ice">R$ {{ (cart.subtotal() + (cart.subtotal() >= 299 ? 0 : 19.9)) | number:'1.2-2' }}</span>
            </div>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
    @media(max-width:768px) { .checkout-layout { grid-template-columns: 1fr; } }
    .order-summary { padding: 24px; }
    .success-box { padding: 60px; max-width: 480px; margin: 0 auto; }
    .w-full { width: 100%; }
  `]
})
export class CheckoutComponent {
  cart = inject(CartService);
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    address: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    city: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    state: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    zip: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    paymentMethod: new FormControl('CREDIT_CARD', [Validators.required, Validators.maxLength(50)])
  });

  loading = signal(false);
  errorMsg = signal('');
  success = signal(false);
  successMsg = signal('');

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.cart.items().length === 0) { this.errorMsg.set('Carrinho vazio'); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    const v = this.form.value;
    this.orderService.createOrder({
      items: this.cart.items().map(i => ({ productId: i.product.id, quantity: i.qty })),
      paymentMethod: v.paymentMethod!,
      shipping: { name: v.name!, email: v.email!, address: v.address!, city: v.city!, state: v.state!, zip: v.zip! }
    }).subscribe({
      next: order => {
        this.cart.clear();
        this.successMsg.set(`Pedido ${order.orderNumber} confirmado!`);
        this.success.set(true);
        this.loading.set(false);
        this.toast.success('Pedido realizado com sucesso!');
      },
      error: e => {
        this.errorMsg.set(e.error?.message ?? 'Erro ao processar pedido');
        this.loading.set(false);
      }
    });
  }
}
