import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from 'app/core/services/api.service';

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  outOfStockProducts: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div>
      <h2 style="font-family:var(--font-display);font-size:2rem;margin-bottom:32px">DASHBOARD</h2>

      @if (loading()) {
        <div class="flex-center" style="height:200px"><div class="spinner"></div></div>
      } @else {
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">{{ stats().totalUsers }}</div>
            <div class="stat-label text-muted">Usuários</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">📦</div>
            <div class="stat-value">{{ stats().totalProducts }}</div>
            <div class="stat-label text-muted">Produtos</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">🛒</div>
            <div class="stat-value">{{ stats().totalOrders }}</div>
            <div class="stat-label text-muted">Pedidos</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">💰</div>
            <div class="stat-value mono text-ice">R$ {{ stats().totalRevenue | number:'1.0-0' }}</div>
            <div class="stat-label text-muted">Receita Total</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">⏳</div>
            <div class="stat-value">{{ stats().pendingOrders }}</div>
            <div class="stat-label text-muted">Pedidos Pendentes</div>
          </div>
          <div class="stat-card card">
            <div class="stat-icon">⚠️</div>
            <div class="stat-value" [style.color]="stats().outOfStockProducts > 0 ? 'var(--error)' : 'inherit'">{{ stats().outOfStockProducts }}</div>
            <div class="stat-label text-muted">Sem Estoque</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media(max-width:900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    .stat-card { padding: 24px; text-align: center; }
    .stat-icon { font-size: 2rem; margin-bottom: 12px; }
    .stat-value { font-size: 2rem; font-weight: 700; }
    .stat-label { font-size: 0.85rem; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<AdminStats>({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0, outOfStockProducts: 0 });
  loading = signal(true);

  ngOnInit() {
    this.api.get<AdminStats>('/api/admin/stats').subscribe({
      next: s => { this.stats.set(s); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
