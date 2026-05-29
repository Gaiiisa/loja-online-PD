import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from 'app/shared/components/product-card/product-card.component';
import { ProductService } from 'app/core/services/product.service';
import { Product } from 'app/core/models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  template: `
    <div class="container section">
      <div class="page-header">
        <h1 class="page-title">CATÁLOGO</h1>
        <p class="text-muted">{{ totalElements() }} produtos encontrados</p>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <input class="form-control" type="search" placeholder="Buscar produto..." [(ngModel)]="search" (ngModelChange)="onSearch()">
        <select class="form-control" [(ngModel)]="sort" (ngModelChange)="loadProducts()">
          <option value="newest">Mais recentes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="rating">Mais avaliados</option>
        </select>
      </div>

      <!-- Grid -->
      @if (loading()) {
        <div class="flex-center" style="height:300px"><div class="spinner"></div></div>
      } @else if (products().length === 0) {
        <div class="empty-state">
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar os filtros</p>
        </div>
      } @else {
        <div class="grid grid-4">
          @for (p of products(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>

        <!-- Pagination -->
        <div class="pagination flex-center gap-sm mt-lg">
          <button class="btn btn-outline btn-sm" [disabled]="page() === 0" (click)="prevPage()">← Anterior</button>
          <span class="text-muted text-sm">{{ page() + 1 }} / {{ totalPages() }}</span>
          <button class="btn btn-outline btn-sm" [disabled]="page() >= totalPages() - 1" (click)="nextPage()">Próxima →</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .filters-bar { display: flex; gap: 16px; margin-bottom: 32px; }
    .filters-bar .form-control { max-width: 360px; }
    .filters-bar select { max-width: 180px; }
  `]
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  page = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  search = '';
  sort = 'newest';
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.loading.set(true);
    this.productService.getProducts({ search: this.search, sort: this.sort, page: this.page(), size: 12 }).subscribe({
      next: res => {
        this.products.set(res.data);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page.set(0); this.loadProducts(); }, 400);
  }

  prevPage() { if (this.page() > 0) { this.page.update(p => p - 1); this.loadProducts(); } }
  nextPage() { if (this.page() < this.totalPages() - 1) { this.page.update(p => p + 1); this.loadProducts(); } }
}
