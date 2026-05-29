import { Component, inject, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from 'app/core/models/product.model';
import { CartService } from 'app/core/services/cart.service';
import { ToastService } from 'app/core/services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="product-card card">
      <div class="product-img">
        <span class="product-emoji">{{ product().emoji ?? '📦' }}</span>
        @if (product().badge) {
          <span class="badge badge-{{ product().badge }}">{{ product().badge }}</span>
        }
        @if (product().stock === 0) {
          <span class="sold-out">Esgotado</span>
        }
      </div>
      <div class="product-info">
        <p class="product-cat text-muted text-sm">{{ product().category }}</p>
        <h3 class="product-name">{{ product().name }}</h3>
        <div class="product-price">
          <span class="price-current">R$ {{ product().price | number:'1.2-2' }}</span>
          @if (product().originalPrice) {
            <span class="price-old text-muted text-sm"><s>R$ {{ product().originalPrice | number:'1.2-2' }}</s></span>
          }
        </div>
        <div class="product-rating text-sm">
          ⭐ {{ product().rating }} · {{ product().stock }} em estoque
        </div>
        <button
          class="btn btn-primary w-full mt-md"
          [disabled]="product().stock === 0"
          (click)="addToCart()">
          {{ product().stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card { transition: transform 0.2s, box-shadow 0.2s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,191,255,0.15); }
    .product-img { background: var(--void); padding: 40px 20px; text-align: center; position: relative; font-size: 5rem; min-height: 180px; display: flex; align-items: center; justify-content: center; }
    .product-emoji { line-height: 1; }
    .badge { position: absolute; top: 12px; left: 12px; }
    .sold-out { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--muted); }
    .product-info { padding: 16px; }
    .product-name { font-weight: 700; font-size: 1rem; margin: 4px 0 8px; }
    .product-price { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
    .price-current { font-family: var(--font-mono); font-size: 1.2rem; color: var(--ice); font-weight: 700; }
    .w-full { width: 100%; }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();
  added = output<Product>();

  private cart = inject(CartService);
  private toast = inject(ToastService);

  addToCart() {
    this.cart.add(this.product());
    this.toast.success(`${this.product().name} adicionado ao carrinho`);
    this.added.emit(this.product());
  }
}
