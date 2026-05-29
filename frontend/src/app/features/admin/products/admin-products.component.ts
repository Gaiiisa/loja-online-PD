import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductService } from 'app/core/services/product.service';
import { ToastService } from 'app/core/services/toast.service';
import { Product } from 'app/core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div>
      <div class="flex-between" style="margin-bottom:24px">
        <h2 style="font-family:var(--font-display);font-size:2rem">PRODUTOS</h2>
      </div>

      @if (loading()) {
        <div class="flex-center" style="height:200px"><div class="spinner"></div></div>
      } @else {
        <div class="table-wrap card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (p of products(); track p.id) {
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <span>{{ p.emoji }}</span>
                      <span>{{ p.name }}</span>
                      @if (p.badge) { <span class="badge badge-{{ p.badge }}">{{ p.badge }}</span> }
                    </div>
                  </td>
                  <td class="text-muted">{{ p.category }}</td>
                  <td class="mono">R$ {{ p.price | number:'1.2-2' }}</td>
                  <td [style.color]="p.stock === 0 ? 'var(--error)' : 'inherit'">{{ p.stock }}</td>
                  <td>
                    <span [style.color]="p.active ? 'var(--success)' : 'var(--muted)'">
                      {{ p.active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm" (click)="deleteProduct(p)">Excluir</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-wrap { overflow-x: auto; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .admin-table th { padding: 12px 16px; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); border-bottom: 1px solid var(--border); }
    .admin-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); }
    .admin-table tr:last-child td { border-bottom: none; }
    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
  `]
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private toast = inject(ToastService);
  products = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.productService.getProducts({ size: 100 }).subscribe({
      next: r => { this.products.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  deleteProduct(p: Product) {
    if (!confirm(`Excluir "${p.name}"?`)) return;
    this.productService.delete(p.id).subscribe({
      next: () => {
        this.products.update(items => items.filter(i => i.id !== p.id));
        this.toast.success('Produto excluído');
      },
      error: e => this.toast.error(e.error?.message ?? 'Erro ao excluir')
    });
  }
}
