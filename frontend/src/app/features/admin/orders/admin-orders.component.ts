import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from 'app/core/services/order.service';
import { ToastService } from 'app/core/services/toast.service';
import { Order } from 'app/core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DecimalPipe, DatePipe, FormsModule],
  template: `
    <div>
      <h2 style="font-family:var(--font-display);font-size:2rem;margin-bottom:24px">PEDIDOS</h2>

      @if (loading()) {
        <div class="flex-center" style="height:200px"><div class="spinner"></div></div>
      } @else {
        <div class="table-wrap card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (o of orders(); track o.id) {
                <tr>
                  <td class="mono text-ice">{{ o.orderNumber }}</td>
                  <td>
                    <div>{{ o.shippingInfo.name }}</div>
                    <div class="text-muted text-sm">{{ o.shippingInfo.email }}</div>
                  </td>
                  <td class="mono">R$ {{ o.total | number:'1.2-2' }}</td>
                  <td>
                    <select class="form-control" style="padding:4px 8px;font-size:0.8rem"
                      [value]="o.status"
                      (change)="updateStatus(o, $event)">
                      <option>PENDING</option>
                      <option>PAID</option>
                      <option>PROCESSING</option>
                      <option>SHIPPED</option>
                      <option>DELIVERED</option>
                      <option>CANCELLED</option>
                      <option>REFUNDED</option>
                    </select>
                  </td>
                  <td class="text-muted text-sm">{{ o.createdAt | date:'dd/MM/yy HH:mm' }}</td>
                  <td class="text-sm text-muted">{{ o.items.length }} item(s)</td>
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
  `]
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.orderService.getAllOrders(0, 50).subscribe({
      next: r => { this.orders.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  updateStatus(order: Order, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.orderService.updateStatus(order.id, status).subscribe({
      next: updated => {
        this.orders.update(arr => arr.map(o => o.id === updated.id ? updated : o));
        this.toast.success('Status atualizado');
      },
      error: e => this.toast.error(e.error?.message ?? 'Erro')
    });
  }
}
