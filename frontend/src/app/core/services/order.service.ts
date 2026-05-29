import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'app/core/services/api.service';
import { Order, OrderRequest } from 'app/core/models/order.model';
import { PageResponse } from 'app/core/models/product.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(ApiService);

  createOrder(req: OrderRequest): Observable<Order> {
    return this.api.post<Order>('/api/orders', req);
  }

  getMyOrders(page = 0, size = 10): Observable<PageResponse<Order>> {
    return this.api.get<PageResponse<Order>>('/api/orders', { page, size });
  }

  getById(id: number): Observable<Order> {
    return this.api.get<Order>(`/api/orders/${id}`);
  }

  getAllOrders(page = 0, size = 20): Observable<PageResponse<Order>> {
    return this.api.get<PageResponse<Order>>('/api/admin/orders', { page, size });
  }

  updateStatus(id: number, status: string): Observable<Order> {
    return this.api.patch<Order>(`/api/admin/orders/${id}/status`, { status });
  }
}
