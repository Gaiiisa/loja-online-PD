import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { OrderService } from 'app/core/services/order.service';
import { Order } from 'app/core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  template: `
    <div class="container section">
      <h1 class="page-title" style="margin-bottom:32px">MEUS PEDIDOS</h1>

      @if (loading()) {
        <div class="flex-center" style="height:200px"><div class="spinner"></div></div>
      } @else if (orders().length === 0) {
        <div class="empty-state">
          <h3>Nenhum pedido ainda</h3>
          <p>Quando você fizer uma compra, seus pedidos aparecerão aqui.</p>
        </div>
      } @else {
        <div class="orders-list">
          @for (order of orders(); track order.id) {
            <div class="order-card card">
              <div class="order-header">
                <div>
                  <span class="mono text-ice">{{ order.orderNumber }}</span>
                  <span class="order-status badge-{{ statusClass(order.status) }}" style="margin-left:12px;padding:3px 10px;border-radius:4px;font-size:0.75rem;font-weight:700;text-transform:uppercase">{{ order.status }}</span>
                </div>
                <span class="text-muted text-sm">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="order-items">
                @for (item of order.items; track item.productId) {
                  <span>{{ item.emoji }} {{ item.productName }} × {{ item.quantity }}</span>
                }
              </div>
              <div class="order-footer">
                <span class="text-muted text-sm">{{ order.paymentMethod }}</span>
                <span class="mono text-ice">R$ {{ order.total | number:'1.2-2' }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-list { display: flex; flex-direction: column; gap: 16px; }
    .order-card { padding: 20px; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .order-items { display: flex; flex-wrap: wrap; gap: 12px; font-size: 0.9rem; margin-bottom: 12px; color: var(--muted); }
    .order-footer { display: flex; justify-content: space-between; font-size: 0.9rem; }
    .badge-success { background: var(--success); color: #fff; }
    .badge-warn { background: var(--warn); color: var(--black); }
    .badge-error { background: var(--error); color: #fff; }
    .badge-info { background: var(--carbon); border: 1px solid var(--border); color: var(--text); }
  `]
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: res => { this.orders.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'warn', PAID: 'success', PROCESSING: 'info',
      SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'error', REFUNDED: 'error'
    };
    return map[status] ?? 'info';
  }
}
