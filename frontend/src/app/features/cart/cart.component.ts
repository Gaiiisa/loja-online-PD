import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartService } from 'app/core/services/cart.service';
import { ToastService } from 'app/core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="container section">
      <h1 class="page-title" style="margin-bottom:32px">MEU CARRINHO</h1>

      @if (cart.items().length === 0) {
        <div class="empty-state">
          <h3>Carrinho vazio</h3>
          <p>Explore nosso catálogo e adicione produtos.</p>
          <a routerLink="/catalog" class="btn btn-primary mt-lg">Ver Catálogo</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-items">
            @for (item of cart.items(); track item.product.id) {
              <div class="cart-item card">
                <span class="item-emoji">{{ item.product.emoji ?? '📦' }}</span>
                <div class="item-details">
                  <h4>{{ item.product.name }}</h4>
                  <p class="text-muted text-sm">R$ {{ item.product.price | number:'1.2-2' }} un.</p>
                </div>
                <div class="qty-ctrl">
                  <button class="btn btn-ghost btn-sm" (click)="cart.changeQty(item.product.id, item.qty - 1)">−</button>
                  <span>{{ item.qty }}</span>
                  <button class="btn btn-ghost btn-sm" (click)="cart.changeQty(item.product.id, item.qty + 1)" [disabled]="item.qty >= item.product.stock">+</button>
                </div>
                <span class="item-subtotal mono">R$ {{ item.product.price * item.qty | number:'1.2-2' }}</span>
                <button class="btn btn-ghost btn-sm" (click)="cart.remove(item.product.id)">✕</button>
              </div>
            }
          </div>

          <aside class="cart-summary card">
            <h3 style="margin-bottom:16px">Resumo</h3>
            <div class="summary-row"><span>Subtotal</span><span class="mono">R$ {{ cart.subtotal() | number:'1.2-2' }}</span></div>
            <div class="summary-row">
              <span>Frete</span>
              <span class="mono">{{ cart.subtotal() >= 299 ? 'Grátis' : 'R$ 19,90' }}</span>
            </div>
            <hr class="divider">
            <div class="summary-row summary-total">
              <span>Total</span>
              <span class="mono text-ice">R$ {{ total() | number:'1.2-2' }}</span>
            </div>
            <a routerLink="/checkout" class="btn btn-primary w-full mt-md">Finalizar Compra</a>
            <a routerLink="/catalog" class="btn btn-ghost w-full mt-sm text-center">Continuar Comprando</a>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
    @media(max-width:768px) { .cart-layout { grid-template-columns: 1fr; } }
    .cart-item { display: flex; align-items: center; gap: 16px; padding: 16px; margin-bottom: 12px; }
    .item-emoji { font-size: 2.5rem; min-width: 60px; text-align: center; }
    .item-details { flex: 1; }
    .qty-ctrl { display: flex; align-items: center; gap: 12px; }
    .item-subtotal { font-family: var(--font-mono); min-width: 90px; text-align: right; }
    .cart-summary { padding: 24px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; }
    .summary-total { font-size: 1.1rem; font-weight: 700; }
    .w-full { width: 100%; }
  `]
})
export class CartComponent {
  cart = inject(CartService);
  private toast = inject(ToastService);

  total() {
    const sub = this.cart.subtotal();
    const ship = sub >= 299 ? 0 : 19.9;
    return sub + ship;
  }
}
