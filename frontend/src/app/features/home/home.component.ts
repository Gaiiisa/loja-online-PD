import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from 'app/shared/components/product-card/product-card.component';
import { ProductService } from 'app/core/services/product.service';
import { Product } from 'app/core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-content">
        <h1 class="hero-title">STYLE<br><span class="text-ice">ZERO</span><br>LIMITS</h1>
        <p class="hero-sub">Streetwear para quem vive no limite.</p>
        <a routerLink="/catalog" class="btn btn-primary btn-lg">Ver Coleção</a>
      </div>
    </section>

    <!-- Featured -->
    <section class="section container">
      <h2 class="section-title">DESTAQUES</h2>
      @if (loading()) {
        <div class="flex-center" style="height:200px"><div class="spinner"></div></div>
      } @else {
        <div class="grid grid-4">
          @for (p of featured(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>
      }
      <div class="text-center mt-lg">
        <a routerLink="/catalog" class="btn btn-outline">Ver Todos os Produtos</a>
      </div>
    </section>

    <!-- Features strip -->
    <section class="features-strip">
      <div class="container features-grid">
        <div class="feature">🚚 Frete grátis acima de R$ 299</div>
        <div class="feature">🔒 Pagamento 100% seguro</div>
        <div class="feature">↩️ Troca fácil em 30 dias</div>
        <div class="feature">⚡ Entrega expressa SP/RJ</div>
      </div>
    </section>
  `,
  styles: [`
    .hero { min-height: 70vh; background: linear-gradient(135deg, var(--void) 0%, var(--carbon) 100%); display: flex; align-items: center; border-bottom: 1px solid var(--border); }
    .hero-content { padding: 60px 0; }
    .hero-title { font-family: var(--font-display); font-size: clamp(4rem, 10vw, 8rem); line-height: 0.9; margin-bottom: 24px; }
    .hero-sub { font-size: 1.2rem; color: var(--muted); margin-bottom: 40px; }
    .section-title { font-family: var(--font-display); font-size: 2.5rem; margin-bottom: 32px; }
    .features-strip { background: var(--void); border-top: 1px solid var(--border); padding: 24px 0; }
    .features-grid { display: flex; gap: 48px; flex-wrap: wrap; justify-content: center; }
    .feature { font-size: 0.9rem; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  featured = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.productService.getFeatured().subscribe({
      next: p => { this.featured.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
