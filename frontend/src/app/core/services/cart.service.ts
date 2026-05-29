import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/order.model';
import { Product } from '../models/product.model';

const CART_KEY = 'zg_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.load());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((s, i) => s + i.qty, 0));
  readonly subtotal = computed(() => this._items().reduce((s, i) => s + i.product.price * i.qty, 0));

  add(product: Product, qty = 1) {
    this._items.update(items => {
      const idx = items.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const updated = [...items];
        const newQty = Math.min(updated[idx].qty + qty, product.stock);
        updated[idx] = { ...updated[idx], qty: newQty };
        return updated;
      }
      return [...items, { product, qty: Math.min(qty, product.stock) }];
    });
    this.save();
  }

  remove(productId: number) {
    this._items.update(items => items.filter(i => i.product.id !== productId));
    this.save();
  }

  changeQty(productId: number, qty: number) {
    if (qty <= 0) { this.remove(productId); return; }
    this._items.update(items => {
      const idx = items.findIndex(i => i.product.id === productId);
      if (idx < 0) return items;
      const updated = [...items];
      updated[idx] = { ...updated[idx], qty: Math.min(qty, items[idx].product.stock) };
      return updated;
    });
    this.save();
  }

  clear() {
    this._items.set([]);
    localStorage.removeItem(CART_KEY);
  }

  private save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this._items()));
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
